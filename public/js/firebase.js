import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'
import { firebaseConfig } from './firebase-config.js'

// Inicializar la app y la base de datos Firestore
export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export default app