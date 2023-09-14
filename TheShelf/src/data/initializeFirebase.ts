// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDaBBLpi5YELEMp51V3OwKih0G3Nz-AJUA',
  authDomain: 'woodall-theshelf.firebaseapp.com',
  projectId: 'woodall-theshelf',
  storageBucket: 'woodall-theshelf.appspot.com',
  messagingSenderId: '537587028553',
  appId: '1:537587028553:web:713017df6c63756dc3e598'
}

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig)