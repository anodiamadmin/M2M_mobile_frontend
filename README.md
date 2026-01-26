# M2M_mobile_frontend
Frontend for micro2move iOS app built with **React Native + Expo**.

# Developers' Guide

1. Install Node.js v24.12.0 (LTS) (or its latest predecessor with LTS).

2. Run:
```bash
node -v
npm -v
```
# If error

Run (for **windows** user):
```bash
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```
Then:
```bash
node -v
npm -v
```

3. Run:
```bash
npm install
```

4. Run:
```bash
npm run web
```

# Happy Coding!

# To connect to backend:

5. Put your device's IPv4 address like this http://your-IP:8000 in `EXPO_PUBLIC_API_URL` of **.env**

# Alternative way:

5. Run:
```bash
npx ngrok http 8000 
```
to start ngrok secure tunnel for connecting to backend

6. Copy the link "https://your-instance-id.ngrok-free.app" you get to see in the ngrok terminal.

7. Paste the "https://your-instance-id.ngrok-free.app" in `EXPO_PUBLIC_API_URL` of **.env**

# You are ready to connect!