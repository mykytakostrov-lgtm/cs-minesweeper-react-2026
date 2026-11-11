import React from 'react';
import { Link } from 'react-router-dom';

export const implementations = [
  {
    id: 'kostrov-mykyta',
    title: 'Minesweeper React (Костров Микита, КС-32)',
    path: '/kostrov-mykyta',
    features: ['React 18 Hooks', 'CSS Modules', 'Flood-Fill', 'Mock State Mode'],
  },
];

export default function GameListPage() {
  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: '0 16px', fontFamily: 'sans-serif' }}>
      <h1>Play Game — Реалізації гри «Сапер» (Minesweeper)</h1>
      <p>Оберіть студентську імплементацію для запуску інтерактивної React-версії гри:</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {implementations.map((item) => (
          <li
            key={item.id}
            style={{
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              padding: 16,
              marginBottom: 12,
              backgroundColor: '#f8fafc',
            }}
          >
            <h2 style={{ margin: '0 0 8px' }}>{item.title}</h2>
            <p style={{ margin: '0 0 12px', color: '#475569' }}>
              Функціонал: {item.features.join(' · ')}
            </p>
            <Link to={item.path} style={{ fontWeight: 700, color: '#1d4ed8' }}>
              Відкрити гру →
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
