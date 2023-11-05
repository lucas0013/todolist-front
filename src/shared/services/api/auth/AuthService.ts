import { Api } from '../axios-config';

interface IAuth {
  expiration: string;
  token: string;
}

const auth = async (email: string, password: string): Promise<IAuth | Error> => {
  try {
    const urlRelativa = '/Token/LoginUser';	

    const { data } = await Api.post(urlRelativa, {email, password});

    if (data)
      return data;

    return new Error('Erro ao realizar login');

  } catch(error) {
    console.log(error);
    return new Error((error as { message: string }).message || 'Erro ao realizar login');
  }
};

export const AuthService = {
  auth, 
};