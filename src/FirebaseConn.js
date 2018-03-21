// TODO: Configuração da Conexão no Firebase
import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyDCeZXOstevOyETceu-Bb3sMqXTI7efOXg",
  authDomain: "devsapp-f9edf.firebaseapp.com",
  databaseURL: "https://devsapp-f9edf.firebaseio.com",
  projectId: "devsapp-f9edf",
  storageBucket: "",
  messagingSenderId: "148055324587"
};
firebase.initializeApp(config);

export default firebase;