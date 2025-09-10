import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import DeckScreen from '../screens/DeckScreen';
import StudyScreen from '../screens/StudyScreen';
import ResultsScreen from '../screens/ResultsScreen';
import EditCardScreen from '../screens/EditCardScreen';

const Stack = createStackNavigator();

export default function RootNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerTitleAlign: 'center' }}>
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'My Flashcards' }} />
                <Stack.Screen name="Deck" component={DeckScreen} options={{ title: 'Deck' }} />
                <Stack.Screen name="Study" component={StudyScreen} options={{ title: 'Study' }} />
                <Stack.Screen name="Results" component={ResultsScreen} options={{ title: 'Results' }} />
                <Stack.Screen name="EditCard" component={EditCardScreen} options={{ title: 'Edit Card' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
