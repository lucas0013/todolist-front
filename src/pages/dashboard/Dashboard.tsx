import { useEffect, useState } from 'react';
import { FerramentasDaListagem } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { CategoriasService } from '../../shared/services/api/categorias/CategoriasService';
import { TarefasService } from '../../shared/services/api/tarefas/TarefasService';


export const Dashboard = () => {

  const [isLoadingCategorias, setIsLoadingCategorias] = useState(false);
  const [totalCountCategorias, setTotalCountCategorias] = useState(0);
  const [isLoadingTarefas, setIsLoadingTarefas] = useState(false);
  const [totalCountTarefas, setTotalCountTarefas] = useState(0);

  useEffect(() => {
    setIsLoadingCategorias(true);

    CategoriasService.getAll(1)
      .then((result) => {
        setIsLoadingCategorias(false);

        if (result instanceof Error) {
          alert(result.message);
          return;
        } else {
          console.log(result);
          setTotalCountCategorias(result.totalResults);
        }
      });
  }, []);

  useEffect(() => {
    setIsLoadingTarefas(true);

    TarefasService.getAll(1)
      .then((result) => {
        setIsLoadingTarefas(false);

        if (result instanceof Error) {
          alert(result.message);
          return;
        } else {
          console.log(result);
          setTotalCountTarefas(result.totalResults);
        }
      });
  }, []);

  return(
    <LayoutBaseDePagina
      titulo="Título"
      barraDeFerramentas={<FerramentasDaListagem mostrarBotaoNovo={false}/>}> 
      
      <Box width='100%' display='flex' >
        <Grid container margin={2}>
          <Grid item container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
              <Card>
                <CardContent>
                  <Typography variant="h5" align='center'>
                  Total de Categorias
                  </Typography>

                  <Box padding={6} display='flex' justifyContent='center' alignItems='center'>
                    {!isLoadingCategorias && (
                      <Typography variant="h1">
                        {totalCountCategorias}
                      </Typography>
                    )}
                    {isLoadingCategorias && (
                      <Typography variant="h5">
                        Carregando...
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>

            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
              <Card>
                <CardContent>
                  <Typography variant="h5" align='center'>
                  Total de Tarefas
                  </Typography>

                  <Box padding={6} display='flex' justifyContent='center' alignItems='center'>
                    {!isLoadingTarefas && (
                      <Typography variant="h1">
                        {totalCountTarefas}
                      </Typography>
                    )}
                    {isLoadingTarefas && (
                      <Typography variant="h5">
                        Carregando...
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>

            </Grid>
          </Grid>
        </Grid>

      </Box>

    </LayoutBaseDePagina>
  );
};