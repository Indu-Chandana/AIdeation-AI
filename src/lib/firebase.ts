// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "aideation-indu.firebaseapp.com",
    projectId: "aideation-indu",
    storageBucket: "aideation-indu.appspot.com",
    messagingSenderId: "167467017102",
    appId: "1:167467017102:web:e89c11ea1451185389fadf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)

export async function uploadFileToFirebase(image_url: string, name: string) {
    try {
        const response = await fetch(image_url)
        console.log('image url firebase ::', response)

        const buffer = await response.arrayBuffer() // not a base64-encoded image. An ArrayBuffer is a JavaScript object used to represent a generic, fixed-length binary data buffer.
        console.log('buffer ::', buffer)

        const file_name = name.replace(" ", "") + Date.now + '.jpeg'

        const storageRef = ref(storage, file_name)
        await uploadBytes(storageRef, buffer, {
            contentType: 'image/jpeg'
        })

        const firebase_url = await getDownloadURL(storageRef)
        return firebase_url
    } catch (error) {
        console.error('catch err ::', error)
    }
}