import React from 'react';
import { Box, TextField, Button, Paper, useTheme, Icon, InputAdornment } from '@mui/material';
import { Environment } from '../../environment';

interface IFerramentasDaListagemProps {
  textoDaBusca?: string;
  mostrarInputBusca?: boolean;
  aoMudarTextDeBusca?: (novoTexto: string) => void;
  textoBotaoNovo?: string;
  mostrarBotaoNovo?: boolean;
  aoClicarEmNovo?: () => void;
}

export const FerramentasDaListagem: React.FC<IFerramentasDaListagemProps> = ({
  textoDaBusca = '',
  mostrarInputBusca = false,
  aoMudarTextDeBusca,
  textoBotaoNovo = 'Novo',
  mostrarBotaoNovo = true,
  aoClicarEmNovo,
}) => {
  const theme = useTheme();

  return (
    <Box
      gap={1}
      marginX={1}
      padding={1}
      paddingX={2}
      display="flex"
      alignItems="center"
      height={theme.spacing(5)}
      component={Paper}>
      {mostrarInputBusca && (<TextField
        size="small"
        value={textoDaBusca}
        onChange={(e) => aoMudarTextDeBusca?.(e.target.value)}
        placeholder={Environment.INPUT_DE_BUSCA}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Icon>search</Icon>
            </InputAdornment>
          ),
        }}
      />)}
      {(mostrarBotaoNovo && <Box flex={1} display="flex" justifyContent="end">
        <Button
          color="primary"
          disableElevation
          variant="contained"
          onClick={aoClicarEmNovo}
          endIcon={<Icon>add</Icon>}
        >{textoBotaoNovo}</Button>
      </Box>)}
    </Box>
    
  );
};