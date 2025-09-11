import React, { useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, Image, Platform, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useDecks } from '../state/DecksContext';
import * as ImagePicker from 'expo-image-picker';

export default function DeckScreen({ route, navigation }) {
    const { deckId, title } = route.params || {};
    const { decks, addCard, removeCard, removeDeck } = useDecks();

    useFocusEffect(React.useCallback(() => {
        if (Platform.OS === 'web') document.title = `DoCard – ${title || 'Deck'}`;
    }, [title]));

    const deck = useMemo(() => decks.find(d => d.id === deckId), [decks, deckId]);

    const [front, setFront] = useState('');
    const [back, setBack] = useState('');
    const [imageFrontUri, setImageFrontUri] = useState(null);
    const [imageBackUri, setImageBackUri] = useState(null);

    const [cardQuery, setCardQuery] = useState('');
    const filteredCards = useMemo(() => {
        const q = cardQuery.trim().toLowerCase();
        const base = deck?.cards || [];
        if (!q) return base;
        return base.filter(c => c.front.toLowerCase().includes(q) || c.back.toLowerCase().includes(q));
    }, [deck?.cards, cardQuery]);

    const frontInputRef = useRef(null);
    const backInputRef = useRef(null);

    if (!deck) {
        return <View style={{ flex:1, justifyContent:'center', alignItems:'center', padding:16 }}><Text>Deck not found.</Text></View>;
    }

    const pickFromLibrary = async side => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') { alert('Permission required to access photos.'); return; }
            const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing:false, quality:0.6 });
            if (!result.canceled && result.assets?.[0]?.uri) {
                side === 'front' ? setImageFrontUri(result.assets[0].uri) : setImageBackUri(result.assets[0].uri);
            }
        }
    };
    const takePhoto = async side => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') { alert('Camera permission required.'); return; }
        const result = await ImagePicker.launchCameraAsync({ allowsEditing:false, quality:0.6 });
        if (!result.canceled && result.assets?.[0]?.uri) {
            side === 'front' ? setImageFrontUri(result.assets[0].uri) : setImageBackUri(result.assets[0].uri);
        }
    };

    const onAddCard = () => {
        const f = front.trim(), b = back.trim();
        if (!f || !b) return;
        addCard(deckId, { front: f, back: b, imageFrontUri, imageBackUri });
        setFront(''); setBack(''); setImageFrontUri(null); setImageBackUri(null);
    };

    const handleDelete = () => {
        if (Platform.OS === 'web') {
            const ok = window.confirm(`Delete "${title}" and all its cards?`);
            if (!ok) return;
            removeDeck(deckId);
            navigation.navigate('Home');
            return;
        }
        Alert.alert('Delete deck?', `This will delete "${title}" and all its cards.`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => { removeDeck(deckId); navigation.navigate('Home'); } }
        ]);
    };

    return (
        <View style={{ flex:1, padding:16, backgroundColor:'#fff' }}>
            <Text style={{ fontSize:20, fontWeight:'700', textAlign:'center' }}>{title}</Text>
            <Text style={{ textAlign:'center', color:'#666' }}>{deck.cards?.length || 0} cards</Text>

            <Pressable onPress={() => navigation.navigate('Study', { deckId, title, mode:'all' })}
                       style={{ alignSelf:'center', backgroundColor:'#6366f1', paddingHorizontal:16, paddingVertical:10, borderRadius:8, marginTop:8 }}>
                <Text style={{ color:'#fff', fontWeight:'700' }}>Start Study</Text>
            </Pressable>

            {/* Add Card */}
            <View style={{ gap:8, marginTop:12 }}>
                <TextInput placeholder="Question / Front" value={front} onChangeText={setFront}
                           style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10 }} />

                <View style={{ flexDirection:'row', gap:8, alignItems:'center' }}>
                    {imageFrontUri ? (
                        <Image source={{ uri: imageFrontUri }} style={{ width:70, height:50, borderRadius:6, borderWidth:1, borderColor:'#ddd' }} />
                    ) : (
                        <View style={{ width:70, height:50, borderRadius:6, borderWidth:1, borderColor:'#eee', backgroundColor:'#fafafa', alignItems:'center', justifyContent:'center' }}>
                            <Text style={{ color:'#aaa', fontSize:12 }}>No img</Text>
                        </View>
                    )}
                    {Platform.OS === 'web' ? (
                        <>
                            <Pressable onPress={() => frontInputRef.current?.click()}
                                       style={{ backgroundColor:'#6366f1', paddingHorizontal:12, paddingVertical:8, borderRadius:6 }}>
                                <Text style={{ color:'#fff' }}>Upload (Front)</Text>
                            </Pressable>
                            <input ref={frontInputRef} type="file" accept="image/*" style={{ display:'none' }}
                                   onChange={e => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => setImageFrontUri(r.result); r.readAsDataURL(f); }} />
                        </>
                    ) : (
                        <>
                            <Pressable onPress={() => pickFromLibrary('front')} style={{ backgroundColor:'#6366f1', paddingHorizontal:12, paddingVertical:8, borderRadius:6 }}>
                                <Text style={{ color:'#fff' }}>Gallery (Front)</Text>
                            </Pressable>
                            <Pressable onPress={() => takePhoto('front')} style={{ backgroundColor:'#ff9800', paddingHorizontal:12, paddingVertical:8, borderRadius:6 }}>
                                <Text style={{ color:'#fff' }}>Camera (Front)</Text>
                            </Pressable>
                        </>
                    )}
                </View>

                <TextInput placeholder="Answer / Back" value={back} onChangeText={setBack}
                           style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10 }} />

                <View style={{ flexDirection:'row', gap:8, alignItems:'center' }}>
                    {imageBackUri ? (
                        <Image source={{ uri: imageBackUri }} style={{ width:70, height:50, borderRadius:6, borderWidth:1, borderColor:'#ddd' }} />
                    ) : (
                        <View style={{ width:70, height:50, borderRadius:6, borderWidth:1, borderColor:'#eee', backgroundColor:'#fafafa', alignItems:'center', justifyContent:'center' }}>
                            <Text style={{ color:'#aaa', fontSize:12 }}>No img</Text>
                        </View>
                    )}
                    {Platform.OS === 'web' ? (
                        <>
                            <Pressable onPress={() => backInputRef.current?.click()}
                                       style={{ backgroundColor:'#6366f1', paddingHorizontal:12, paddingVertical:8, borderRadius:6 }}>
                                <Text style={{ color:'#fff' }}>Upload (Back)</Text>
                            </Pressable>
                            <input ref={backInputRef} type="file" accept="image/*" style={{ display:'none' }}
                                   onChange={e => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => setImageBackUri(r.result); r.readAsDataURL(f); }} />
                        </>
                    ) : (
                        <>
                            <Pressable onPress={() => pickFromLibrary('back')} style={{ backgroundColor:'#6366f1', paddingHorizontal:12, paddingVertical:8, borderRadius:6 }}>
                                <Text style={{ color:'#fff' }}>Gallery (Back)</Text>
                            </Pressable>
                            <Pressable onPress={() => takePhoto('back')} style={{ backgroundColor:'#ff9800', paddingHorizontal:12, paddingVertical:8, borderRadius:6 }}>
                                <Text style={{ color:'#fff' }}>Camera (Back)</Text>
                            </Pressable>
                        </>
                    )}
                </View>

                <Pressable onPress={onAddCard}
                           style={{ alignSelf:'flex-start', backgroundColor:'#22c55e', paddingHorizontal:14, paddingVertical:10, borderRadius:8 }}>
                    <Text style={{ color:'#fff', fontWeight:'700' }}>Add Card</Text>
                </Pressable>
            </View>

            <TextInput placeholder="Search cards…" value={cardQuery} onChangeText={setCardQuery}
                       style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginTop:6 }} />

            <FlatList
                data={filteredCards}
                keyExtractor={c => c.id}
                contentContainerStyle={{ gap:8, paddingVertical:8 }}
                renderItem={({ item }) => (
                    <View style={{ borderWidth:1, borderColor:'#ddd', borderRadius:10, padding:12, backgroundColor:'#fafafa' }}>
                        <Text style={{ fontWeight:'700' }}>Q: {item.front}</Text>
                        {item.imageFrontUri ? <Image source={{ uri: item.imageFrontUri }} style={{ width:120, height:90, marginTop:6, borderRadius:6 }} /> : null}
                        <Text style={{ marginTop:6, color:'#333' }}>A: {item.back}</Text>
                        {item.imageBackUri ? <Image source={{ uri: item.imageBackUri }} style={{ width:120, height:90, marginTop:6, borderRadius:6 }} /> : null}

                        <View style={{ flexDirection:'row', gap:12, marginTop:10 }}>
                            <Pressable onPress={() => removeCard(deckId, item.id)} style={{ paddingVertical:6, paddingHorizontal:10, borderRadius:6, backgroundColor:'#ef4444' }}>
                                <Text style={{ color:'#fff' }}>Delete</Text>
                            </Pressable>
                            <Pressable onPress={() => navigation.navigate('EditCard', { deckId, cardId: item.id, title })}
                                       style={{ paddingVertical:6, paddingHorizontal:10, borderRadius:6, backgroundColor:'#6366f1' }}>
                                <Text style={{ color:'#fff' }}>Edit</Text>
                            </Pressable>
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text style={{ textAlign:'center', color:'#888' }}>No cards yet. Add one ↑</Text>}
            />

            <Pressable onPress={handleDelete} style={{ marginTop:12, padding:12, borderRadius:8, backgroundColor:'#ef4444', alignItems:'center' }}>
                <Text style={{ color:'#fff', fontWeight:'700' }}>Delete Deck</Text>
            </Pressable>
        </View>
    );
}