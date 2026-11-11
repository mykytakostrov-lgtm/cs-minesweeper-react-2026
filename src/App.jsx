import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GameListPage from './pages/Game/index.jsx';

export default function RootRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GameListPage />} />
      </Routes>
    </BrowserRouter>
  );
}