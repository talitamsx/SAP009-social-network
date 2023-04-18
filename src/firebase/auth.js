import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  // updateCurrentUser,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,

} from 'firebase/auth';

import { app } from './firebase.js';

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const fazerLogin = (email, password) => signInWithEmailAndPassword(auth, email, password);
const loginGoogle = () => signInWithPopup(auth, provider);

const fazerLogout = () => signOut(auth, provider);
const fazerCadastro = async (name, email, password) => {
  console.log(name, email, password);
  const autenticarCadastro = getAuth(app);
  await createUserWithEmailAndPassword(autenticarCadastro, email, password);

  return updateProfile(autenticarCadastro.currentUser, {
    displayName: name,
  });
};

const usuariaLogada = (verificacao) => {
  onAuthStateChanged(auth, verificacao);
};

export {
  auth,
  fazerLogin,
  loginGoogle,
  fazerLogout,
  fazerCadastro,
  updateProfile,
  usuariaLogada,
};
