// Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCd7mmW5FXBgARCMJ3b_yJKQbkRR8VXFi8",
  authDomain: "sppu-engineers-111.firebaseapp.com",
  databaseURL: "https://sppu-engineers-111-default-rtdb.firebaseio.com",
  projectId: "sppu-engineers-111",
  storageBucket: "sppu-engineers-111.firebasestorage.app",
  messagingSenderId: "622650122117",
  appId: "1:622650122117:web:0218bbf87b43cf1168aeec",
}

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js"

const app = initializeApp(firebaseConfig)
export const database = getDatabase(app)
