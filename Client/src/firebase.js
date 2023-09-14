import { initializeApp } from 'firebase/app';
import {
    getAuth
  } from 'firebase/auth';
  
const firebaseConfig = {
    apiKey: "AIzaSyBAdksjnqnFItdQ_dP2WveDFU_egC4NT8g",
    authDomain: "get-party-2023.firebaseapp.com",

};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);


