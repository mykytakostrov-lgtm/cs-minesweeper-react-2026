import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GameListPage from './pages/Game/index.jsx';
import KostrovMinesweeper from './pages/KostrovMykyta/App.jsx';

export default function RootRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GameListPage />} />
        <Route path="/kostrov-mykyta" element={<KostrovMinesweeper />} />
      </Routes>
    </BrowserRouter>
  );
}
