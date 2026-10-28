import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getDatabase, ref, set, onValue, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";
import { firebaseConfig, ROOM_ID } from "./config.js";

export async function connect(onChange) {
  if (Object.values(firebaseConfig).some(v => !v || v.includes('INSERISCI_'))) {
    throw new Error('Configura prima il file config.js con i dati Firebase.');
  }
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  await signInAnonymously(auth);
  const db = getDatabase(app);
  const stateRef = ref(db, 'rooms/' + ROOM_ID + '/state');
  const stop = onValue(stateRef, snapshot => onChange(snapshot.val() || {unlocked:false}), err => onChange(null, err));
  return {
    unlock: () => set(stateRef, {unlocked:true, changedAt:serverTimestamp()}),
    reset: () => set(stateRef, {unlocked:false, changedAt:serverTimestamp()}),
    stop
  };
}
