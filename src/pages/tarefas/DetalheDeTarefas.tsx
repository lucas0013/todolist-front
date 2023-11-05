import { useEffect, useState} from 'react';
import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

import { TarefasService } from '../../shared/services/api/tarefas/TarefasService';
import { VTextField, VForm, useVForm, IVFormErrors } from '../../shared/forms';
import { FerramentasDeDetalhe } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { AutoCompleteCategoria } from './components/AutoCompleteCategoria';

interface IFormData {
  titulo: string;
  descricao?: string;
  tagId?: number;
}

const formValidationSchema: yup.Schema<IFormData> = yup.object().shape({
  titulo: yup.string().required().min(3),
  descricao: yup.string(),
  tagId: yup.number().required(),
});

export const DetalheDeTarefas: React.FC = () => { 
  const { id = 'nova' } = useParams<'id'>();
  const navigate = useNavigate();
  const {formRef, save, saveAndClose, isSaveAndClose} = useVForm();

  const [ isLoading, setIsLoading ] = useState(false);
  const [ titulo, setTitulo ] = useState('');
  
  useEffect(() => {
    if (id !== 'nova') {
      setIsLoading(true);
      TarefasService.getById(Number(id))
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
            navigate('/tarefas');
          } else {
            setTitulo(result.titulo);
            formRef.current?.setData(result);
          }
        });
    } else {
      formRef.current?.setData({
        titulo: '',
        descricao: '',
        tagId: undefined,
      });
    }
  }, [id]);

  const handleSave = (dados: IFormData) => {

    formValidationSchema.
      validate(dados, {abortEarly: false})
      .then((dadosValidados) => {
        setIsLoading(true);
        if (id === 'nova') {
          TarefasService.create(dadosValidados)
            .then((result) => {
              if (result instanceof Error) {
                alert(result.message);
              } else {
                if(isSaveAndClose()){
                  navigate('/tarefas');
                } else{
                  navigate(`/tarefas/detalhe/${result}`);
                }
              }
            });
        } else {
          TarefasService.updateById({ id: Number(id), ...dadosValidados})
            .then((result) => {
              if (result instanceof Error) {
                alert(result.message);
              } else {
                if(isSaveAndClose()){
                  navigate('/tarefas');
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
        });

        console.log(validationErrors);

        formRef.current?.setErrors(validationErrors);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja apagar?')) {
      TarefasService.deleteById(id)
        .then((result) => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            alert('Apagado com sucesso!');
            navigate('/tarefas');
          }
        });      
    }
  };

  return (
    <LayoutBaseDePagina
      titulo={id === 'nova' ? 'Nova tarefa' : titulo }
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo='Nova'
          mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={id !== 'nova'}
          mostrarBotaoApagar={id !== 'nova'}
          
          aoClicarEmVoltar={() => navigate('/tarefas')}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmSalvar={save}
          aoClicarEmNovo={() => navigate('/tarefas/detalhe/nova')}
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
                  name='titulo'
                  label='Título'
                  disabled={isLoading}
                  onChange={e => setTitulo(e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name='descricao'
                  label='Descrição'
                  disabled={isLoading}
                />
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <AutoCompleteCategoria isExternalLoading={isLoading}/>
              </Grid>
            </Grid>
          </Grid>  
        </Box>
      </VForm>

    </LayoutBaseDePagina>
  );
};