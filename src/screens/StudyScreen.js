// src/screens/StudyScreen.js
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useDecks } from '../state/DecksContext';

function shuffle(array) {
    const a = [...array];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export default function StudyScreen({ route, navigation }) {
    const { deckId, title, mode = 'all', wrongIds = [] } = route.params || {};
    const { decks } = useDecks();
    const deck = useMemo(() => decks.find(d => d.id === deckId), [decks, deckId]);

    const initialQueue = useMemo(() => {
        if (!deck) return [];
        const base = deck.cards || [];
        const subset = mode === 'wrong' ? base.filter(c => wrongIds.includes(c.id)) : base;
        return shuffle(subset);
    }, [deck, mode, wrongIds]);

    const [queue, setQueue] = useState(initialQueue);
    const [idx, setIdx] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [correctIds, setCorrectIds] = useState([]);
    const [wrongIdsLocal, setWrongIdsLocal] = useState([]);

    useEffect(() => {
        navigation.setOptions({ title: `Study — ${title || ''}` });
    }, [navigation, title]);

    if (!deck) {
        return (
            <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
                <Text>Deck not found.</Text>
            </View>
        );
    }
    if (!queue.length) {
        return (
            <View style={{ flex:1, justifyContent:'center', alignItems:'center', padding:16 }}>
                <Text style={{ textAlign:'center' }}>
                    {mode === 'wrong' ? 'No wrong cards to review.' : 'This deck has no cards yet.'}
                </Text>
                <Pressable
                    onPress={() => navigation.goBack()}
                    style={{ marginTop:16, backgroundColor:'#6c5ce7', paddingHorizontal:14, paddingVertical:10, borderRadius:8 }}
                >
                    <Text style={{ color:'#fff', fontWeight:'700' }}>Go back</Text>
                </Pressable>
            </View>
        );
    }

    const card = queue[idx];
    const progress = Math.round(((idx) / queue.length) * 100);

    const mark = (isCorrect) => {
        if (isCorrect) setCorrectIds(prev => [...prev, card.id]);
        else setWrongIdsLocal(prev => [...prev, card.id]);

        if (idx + 1 < queue.length) {
            setIdx(idx + 1);
            setFlipped(false);
        } else {
            // done
            const total = queue.length;
            const score = Math.round(( (correctIds.length + (isCorrect ? 1 : 0)) / total) * 100);
            navigation.replace('Results', {
                deckId,
                title,
                total,
                correct: correctIds.length + (isCorrect ? 1 : 0),
                wrongIds: isCorrect ? wrongIdsLocal : [...wrongIdsLocal, card.id],
            });
        }
    };

    return (
        <View style={{ flex:1, padding:16, backgroundColor:'#fff', gap:12 }}>
            {/* top bar */}
            <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
                <Text>{idx + 1} / {queue.length}</Text>
                <Text>{progress}%</Text>
            </View>

            {/* card */}
            <Pressable
                onPress={() => setFlipped(!flipped)}
                style={{
                    flex:1, minHeight:260, borderWidth:1, borderColor:'#ddd', borderRadius:12,
                    alignItems:'center', justifyContent:'center', backgroundColor:'#fafafa', padding:16
                }}
            >
                {!flipped ? (
                    <>
                        <Text style={{ fontSize:16, color:'#666', marginBottom:8 }}>Question</Text>
                        <Text style={{ fontSize:22, textAlign:'center' }}>{card.front}</Text>
                        {card.imageFrontUri ? (
                            <Image source={{ uri: card.imageFrontUri }} style={{ width: 220, height: 160, marginTop: 10, borderRadius: 8 }} />
                        ) : null}
                        <Text style={{ marginTop:12, color:'#888' }}>Tap to flip</Text>
                    </>
                ) : (
                    <>
                        <Text style={{ fontSize:16, color:'#666', marginBottom:8 }}>Answer</Text>
                        <Text style={{ fontSize:22, textAlign:'center' }}>{card.back}</Text>
                        {card.imageBackUri ? (
                            <Image source={{ uri: card.imageBackUri }} style={{ width: 220, height: 160, marginTop: 10, borderRadius: 8 }} />
                        ) : null}
                        <Text style={{ marginTop:12, color:'#888' }}>Tap to flip back</Text>
                    </>
                )}
            </Pressable>

            {/* actions */}
            {flipped ? (
                <View style={{ flexDirection:'row', gap:12 }}>
                    <Pressable
                        onPress={() => mark(false)}
                        style={{ flex:1, backgroundColor:'#e53935', padding:14, borderRadius:10, alignItems:'center' }}
                    >
                        <Text style={{ color:'#fff', fontWeight:'700' }}>No</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => mark(true)}
                        style={{ flex:1, backgroundColor:'#43a047', padding:14, borderRadius:10, alignItems:'center' }}
                    >
                        <Text style={{ color:'#fff', fontWeight:'700' }}>Yes</Text>
                    </Pressable>
                </View>
            ) : (
                <View style={{ alignItems:'center' }}>
                    <Text style={{ color:'#888' }}>Flip to answer to enable Yes/No</Text>
                </View>
            )}
        </View>
    );
}