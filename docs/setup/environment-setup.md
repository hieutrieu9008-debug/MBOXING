# Development Environment Setup Guide

> **Goal**: Get React Native + Expo + Supabase working on your machine with a "Hello World" app.

---

## Prerequisites Check

Before we start, verify you have these installed:

### 1. Node.js (JavaScript runtime)

**Check if installed:**
```bash
node --version
```

**Expected output**: `v18.x` or higher

**If not installed:**
- Download from: https://nodejs.org/en/download/
- Choose "LTS" version (Long Term Support)
- Run the installer, accept defaults

---

### 2. Git (Already done ✅)

You already have this since we pushed to GitHub.

---

### 3. Code Editor

**Recommended**: VS Code (https://code.visualstudio.com/)

**Extensions to install** (optional but helpful):
- ES7+ React/Redux/React-Native snippets
- Prettier (code formatter)
- GitLens (Git history)

---

## Step 1: Install Expo CLI

**What is Expo?**  
Expo is a framework that makes React Native development easier. It handles builds, testing, and deployment without needing Xcode (iOS) or Android Studio.

**Install command:**
```bash
npm install -g expo-cli
```

**Verify installation:**
```bash
expo --version
```

**Expected**: `~6.x` or higher

---

## Step 2: Install EAS CLI (Expo Application Services)

**What is EAS?**  
EAS handles building and submitting your app to App Store / Google Play.

**Install command:**
```bash
npm install -g eas-cli
```

**Verify:**
```bash
eas --version
```

---

## Step 3: Create Expo Account

**Why?**  
You need an Expo account to build and test apps on physical devices.

**Steps:**
1. Go to: https://expo.dev/signup
2. Create a free account
3. Remember your credentials

**Login from terminal:**
```bash
expo login
```

Enter your email and password when prompted.

---

## Step 4: Create "Hello World" App

**Navigate to your project directory:**
```bash
cd "c:/Users/hieut/OneDrive/Mustafas Boxing"
```

**Create a new Expo app:**
```bash
npx create-expo-app@latest mobile --template blank-typescript
```

**What this does:**
- Creates a folder called `mobile/`
- Sets up React Native with TypeScript
- Uses the "blank" template (minimal starting point)

**Enter the directory:**
```bash
cd mobile
```

---

## Step 5: Test the App (Local Development)

**Start the development server:**
```bash
npm start
```

**What happens:**
- A QR code appears in your terminal
- A browser window opens (Expo Dev Tools)

### Option A: Test on Phone (Recommended)

1. **Install Expo Go app** on your phone:
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. **Scan the QR code** with your phone camera (iOS) or Expo Go app (Android)

3. **App loads on your phone** (takes ~30 seconds first time)

### Option B: Test on Emulator (Advanced)

**Requires:**
- iOS: Xcode (Mac only)
- Android: Android Studio

**Not recommended for beginners** - use Option A (phone) instead.

---

## Step 6: Set Up Supabase

**What is Supabase?**  
Your backend database + authentication. Think of it as "Firebase, but with a real SQL database."

### Create Supabase Account

1. Go to: https://supabase.com/dashboard
2. Sign up (use GitHub login for convenience)
3. Click **"New Project"**

### Project Settings

- **Name**: `mustafas-boxing`
- **Database Password**: Create a strong password (save this!)
- **Region**: Choose closest to you (e.g., `us-east-1`)
- **Pricing**: Free tier is fine for now

**Wait ~2 minutes** for the project to provision.

### Get Your API Keys

1. In Supabase dashboard, click your project
2. Go to **Settings** → **API**
3. Copy these values:
   - `Project URL` (e.g., `https://abc123.supabase.co`)
   - `anon/public key` (long string starting with `eyJ...`)

**Save these** - we'll use them in the next step.

---

## Step 7: Connect Supabase to Your App

**Install Supabase client library:**
```bash
cd mobile
npm install @supabase/supabase-js
```

**Create environment file:**

Create a new file: `mobile/.env`

**Contents:**
```
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_URL.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

**Replace** `YOUR_PROJECT_URL` and `YOUR_ANON_KEY_HERE` with the values you copied.

**⚠️ Important**: This file is already in `.gitignore`, so your secrets won't be committed to GitHub.

---

## Step 8: Test Supabase Connection

**Create a test file:**

Create `mobile/lib/supabase.ts`:

```typescript
import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Install required polyfill:**
```bash
npm install react-native-url-polyfill
```

**Update `App.tsx`** to test the connection:

```typescript
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export default function App() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Test Supabase connection
    supabase.from('_test').select('*').then(() => {
      setConnected(true);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mustafa's Boxing</Text>
      <Text>React Native + Expo: ✅</Text>
      <Text>Supabase: {connected ? '✅ Connected' : '⏳ Connecting...'}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 20,
  },
});
```

**Restart the app:**
```bash
npm start
```

**Expected result:**
- Black screen
- Gold "Mustafa's Boxing" title
- "React Native + Expo: ✅"
- "Supabase: ✅ Connected"

---

## Step 9: Commit Your Setup

**Add the new files to Git:**
```bash
cd ..  # Go back to project root
git add .
git commit -m "feat: initialize React Native + Expo environment

- Created mobile/ directory with Expo TypeScript template
- Installed Supabase client
- Environment setup complete
- Hello World app tested and working"
git push
```

---

## 🎉 Success Criteria

You're ready to proceed if:
- ✅ `expo --version` works
- ✅ App runs on your phone via Expo Go
- ✅ Supabase shows "✅ Connected"
- ✅ Changes pushed to GitHub

---

## Troubleshooting

### "Command not found: expo"
- **Fix**: Restart your terminal after installing
- **Or**: Use `npx expo` instead of `expo`

### "Network error" when connecting to Supabase
- **Check**: `.env` file has correct URL and key
- **Check**: No extra spaces in the values
- **Check**: Supabase project is "Active" (not paused)

### App won't load on phone
- **Check**: Phone and computer on same WiFi
- **Check**: Firewall isn't blocking Expo
- **Try**: `npm start --tunnel` (slower but bypasses network issues)

---

## Next Steps

Once your environment is working:
1. Explore the Supabase dashboard (create a test table)
2. Read the Expo docs: https://docs.expo.dev/
3. Tell me "environment ready" and we'll either:
   - Start Phase 2 (Design)
   - Or pick a slice to spec out and build

---

**Current Status**: Environment setup in progress
