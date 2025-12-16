# Workout Buddy - A fitness tracking application

> A mobile application to help you efficiently create, track, and manage your daily fitness routines.

---

## Overview

Workout Buddy is a mobile application built using **Expo and React Native** designed to help users efficiently create, track, and manage their daily workout routines. It provides a clean, user-friendly interface for logging exercise sessions and tracking progress toward fitness goals.

---

## Key Features

| Feature Category | Description |
| :--- | :--- |
| **Authentication** | Secure Sign Up and Log In using standard credentials. |
| **Routine Management** | Easily create, view, and edit custom workout routines (e.g., "Chest Day," "Legs Day"). |
| **Design** | A clean, blue-themed UI for a focused and consistent user experience. |
| **Compatibility** | Built with Expo for easy cross-platform deployment to both **iOS** and **Android**. |

---

## Technology Stack

* **Framework:** React Native (with Expo)
* **Language:** TypeScript / JavaScript
* **Navigation:** Expo Router
* **State:** React Context API (for `AuthContext`)
* **Styling:** React Native `StyleSheet`
* **Backend:** Custom server running locally utilising a MySQL Database.

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your development machine:

* Node.js (v18 or higher)
* npm or yarn
* [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)

### Installation & Dependencies

# Clone the repository
git clone [YOUR_REPO_URL]
cd Assignment2

# Install project dependencies
npm install
# or
yarn install


## This application requires a running backend server for authentication and data operations.

Start your backend server (e.g., in a separate terminal window).

Verify API URL: The application currently connects to: http://10.0.2.2:3000.

## For iOS Simulator, you should typically use localhost instead of 10.0.2.2.

For a Physical Android Device, you must replace 10.0.2.2 with your host machine's actual local network IP address (e.g., http://192.168.1.XX:3000).


## Running the App
Start the Expo development server:

npx expo start
Launch on your device:

Press i for iOS Simulator.

Press a for Android Emulator.

Scan the QR code with the Expo Go app for a physical device.
