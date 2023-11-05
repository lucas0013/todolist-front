import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface IListagemCategoria {
  id: number;
  nome: string;
}

interface IDetalheCategoria {
  id: number;
  nome: string;
}

type TCategoriasPaginadas = {
  totalResults: number;
  currentPage: number;
  pageSize: number;
  itemsList: IListagemCategoria[];
}

const getAll = async (page = 1,  filter = ''): Promise<TCategoriasPaginadas | Error> => {
  try {
    const urlRelativa = `/Tags?busca=${filter}&page=${page}&pageSize=${Environment.LIMITE_DE_LINHAS}`;	

    const { data } = await Api.get(urlRelativa);

    if (data) {
      return data;
    }

    return new Error('Erro ao buscar categorias');

  } catch(error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao buscar categorias');
  }
};

const getById = async (id: number): Promise<IListagemCategoria | Error> => {
  try {
    const urlRelativa = `/Tags/${id}`;	

    const { data } = await Api.get(urlRelativa);

    if (data) {
      return data;
    }

    return new Error('Erro ao buscar categoria');

  } catch(error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao buscar categoria');
  }
};

const create = async (categoria: Omit<Omit<IDetalheCategoria, 'id'>, 'concluida'>): Promise<number | Error> => {
  try {
    const urlRelativa = '/Tags';	

    const { data } = await Api.post(urlRelativa, categoria);

    if (data)
      return data;

    return new Error('Erro ao criar categoria');

  } catch(error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao criar categoria');
  }
};

const updateById = async (categoria: Omit<IDetalheCategoria, 'concluida'>): Promise<any> => {
  try {
    const urlRelativa = '/Tags';	

    const { data } = await Api.put(urlRelativa, categoria);
    

    if (data)
      return data;

    return new Error('Erro ao atualizar categoria');

  } catch(error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar categoria');
  }
};

const deleteById = async (id: number): Promise<any> => {
  try {
    const urlRelativa = `/Tags/${id}`;	

    const { data } = await Api.delete(urlRelativa);

    if (data)
      return data;

    return new Error('Erro ao deletar categoria');

  } catch(error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao deletar categoria');
  }
};

export const CategoriasService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};