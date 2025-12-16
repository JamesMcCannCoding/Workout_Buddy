Workout Buddy App

Overview
Workout Buddy is a mobile application built using Expo and React Native designed to help users efficiently create, track, and manage their daily workout routines. It provides a clean, user-friendly interface for logging exercise sessions and tracking progress toward fitness goals.

Features
User Authentication: Secure Sign Up and Log In using username/email and password.

Routine Management: Easily create, view, and edit custom workout routines (e.g., "Chest Day," "Legs Day").

Intuitive Interface: A clean, blue-themed UI for a focused workout experience.

Cross-Platform Compatibility: Built with Expo for easy deployment to iOS and Android devices.

Techn Stack
Frontend: React Native (with Expo)

Language: TypeScript / JavaScript (TSX/JSX)

Styling: React Native StyleSheet

Navigation: Expo Router

State Management/Context: React Context API (for AuthContext)

Backend (External): Assumed to be a custom server (Node.js/Express, Python/Flask, etc.) running on http://10.0.2.2:3000.

Getting Started
Prerequisites
You will need the following installed on your development machine:

Node.js (v18+)

npm or yarn

Expo CLI (npm install -g expo-cli)

1. Installation
Clone the repository:

Bash

git clone [YOUR_REPO_URL]
cd Assignment2
Install dependencies:

Bash

npm install
# or
yarn install
2. Backend Setup (Crucial)
This application relies on a backend server to handle user authentication and workout data storage.

Start your backend server (using your preferred method, e.g., npm run start in the backend directory).

Verify API URL: Ensure the API_BASE_URL in your application matches your local network configuration.

In login.tsx, the current API base is set to:

TypeScript

const API_BASE_URL = "http://10.0.2.2:3000";
Note for iOS: If running on an iOS simulator, replace 10.0.2.2 with localhost or your machine's local IP address.

Note for Android (Physical Device): If running on a physical Android device, you must use your machine's actual local network IP address (e.g., http://192.168.1.XX:3000).

3. Running the App
Start the Expo development server:

Bash

npx expo start
Run on a device/simulator:

iOS Simulator: Press i in the terminal.

Android Emulator: Press a in the terminal.

Physical Device: Scan the QR code displayed in the terminal or browser with the Expo Go app.

🎨 Styling and Customization
The application uses a consistent blue theme defined by the primary color: #173ad3ff. This is used for button backgrounds, the header, and the splash screen for consistent branding.

Splash Screen Configuration
The splash screen is configured in app.json to show the app logo on the primary theme background color:

JSON

"splash": {
  "image": "./assets/images/logo.png",
  "backgroundColor": "#173ad3ff"
},
📂 Project Structure (Simplified)
Assignment2/
├── assets/                  # Fonts, images (logo.png, icon.png)
├── app/
│   ├── (tabs)/              # Main app pages requiring navigation (e.g., home)
│   ├── login.tsx            # Authentication screen
│   └── _layout.tsx          # Root layout and navigation
├── components/
│   ├── ThemedText.tsx       # Custom Text component for styling consistency
│   └── ui/                  # UI primitives
├── api/
│   └── authContext.tsx      # AuthProvider for managing user login state
├── app.json                 # Expo configuration
├── package.json
└── README.md