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

1. Download the application file from Github, extract it and save it somewhere.
2. Open command terminal and navigate to the root folder of the project.
3. Once there you will need to install Node package manager. Enter this command:
     npm install
4. Once Node is installed you will need to locally host the MySQL Database. This can be done through XAMPP, you will need to run both the Apache and MySQL services. Navigate to the PHP/Myadmin page.
5. Once inside your PHP MyAdmin you will need to create a new database called "workoutdb". This is where you will import your workout.sql file that comes with this app. It can be found in the root directory of the app.
6. Once the database is running, you will need to open another terminal and again navigate to the root directory of this app. Once there run the following command:
     node server.js
7. Keep this window open and running and do not close. Back over in the first terminal you will need to start your expo client to run the app. This can be done by running this command:
     npx expo start
8. In this terminal, press 'a' to launch the Android emulator.
9. Open your Android emulator or IOS device now. Keep tyring to launch the 

