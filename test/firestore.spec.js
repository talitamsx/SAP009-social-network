import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';

import { getAuth } from 'firebase/auth';

import {
  database,
  fazerPost,
  excluirPost,
  curtirPost,
  descurtirPost,
  editarPost,
  pegarPost,
} from '../src/firebase/firestore';

jest.mock('firebase/firestore');
jest.mock('firebase/auth');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('database', () => {
  it('deve acessar os dados da usuária e guardar na coleção', async () => {
    addDoc.mockResolvedValueOnce();
    const mockCollection = 'collection';
    collection.mockReturnValueOnce(mockCollection);
    const nome = 'name';
    const eMail = 'email';
    const dadosUsuaria = {
      name: nome,
      email: eMail,
    };
    await database(nome, eMail);

    expect(addDoc).toHaveBeenCalledTimes(1);
    expect(addDoc).toHaveBeenCalledWith(mockCollection, dadosUsuaria);
    expect(collection).toHaveBeenCalledTimes(1);
    expect(collection).toHaveBeenCalledWith(undefined, 'users');
  });
});

describe('pegarPost', () => {
  it('deve acessar a publicação criada e retornar um array', async () => {
    const mockOrderBy = 'ordem';
    orderBy.mockReturnValueOnce(mockOrderBy);
    const mockQuery = 'query';
    query.mockReturnValueOnce(mockQuery);
    const mockCollection = 'collection';
    collection.mockReturnValueOnce(mockCollection);
    onSnapshot.mockResolvedValueOnce([
      {
        id: '1',
        data: () => ({ post: 'Post um' }),
      },
      {
        id: '2',
        data: () => ({ post: 'Post dois' }),
      },
    ]);
    const acessarPost = await pegarPost();
    expect(acessarPost).toEqual([
      { id: '1', post: 'Post um' },
      { id: '2', post: 'Post dois' },
    ]);
    expect(orderBy).toHaveBeenCalledTimes(1);
    expect(orderBy).toHaveBeenCalledWith('data');
    expect(collection).toHaveBeenCalledTimes(1);
    expect(collection).toHaveBeenCalledWith(undefined, 'posts');
    expect(query).toHaveBeenCalledTimes(1);
    expect(query).toHaveBeenCalledWith(mockCollection, mockOrderBy);
    expect(onSnapshot).toHaveBeenCalledTimes(1);
    expect(onSnapshot).toHaveBeenCalledWith(mockQuery);
  });
});

describe('fazerPost', () => {
  it('deve criar um post e guardar na coleção', async () => {
    addDoc.mockResolvedValueOnce();
    const mockCollection = 'collection';
    collection.mockReturnValueOnce(mockCollection);
    const mockAuth = {
      currentUser: {
        displayName: 'nomeTeste',
        uid: 'idteste',
      },
    };
    getAuth.mockReturnValueOnce(mockAuth);

    const tituloLivro = 'tituloTeste';
    const autoraLivro = 'autoraTeste';
    const nivelLeitura = 'nivelTeste';
    const postUsuaria = 'postTeste';
    const dataPostagem = new Date();
    const curtidas = 0;
    const curtidasUsuaria = [];
    const posts = {
      nome: mockAuth.currentUser.displayName,
      id: mockAuth.currentUser.uid,
      titulo: tituloLivro,
      autora: autoraLivro,
      nivel: nivelLeitura,
      post: postUsuaria,
      date: dataPostagem,
      like: curtidas,
      likesUsuaria: curtidasUsuaria,
    };
    // eslint-disable-next-line max-len
    await fazerPost(tituloLivro, autoraLivro, postUsuaria, nivelLeitura);

    expect(addDoc).toHaveBeenCalledTimes(1);
    expect(addDoc).toHaveBeenCalledWith(mockCollection, posts);
    expect(collection).toHaveBeenCalledTimes(1);
    expect(collection).toHaveBeenCalledWith(undefined, 'posts');
  });
});

describe('curtirPost', () => {
  it('deve ser uma função', () => {
    expect(typeof curtirPost).toBe('function');
  });

  it('deve acrescentar uma curtida a cada clique', async () => {
    updateDoc.mockResolvedValue();
    const mockDoc = 'doc';
    doc.mockReturnValueOnce(mockDoc);
    const mockUnion = 'union';
    arrayUnion.mockReturnValueOnce(mockUnion);

    const postId = 'post-id';
    const nomeUsuaria = 'nomeTeste';
    const postAtualizado = {
      likesUsuaria: mockUnion,
    };

    await curtirPost(postId, nomeUsuaria);
    expect(doc).toHaveBeenCalledTimes(1);
    expect(doc).toHaveBeenCalledWith(undefined, 'posts', postId);
    expect(updateDoc).toHaveBeenCalledTimes(1);
    expect(updateDoc).toHaveBeenCalledWith(mockDoc, postAtualizado);
    expect(arrayUnion).toHaveBeenCalledTimes(1);
    expect(arrayUnion).toHaveBeenCalledWith(nomeUsuaria);
  });
});

describe('descurtirPost', () => {
  it('deve descontar uma curtida a cada clique', async () => {
    updateDoc.mockResolvedValue();
    const mockDoc = 'doc';
    doc.mockReturnValueOnce(mockDoc);
    const mockUnion = 'union';
    arrayRemove.mockReturnValueOnce(mockUnion);
    const postId = 'post-id';
    const nomeUsuaria = 'nomeTeste';
    const postAtualizado = {
      likesUsuaria: mockUnion,
    };
    await descurtirPost(postId, nomeUsuaria);

    expect(doc).toHaveBeenCalledTimes(1);
    expect(doc).toHaveBeenCalledWith(undefined, 'posts', postId);
    expect(updateDoc).toHaveBeenCalledTimes(1);
    expect(updateDoc).toHaveBeenCalledWith(mockDoc, postAtualizado);
    expect(arrayRemove).toHaveBeenCalledTimes(1);
    expect(arrayRemove).toHaveBeenCalledWith(nomeUsuaria);
  });
});

describe('excluirPost', () => {
  it('deve excluir o post', async () => {
    const mockDoc = 'doc';
    doc.mockReturnValueOnce(mockDoc);
    deleteDoc.mockResolvedValueOnce();
    const postId = 'post-id';
    await excluirPost(postId);
    expect(doc).toHaveBeenCalledTimes(1);
    expect(doc).toHaveBeenCalledWith(undefined, 'posts', postId);
    expect(deleteDoc).toHaveBeenCalledTimes(1);
    expect(deleteDoc).toHaveBeenCalledWith(mockDoc);
  });
});

describe('editarPost', () => {
  it('deve editar e atualizar a publicação', async () => {
    updateDoc.mockResolvedValue();
    const mockDoc = 'doc';
    doc.mockReturnValueOnce(mockDoc);
    const postId = 'post-id';
    const editarTexto = 'texto-post';
    const atualizarPost = {
      post: editarTexto,
    };
    await editarPost(postId, editarTexto);
    expect(doc).toHaveBeenCalledTimes(1);
    expect(doc).toHaveBeenCalledWith(undefined, 'posts', postId);
    expect(updateDoc).toHaveBeenCalledTimes(1);
    expect(updateDoc).toHaveBeenCalledWith(mockDoc, atualizarPost);
  });
});
