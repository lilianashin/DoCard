import React from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import { DecksProvider } from './src/state/DecksContext';

export default function App() {
    return (
        <DecksProvider>
            <RootNavigator />
        </DecksProvider>
    );
}
