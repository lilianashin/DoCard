import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DecksCtx = createContext();
const KEY = '@docard:decks';

export function DecksProvider({ children }) {
    const [decks, setDecks] = useState([]); // [{id, title, count, cards:[], lastScore?}]
    const [ready, setReady] = useState(false);

    // load
    useEffect(() => {
        (async () => {
            try {
                const raw = await AsyncStorage.getItem(KEY);
                if (raw) setDecks(JSON.parse(raw));
            } finally {
                setReady(true);
            }
        })();
    }, []);

    // save
    useEffect(() => {
        if (ready) AsyncStorage.setItem(KEY, JSON.stringify(decks));
    }, [decks, ready]);

    // --- deck ops ---
    const addDeck = (title) => {
        const id = Date.now().toString();
        setDecks(prev => [{ id, title, count: 0, cards: [] }, ...prev]);
    };
    const removeDeck = (id) => setDecks(prev => prev.filter(d => d.id !== id));
    const updateCount = (id, delta) => {
        setDecks(prev => prev.map(d => d.id === id ? { ...d, count: Math.max(0, (d.count || 0) + delta) } : d));
    };
    const setDeckScore = (deckId, { correct, total }) => {
        const pct = total ? Math.round((correct / total) * 100) : 0;
        const when = new Date().toISOString();
        setDecks(prev => prev.map(d => d.id === deckId ? { ...d, lastScore: { correct, total, pct, when } } : d));
    };

    // --- card ops ---
    const addCard = (deckId, { front, back, imageFrontUri = null, imageBackUri = null }) => {
        setDecks(prev => prev.map(d => {
            if (d.id !== deckId) return d;
            const newCard = { id: Date.now().toString(), front, back, imageFrontUri, imageBackUri };
            const cards = [newCard, ...(d.cards || [])];
            return { ...d, cards, count: cards.length };
        }));
    };
    const removeCard = (deckId, cardId) => {
        setDecks(prev => prev.map(d => {
            if (d.id !== deckId) return d;
            const cards = (d.cards || []).filter(c => c.id !== cardId);
            return { ...d, cards, count: cards.length };
        }));
    };
    const updateCard = (deckId, cardId, partial) => {
        setDecks(prev => prev.map(d => {
            if (d.id !== deckId) return d;
            const cards = (d.cards || []).map(c => c.id === cardId ? { ...c, ...partial } : c);
            return { ...d, cards, count: cards.length };
        }));
    };

    return (
        <DecksCtx.Provider value={{
            decks, ready,
            addDeck, removeDeck, updateCount,
            addCard, removeCard, updateCard,
            setDeckScore,
        }}>
            {children}
        </DecksCtx.Provider>
    );
}

export const useDecks = () => useContext(DecksCtx);
