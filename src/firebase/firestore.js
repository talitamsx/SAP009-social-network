import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  updateDoc,
  arrayUnion,
  arrayRemove,
  doc,
  query,
  deleteDoc,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from './firebase';
// import { auth } from './auth';

const db = getFirestore(app);

export const database = async (name, email) => {
  try {
    const docRef = await addDoc(collection(db, 'users'), {
      name,
      email,
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const pegarPost = async (mostrarPost) => {
  const q = query(collection(db, 'posts'), orderBy('date', 'desc'));
  await onSnapshot(q, (querySnapshot) => {
    document.querySelector('.ultimos-posts').innerHTML = '';
    querySnapshot.forEach((post) => {
      // ... puxa todos os dados do objeto a seguir (no caso, post.data)
      mostrarPost({ ...post.data(), postId: post.id });
      console.log(post.id, ' => ', post.data());
    });
  });
};

export const fazerPost = async (titulo, autora, post, nivel) => {
  const auth = getAuth(app);
  try {
    const dataPost = Date.now();
    const dataAtualizada = new Date(dataPost);
    const dataPostagem = dataAtualizada.toLocaleDateString();
    const docRef = await addDoc(collection(db, 'posts'), {
      nome: auth.currentUser.displayName,
      id: auth.currentUser.uid,
      titulo,
      autora,
      nivel,
      post,
      date: dataPostagem,
      like: 0,
      likesUsuaria: [],
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const curtirPost = async (postId, userId) => updateDoc(doc(db, 'posts', postId), {
  likesUsuaria: arrayUnion(userId),
});

export const descurtirPost = async (postId, userId) => updateDoc(doc(db, 'posts', postId), {
  likesUsuaria: arrayRemove(userId),
});

export const excluirPost = async (postId) => deleteDoc(doc(db, 'posts', postId));

export const editarPost = async (postId, editarTexto) => updateDoc(doc(db, 'posts', postId), {
  post: editarTexto,
});
