# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

Key Types:

Beat: Individual step with active state and optional volume
Track: Instrument with pattern data organized by bars
Section: Song sections with color coding
Composition: Complete composition with all metadata
DrumSound: Sound library definitions
PlaybackState/Position: For controlling playback

Helper Functions:

createEmptyBeat() - Make blank beats
createEmptyBars() - Generate empty bar arrays
createTrack() - Create new track with empty pattern
createSection() - Create new section marker
createComposition() - Initialize new composition
validateComposition() - Check data integrity

  
