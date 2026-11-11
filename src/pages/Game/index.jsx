import React from 'react';
import { Link } from 'react-router-dom';

export const implementations = [];

export default function GameListPage() {
  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: '0 16px', fontFamily: 'sans-serif' }}>
      <h1>Play Game — Реалізації гри «Сапер» (Minesweeper)</h1>
      <p>Оберіть студентську імплементацію для запуску інтерактивної React-версії гри:</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {implementations.map((item) => (
          <li key={item.id}>
            <Link to={item.path}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}