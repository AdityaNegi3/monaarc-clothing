import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "MONAARC-demo.firebaseapp.com",
  projectId: "MONAARC-demo",
  storageBucket: "MONAARC-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;