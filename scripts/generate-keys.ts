const { initializeApp } = require("firebase/app")
const { getFirestore, collection, addDoc } = require("firebase/firestore")

// Your Firebase configuration
const firebaseConfig = {
  
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const generateRandomKey = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  const randomPart = () =>
    Array.from({ length: 4 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("")
  return `SELKA-${randomPart()}-${randomPart()}-${randomPart()}`
}

const addKeysToFirestore = async (numKeys: number) => {
  const keysCollection = collection(db, "access-keys") // Collection Name

  for (let i = 0; i < numKeys; i++) {
    const keyData = {
      key: generateRandomKey(),
      hwid: "", // Empty string instead of null for consistency
      isActive: true, // Set to true so they can be used for signup
      workoutData: null // Initialize with null
    }

    try {
      await addDoc(keysCollection, keyData)
      console.log(`Key ${keyData.key} added successfully`)
    } catch (error) {
      console.error("Error adding document: ", error)
    }
  }
}

// Add 50 keys
addKeysToFirestore(50) 
