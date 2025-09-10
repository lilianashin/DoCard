**DoCard — Flashcards that actually get you learning**



DoCard is a React Native (Expo) app for creating decks, adding flashcards (text + images on both sides), and studying with a clean yes/no loop and results. It runs on Expo Go (iOS/Android) and \*\*web\*\*.



**Features (current MVP)**

\- Decks: create, list, search, delete

\- Cards: add, edit, delete

&nbsp; - Text front/back

&nbsp; - \*\*Images on both sides\*\* (web: upload, mobile: camera/gallery via `expo-image-picker`)

\- Study Mode:

&nbsp; - Flip card, mark \*\*Yes/No\*\*

&nbsp; - Progress bar

&nbsp; - \*\*Review incorrect only\*\* (planned)

\- Persistence: \*\*AsyncStorage\*\* (offline)

\- Polished UI: modern spacing, colors, progress bars



Assessment mapping (Keuzedelen)



\*\*Verdieping Frontend\*\*

\- React component architecture + routing

\- State management (Context + Reducer) 

\- CRUD UI (decks/cards) 

\- Search/filter 

\- Styling \& UX polish  (MVP-level, consistent)

\- Tests (basic unit test included)

\- Documentation  (this README, structure, how to run)



\*\*Mobile Applications\*\*

\- Mobile framework (React Native / Expo) 

\- Navigation on mobile 

\- Device APIs (camera/gallery)  

&nbsp; - Implemented; works on web; iOS permission/config can be finicky in Expo Go

\- Local storage 

\- Runs on real device via Expo Go 



\## Tech Stack

\- React Native (Expo)

\- React Navigation

\- AsyncStorage

\- Expo Image Picker (`expo-image-picker`)

\- RN Web (for browser demo)

\- Jest + @testing-library/react-native (basic tests)



