// Configuración de Firebase (Sustituye con tus credenciales)
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROJECT.firebaseapp.com",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_PROJECT.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;
let userData = { money: 0, rank: "Novato", branch: "Ninguna", garage: [] };

// Iniciar sesión anónima automática
auth.signInAnonymously().catch(console.error);

auth.onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        document.getElementById('user-name').innerText = `ID: ${user.uid.slice(0,5)}`;
        loadUserData();
    }
});

function loadUserData() {
    db.collection("users").doc(currentUser.uid).onSnapshot(doc => {
        if (doc.exists) {
            userData = doc.data();
            document.getElementById('user-money').innerText = userData.money || 0;
            document.getElementById('user-rank').innerText = userData.rank || "Novato";
            document.getElementById('active-branch').innerText = userData.branch || "Ninguna";
            renderGarage();
        } else {
            const initialData = { money: 5000, rank: "Novato", branch: "Ninguna", garage: [] };
            db.collection("users").doc(currentUser.uid).set(initialData);
        }
    });
}
