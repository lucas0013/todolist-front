import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useDrawerContext } from '../shared/contexts';
import { Dashboard, DetalheDeTarefas, ListagemDeTarefas } from '../pages';
import { ListagemDeCategorias } from '../pages/categorias/ListagemDeCategorias';
import { DetalheDeCategorias } from '../pages/categorias/DetalheDeCategorias';

export const AppRoutes = () => {
  const { setDrawerOptions } = useDrawerContext();

  useEffect(() => {
    setDrawerOptions([
      {
        icon: 'home',
        path: '/home',
        label: 'Página inicial'
      },
      {
        icon: 'tag',
        path: '/tarefas',
        label: 'Tarefas'
      },
      {
        icon: 'category',
        path: '/categorias',
        label: 'Categorias'
      },
    ]);
  }, [setDrawerOptions]);


  return (
    <Routes>
      <Route path="/home" element={<Dashboard/>} />

      <Route path="/tarefas" element={<ListagemDeTarefas />} />
      <Route path="/tarefas/detalhe/:id" element={<DetalheDeTarefas/>} />

      <Route path="/categorias" element={<ListagemDeCategorias />} />
      <Route path="/categorias/detalhe/:id" element={<DetalheDeCategorias/>} />

      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};