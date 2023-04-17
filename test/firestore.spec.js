import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

import {
  database,
  fazerPost,
  excluirPost,
  curtirPost,
  descurtirPost,
} from '../src/firebase/firestore';

jest.mock('firebase/firestore');

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

describe('fazerPost', () => {
  it('deve criar um post e guardar na coleção', async () => {
    addDoc.mockResolvedValueOnce();
    const mockCollection = 'collection';
    collection.mockReturnValueOnce(mockCollection);

    const nomeUsuaria = 'nomeTeste';
    const idUsuaria = 'idteste';
    const tituloLivro = 'tituloTeste';
    const autoraLivro = 'autoraTeste';
    const nivelLeitura = 'nivelTeste';
    const postUsuaria = 'postTeste';
    const dataPostagem = 'xx/xx/xxxx';
    const curtidas = 0;
    const curtidasUsuaria = [];
    const posts = {
      nome: nomeUsuaria,
      id: idUsuaria,
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

describe('curtirPost', () => {
  it('deve ser uma função', () => {
    expect(typeof curtirPost).toBe('function');
  });

  it('deve acrescentar uma curtida a cada clique', async () => {
    updateDoc.mockResolvedValue();
    const mockDoc = 'doc';
    doc.mockResolvedValueOnce(mockDoc);
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
