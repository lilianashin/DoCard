import React, { useMemo, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Platform } from 'react-native';
import { useDecks } from '../state/DecksContext';
import { bs } from '../ui/colors';
import { Card, Button, Input, Badge, Progress, SectionHeader, OutlineButton } from '../ui/components';

export default function HomeScreen({ navigation }) {
    const { decks, ready, addDeck } = useDecks();
    const [title, setTitle] = useState('');
    const [query, setQuery] = useState('');

    useFocusEffect(React.useCallback(() => {
        if (Platform.OS === 'web') document.title = 'DoCard – My Flashcards';
    }, []));

    const { totalDecks, totalCards, avgScore } = useMemo(() => {
        const totalDecks = decks.length;
        const totalCards = decks.reduce((s, d) => s + (d.cards?.length || d.count || 0), 0);
        const scored = decks.filter(d => d.lastScore?.pct !== undefined);
        const avgScore = scored.length ? Math.round(scored.reduce((s, d) => s + (d.lastScore?.pct || 0), 0) / scored.length) : null;
        return { totalDecks, totalCards, avgScore };
    }, [decks]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return decks;
        return decks.filter(d => d.title.toLowerCase().includes(q));
    }, [decks, query]);

    if (!ready) {
        return (
            <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor: bs.bg }}>
                <Text>Loading…</Text>
            </View>
        );
    }

    return (
        <View style={{ flex:1, backgroundColor: bs.bg, padding: 16 }}>
            {/* Screen nav (dark bar) */}
            <Card style={{ borderRadius: 20, backgroundColor: '#343a40', borderColor: '#343a40' }}>
                <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
                    <Text style={{ color:'#fff', fontWeight:'800', fontSize:18 }}><Text style={{fontWeight:'800'}}>My Flashcards</Text></Text>
                    <Text style={{ color:'#fff', opacity:0.9 }}>🔎  ⚙️</Text>
                </View>
            </Card>

            {/* Search */}
            <View style={{ marginTop: 12 }}>
                <Input placeholder="Search decks..." value={query} onChangeText={setQuery} />
            </View>

            {/* Add deck */}
            <View style={{ flexDirection:'row', marginTop: 10 }}>
                <Input
                    placeholder="New deck title"
                    value={title}
                    onChangeText={setTitle}
                    style={{ flex:1, marginRight: 8 }}
                />
                <Button
                    title="Create"
                    onPress={() => { const t = title.trim(); if (t) { addDeck(t); setTitle(''); } }}
                    style={{ paddingHorizontal: 16 }}
                />
            </View>

            {/* Quick stats */}
            <Card style={{ marginTop: 14 }}>
                <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
                    <View style={{ alignItems:'center', flex:1 }}>
                        <Text style={{ fontSize:18, fontWeight:'900', color: bs.text }}>{totalCards}</Text>
                        <Text style={{ color: bs.muted, fontSize: 12 }}>Total Cards</Text>
                    </View>
                    <View style={{ alignItems:'center', flex:1 }}>
                        <Text style={{ fontSize:18, fontWeight:'900', color: bs.text }}>{totalDecks}</Text>
                        <Text style={{ color: bs.muted, fontSize: 12 }}>Decks</Text>
                    </View>
                    <View style={{ alignItems:'center', flex:1 }}>
                        <Text style={{ fontSize:18, fontWeight:'900', color: bs.text }}>{avgScore!==null?`${avgScore}%`:'—'}</Text>
                        <Text style={{ color: bs.muted, fontSize: 12 }}>Avg Score</Text>
                    </View>
                </View>
            </Card>

            {/* Header */}
            <SectionHeader title={`Your Study Decks (${filtered.length})`} />

            {/* Deck list */}
            <FlatList
                data={filtered}
                keyExtractor={d => d.id}
                contentContainerStyle={{ paddingBottom: 20 }}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                renderItem={({ item }) => {
                    const pct = item.lastScore?.pct ?? null;
                    const count = item.cards?.length ?? item.count ?? 0;
                    const badgeVariant = pct === null ? 'secondary' : pct >= 80 ? 'success' : pct >= 60 ? 'warning' : 'danger';

                    return (
                        <Card>
                            <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
                                <View style={{ flex: 1, paddingRight: 8 }}>
                                    <Text style={{ fontSize: 16, fontWeight: '700', color: bs.text }}>{item.title}</Text>
                                    <Text style={{ color: bs.muted, marginTop: 2, fontSize: 12 }}>
                                        {count} cards • {pct !== null ? 'avg. score' : 'new'}
                                    </Text>
                                </View>
                                <Badge variant={badgeVariant}>{pct !== null ? `${pct}%` : 'New'}</Badge>
                            </View>

                            <Progress value={pct ?? 0} style={{ marginTop: 8 }} />

                            <View style={{ flexDirection:'row', marginTop: 10 }}>
                                <Button
                                    title="Open"
                                    onPress={() => navigation.navigate('Deck', { deckId: item.id, title: item.title })}
                                    style={{ flex: 1, marginRight: 8 }}
                                />
                                <OutlineButton
                                    title="Details"
                                    onPress={() => navigation.navigate('Deck', { deckId: item.id, title: item.title })}
                                    style={{ flex: 1 }}
                                />
                            </View>
                        </Card>
                    );
                }}
                ListEmptyComponent={<Text style={{ textAlign:'center', color: bs.muted }}>No decks match your search.</Text>}
            />
        </View>
    );
}