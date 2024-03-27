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

        // ArrayBuffer {
        //     [Uint8Contents]: <89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 01 00 00 00 01 00 08 02 00 00 00 d3 10 3f 31 00 00 00 6c 65 58 49 66 4d 4d 00 2a 00 00 00 08 00 02 92 7c 00 02 00 00 00 2d 00 00 00 26 92 86 00 02 00 00 00 18 00 00 00 54 00 00 00 00 4f 70 65 6e 41 49 2d 2d 72 65 71 5f 33 32 66 32 39 34 37 34 66 ... 197013 more bytes>,
        //     byteLength: 197113
        //   }

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