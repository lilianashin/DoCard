import React, { useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, Image, Platform } from 'react-native';
import { useDecks } from '../state/DecksContext';
import * as ImagePicker from 'expo-image-picker';

export default function EditCardScreen({ route, navigation }) {
    const { deckId, cardId, title } = route.params || {};
    const { decks, updateCard, removeCard } = useDecks();

    const deck = useMemo(() => decks.find(d => d.id === deckId), [decks, deckId]);
    const card = useMemo(() => deck?.cards?.find(c => c.id === cardId), [deck, cardId]);

    const [front, setFront] = useState(card?.front || '');
    const [back, setBack] = useState(card?.back || '');
    const [imageFrontUri, setImageFrontUri] = useState(card?.imageFrontUri || null);
    const [imageBackUri, setImageBackUri] = useState(card?.imageBackUri || null);

    const frontInputRef = useRef(null);
    const backInputRef  = useRef(null);

    if (!deck || !card) {
        return (
            <View style={{ flex:1, justifyContent:'center', alignItems:'center', padding:16 }}>
                <Text>Card not found.</Text>
            </View>
        );
    }

    const pickFromLibrary = async (side) => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') { alert('Permission required.'); return; }
            const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.6 });
            if (!result.canceled && result.assets?.[0]?.uri) {
                side === 'front' ? setImageFrontUri(result.assets[0].uri) : setImageBackUri(result.assets[0].uri);
            }
        }
    };
    const takePhoto = async (side) => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') { alert('Camera permission required.'); return; }
        const result = await ImagePicker.launchCameraAsync({ quality: 0.6 });
        if (!result.canceled && result.assets?.[0]?.uri) {
            side === 'front' ? setImageFrontUri(result.assets[0].uri) : setImageBackUri(result.assets[0].uri);
        }
    };

    const save = () => {
        updateCard(deckId, cardId, {
            front: front.trim(),
            back: back.trim(),
            imageFrontUri,
            imageBackUri
        });
        navigation.goBack();
    };
    const deleteCard = () => {
        removeCard(deckId, cardId);
        navigation.goBack();
    };

    return (
        <View style={{ flex:1, padding:16, backgroundColor:'#fff', gap:12 }}>
            <Text style={{ fontSize:20, fontWeight:'700', textAlign:'center' }}>Edit Card — {title}</Text>

            <TextInput
                placeholder="Question / Front"
                value={front}
                onChangeText={setFront}
                style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10 }}
            />
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
                        <Pressable onPress={() => frontInputRef.current?.click()} style={{ backgroundColor:'#6c5ce7', paddingHorizontal:12, paddingVertical:8, borderRadius:6 }}>
                            <Text style={{ color:'#fff' }}>Upload (Front)</Text>
                        </Pressable>
                        <input
                            ref={frontInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display:'none' }}
                            onChange={e => {
                                const file = e.target.files?.[0]; if (!file) return;
                                const reader = new FileReader();
                                reader.onload = () => setImageFrontUri(reader.result);
                                reader.readAsDataURL(file);
                            }}
                        />
                    </>
                ) : (
                    <>
                        <Pressable onPress={() => pickFromLibrary('front')} style={{ backgroundColor:'#6c5ce7', paddingHorizontal:12, paddingVertical:8, borderRadius:6 }}>
                            <Text style={{ color:'#fff' }}>Gallery (Front)</Text>
                        </Pressable>
                        <Pressable onPress={() => takePhoto('front')} style={{ backgroundColor:'#ff9800', paddingHorizontal:12, paddingVertical:8, borderRadius:6 }}>
                            <Text style={{ color:'#fff' }}>Camera (Front)</Text>
                        </Pressable>
                    </>
                )}
            </View>

            <TextInput
                placeholder="Answer / Back"
                value={back}
                onChangeText={setBack}
                style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10 }}
            />
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
                        <Pressable onPress={() => backInputRef.current?.click()} style={{ backgroundColor:'#6c5ce7', paddingHorizontal:12, paddingVertical:8, borderRadius:6 }}>
                            <Text style={{ color:'#fff' }}>Upload (Back)</Text>
                        </Pressable>
                        <input
                            ref={backInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display:'none' }}
                            onChange={e => {
                                const file = e.target.files?.[0]; if (!file) return;
                                const reader = new FileReader();
                                reader.onload = () => setImageBackUri(reader.result);
                                reader.readAsDataURL(file);
                            }}
                        />
                    </>
                ) : (
                    <>
                        <Pressable onPress={() => pickFromLibrary('back')} style={{ backgroundColor:'#6c5ce7', paddingHorizontal:12, paddingVertical:8, borderRadius:6 }}>
                            <Text style={{ color:'#fff' }}>Gallery (Back)</Text>
                        </Pressable>
                        <Pressable onPress={() => takePhoto('back')} style={{ backgroundColor:'#ff9800', paddingHorizontal:12, paddingVertical:8, borderRadius:6 }}>
                            <Text style={{ color:'#fff' }}>Camera (Back)</Text>
                        </Pressable>
                    </>
                )}
            </View>

            <View style={{ flexDirection:'row', gap:10, marginTop:12 }}>
                <Pressable onPress={() => navigation.goBack()} style={{ flex:1, backgroundColor:'#9e9e9e', padding:12, borderRadius:8, alignItems:'center' }}>
                    <Text style={{ color:'#fff', fontWeight:'700' }}>Cancel</Text>
                </Pressable>
                <Pressable onPress={save} style={{ flex:1, backgroundColor:'#007bff', padding:12, borderRadius:8, alignItems:'center' }}>
                    <Text style={{ color:'#fff', fontWeight:'700' }}>Save</Text>
                </Pressable>
            </View>

            <Pressable onPress={deleteCard} style={{ marginTop:10, alignSelf:'center' }}>
                <Text style={{ color:'#e53935', fontWeight:'700' }}>Delete card</Text>
            </Pressable>
        </View>
    );
}
