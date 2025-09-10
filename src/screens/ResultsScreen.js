import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useDecks } from '../state/DecksContext';

export default function ResultsScreen({ route, navigation }) {
    const { deckId, title, total, correct, wrongIds = [] } = route.params || {};
    const { setDeckScore } = useDecks();

    const pct = total ? Math.round((correct / total) * 100) : 0;

    // ensure we store it once when the screen shows
    React.useEffect(() => {
        if (deckId && typeof correct === 'number' && typeof total === 'number') {
            setDeckScore(deckId, { correct, total });
        }
    }, [deckId, correct, total, setDeckScore]);

    return (
        <View style={{ flex:1, padding:16, backgroundColor:'#fff', gap:16, alignItems:'center', justifyContent:'center' }}>
            <Text style={{ fontSize:22, fontWeight:'800' }}>Session complete</Text>
            <Text style={{ fontSize:18 }}>{title}</Text>
            <Text style={{ fontSize:28, marginTop:8 }}>{correct} / {total}  ({pct}%)</Text>

            <View style={{ flexDirection:'row', gap:12, marginTop:16 }}>
                <Pressable
                    onPress={() => navigation.replace('Study', { deckId, title, mode: 'all' })}
                    style={{ backgroundColor:'#6c5ce7', padding:12, borderRadius:8 }}
                >
                    <Text style={{ color:'#fff', fontWeight:'700' }}>Study all again</Text>
                </Pressable>

                <Pressable
                    onPress={() => navigation.replace('Study', { deckId, title, mode: 'wrong', wrongIds })}
                    style={{ backgroundColor:'#ff9800', padding:12, borderRadius:8 }}
                >
                    <Text style={{ color:'#fff', fontWeight:'700' }}>Review wrong only</Text>
                </Pressable>
            </View>

            <Pressable
                onPress={() => navigation.navigate('Deck', { deckId, title })}
                style={{ marginTop:16 }}
            >
                <Text style={{ color:'#6c5ce7', fontWeight:'700' }}>Back to deck</Text>
            </Pressable>
        </View>
    );
}
