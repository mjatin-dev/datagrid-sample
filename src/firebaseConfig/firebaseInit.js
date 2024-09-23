import firebase from "firebase/compat/app";
import "firebase/compat/messaging";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCvz-TUVm2q9H5hIX_8QK_lrE2OUNtIqU",
  authDomain: "compliancesutra.firebaseapp.com",
  projectId: "compliancesutra",
  storageBucket: "compliancesutra.appspot.com",
  messagingSenderId: "788555626683",
  appId: "1:788555626683:web:64478df8c18130ee34919e",
  measurementId: "G-NSCC4CGY9S",
};
firebase.initializeApp(firebaseConfig);
let messaging;
try {
  messaging = firebase.messaging();
} catch (error) {
  // toast.error(error.message);
}
const publicKey =
  "BHVaPuj-IaSwu3cMZR2YjI1lKmlK6JcVgGQIBrhNLf_mbCLYjXAk9Ce7u4MF8ydnt0rTc8I29u_dekyccE-YOcQ";

export const getToken = async () => {
  let currentToken = "";
  try {
    if (messaging) {
      currentToken = await messaging.getToken({ vapidKey: publicKey });
    }
  } catch (error) {
    console.log("An error occurred while retrieving token.", error);
  }
  return currentToken;
};

// export const onMessageListener = () =>
//   new Promise((resolve, reject) => {
//     try {
//       messaging.onMessage((payload) => {
//         console.log("df", payload, resolve);
//         resolve(payload);
//       });
//     } catch (error) {
//       reject(error);
//     }
//   });
