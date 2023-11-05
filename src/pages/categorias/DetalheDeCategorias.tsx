import { useEffect, useState} from 'react';
import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

import { CategoriasService } from '../../shared/services/api/categorias/CategoriasService';
import { VTextField, VForm, useVForm, IVFormErrors } from '../../shared/forms';
import { FerramentasDeDetalhe } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';

interface IFormData {
  nome: string;
}

const formValidationSchema: yup.Schema<IFormData> = yup.object().shape({
  nome: yup.string().required().min(3),
});

export const DetalheDeCategorias: React.FC = () => { 
  const { id = 'nova' } = useParams<'id'>();
  const navigate = useNavigate();
  const {formRef, save, saveAndClose, isSaveAndClose} = useVForm();

  const [ isLoading, setIsLoading ] = useState(false);
  const [ titulo, setTitulo ] = useState('');
  
  useEffect(() => {
    if (id !== 'nova') {
      setIsLoading(true);
      CategoriasService.getById(Number(id))
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
            navigate('/categorias');
            return;
          } else {
            setTitulo(result.nome);
            formRef.current?.setData({
              nome: result.nome
            });
          }
        });
    } else {
      formRef.current?.setData({
        nome: ''
      });
    }
  }, [id]);

  const handleSave = (dados: IFormData) => {

    formValidationSchema.
      validate(dados, {abortEarly: false})
      .then((dadosValidados) => {
        setIsLoading(true);
        if (id === 'nova') {
          CategoriasService.create(dadosValidados)
            .then((result) => {
              if (result instanceof Error) {
                alert(result.message);
              } else {
                if(isSaveAndClose()){
                  navigate('/categorias');
                } else{
                  navigate(`/categorias/detalhe/${result}`);
                }
              }
            });
        } else {
          CategoriasService.updateById({ id: Number(id), ...dadosValidados})
            .then((result) => {
              if (result instanceof Error) {
                alert(result.message);
              } else {
                if(isSaveAndClose()){
                  navigate('/categorias');
                }
              }
            });
        }

      })
      .catch((error: yup.ValidationError) => {
        const validationErrors: IVFormErrors = {};

        error.inner.forEach((error) => {

          if (!error.path) return;
          validationErrors[error.path] = error.message;
        }
        );
        formRef.current?.setErrors(validationErrors);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja apagar?')) {
      CategoriasService.deleteById(id)
        .then((result) => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            alert('Apagado com sucesso!');
            navigate('/categorias');
          }
        });      
    }
  };

  return (
    <LayoutBaseDePagina
      titulo={id === 'nova' ? 'Nova categoria' : titulo }
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo='Nova'
          mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={id !== 'nova'}
          mostrarBotaoApagar={id !== 'nova'}
          
          aoClicarEmVoltar={() => navigate('/categorias')}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmSalvar={save}
          aoClicarEmNovo={() => navigate('/categorias/detalhe/nova')}
          aoClicarEmSalvarEFechar={saveAndClose}
        />
      }
    >

      <VForm ref={formRef} onSubmit={handleSave}>
        <Box margin={1} display="flex" flexDirection="column" component={Paper} variant="outlined">
          <Grid container direction="column" padding={2} spacing={2}>

            {isLoading &&(
              <Grid item>
                <LinearProgress variant='indeterminate'/>
              </Grid>
            )}

            <Grid item>
              <Typography variant="h6">Geral</Typography>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name='nome'
                  label='Nome'
                  disabled={isLoading}
                  onChange={e => setTitulo(e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>  
        </Box>
      </VForm>

    </LayoutBaseDePagina>
  );
};