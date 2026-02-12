# Testing the Boxing App

## 🚀 How to Run the App on Your Phone

### Prerequisites
1. **Install Expo Go app** on your phone:
   - iOS: Download from App Store
   - Android: Download from Google Play

2. **Install dependencies** (one-time setup):
```bash
cd mobile
npm install
```

### Run the App

```bash
cd mobile
npm start
```

This will show a QR code in your terminal.

**To test on your phone:**
1. Open the Expo Go app
2. Scan the QR code with your phone's camera (iOS) or the Expo Go app (Android)
3. The app will load on your device!

---

## 🧪 What to Test

### ✅ Login Screen (NEW!)
- Opens automatically (no auth yet)
- Beautiful dark theme UI
- Email + password input fields
- "Sign In" button with loading state
- "Forgot password?" link
- "Don't have an account? Sign Up" footer
- Social login placeholders (Apple, Google)
- Coach Mustafa branding at bottom

**Test Cases:**
1. Try signing in with empty fields (should show alert)
2. Try signing in with fake credentials (should show error)
3. Try signing in with real Supabase account (if you have one)
4. Check if password field hides characters
5. Check if "eye icon" toggles password visibility

### ✅ Signup Screen (NEW!)
- Tap "Sign Up" from login screen
- Full name, email, password, confirm password fields
- Form validation (all fields required)
- Password length check (min 6 characters)
- Password match validation
- "Create Account" button
- Terms of Service text
- "Already have an account? Sign In" footer

**Test Cases:**
1. Try signing up with empty fields (should show alert)
2. Try signing up with mismatched passwords (should show error)
3. Try signing up with short password (should show error)
4. Sign up with real email (should show success + email verification alert)

---

## 🎨 Design Quality Check

**Things to look for:**
- ✅ Smooth animations when typing
- ✅ Professional color scheme (red + gold on dark background)
- ✅ Clear, readable typography
- ✅ Proper spacing (not cramped, not too much whitespace)
- ✅ Touch targets are large enough (buttons easy to tap)
- ✅ Loading states when submitting forms
- ✅ Error messages are clear and helpful

---

## 🐛 What to Report

**If you find issues:**
1. Take a screenshot
2. Or record a screen recording (easier!)
3. Send in Telegram with description:
   - What you expected to happen
   - What actually happened
   - Steps to reproduce

**Example good bug report:**
> "When I tap the Sign In button with empty fields, nothing happens. Expected: Should show an error message."

**Example bad bug report:**
> "It's broken"

---

## 📱 Device Requirements

**Minimum:**
- iOS 13+ or Android 5.0+
- Stable internet connection (to connect to Supabase)

**Recommended:**
- iOS 15+ or Android 11+
- WiFi (for faster loading)

---

## 🔧 Troubleshooting

**App won't load?**
1. Make sure you're on the same WiFi network as your computer
2. Try closing and reopening Expo Go
3. Try running `npm start` again
4. Check if your firewall is blocking the connection

**App crashes immediately?**
1. Check if .env file exists in /mobile folder (it should!)
2. Check if Supabase credentials are correct
3. Send me the error message from the terminal

**Styling looks weird?**
1. Make sure you pulled the latest code from GitHub
2. Try clearing Expo cache: `npm start -- --clear`
3. Restart Expo Go app

---

## 📊 Performance Check

**Things to monitor:**
- App load time (should be under 3 seconds)
- Keyboard response time (should be instant)
- Button tap response (should feel immediate)
- Form submission time (depends on internet speed)

**If anything feels slow, tell me!**

---

## 🎯 Next Features to Test (Coming Soon)

- [ ] Home/Browse screen (course grid)
- [ ] Course detail screen
- [ ] Video player
- [ ] Progress tracking
- [ ] Rep tracker
- [ ] Heatmap/activity screen
- [ ] Profile/settings

---

**Ready to test? Run `npm start` in the `/mobile` folder and scan the QR code!** 📱🥊
