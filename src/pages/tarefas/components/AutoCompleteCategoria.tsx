import { useState, useEffect, useMemo } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { CategoriasService } from '../../../shared/services/api/categorias/CategoriasService';
import { useDebounce } from '../../../shared/hooks';
import { useField } from '@unform/core';

type TAutoCompleteOption = {
  id: number;
  label: string;
}

interface IAutoCompleteCategoriaProps {
  isExternalLoading?: boolean;
}

export const AutoCompleteCategoria: React.FC<IAutoCompleteCategoriaProps> = ({isExternalLoading = false}) => {
  const { fieldName, registerField, defaultValue, error, clearError }= useField('tagId');
  const { debounce } = useDebounce(300, false);

  const [selectedId, setSelectedId] = useState<number | undefined>(defaultValue);
  
  const [opcoes, setOpcoes] = useState<TAutoCompleteOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [busca, setBusca]= useState('');

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => selectedId,
      setValue: (_, newSelectedId) => setSelectedId(newSelectedId),
    });
  }, [fieldName, registerField, selectedId]);

  useEffect(() => {
    setIsLoading(true);
    
    debounce(() => {
      CategoriasService.getAll(1, busca)
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
            return;
          } else {
            console.log(result);

            setOpcoes(result.itemsList.map(item => ({ id: item.id, label: item.nome })));
          }
        });
    });
  }, [busca]);

  const autoCompleteSelectedOption = useMemo(() => {
    if (!selectedId) return null;

    const selectedOption = opcoes.find(opcao => opcao.id === selectedId);
    if(!selectedOption) return null;

    return selectedOption;
  }, [selectedId, opcoes]);


  return (
    <Autocomplete
      openText='Abrir'
      closeText='Fechar'
      noOptionsText='Sem opções'
      loadingText='Carregando...'
      clearText='Limpar'

      disablePortal

    
      options={opcoes}
      loading={isLoading}
      disabled={isExternalLoading}
      value={autoCompleteSelectedOption}
      onInputChange={(_, newValue) => setBusca(newValue) }
      onChange={(_, newValue) => { setSelectedId(newValue?.id); setBusca(''); clearError();}}
      popupIcon={(isExternalLoading || isLoading) ? <CircularProgress size={28} /> : undefined}
      renderInput={(params) => (
        <TextField 
          {...params}

          label="Categoria"
          error={!!error}
          helperText={error}
        />
      )}
    />
  );
};