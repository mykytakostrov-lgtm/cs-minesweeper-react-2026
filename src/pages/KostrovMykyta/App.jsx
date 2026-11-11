import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../components/Header/Header';
import Board from '../../components/Board/Board';
import styles from './App.module.css';

// Статичний демонстраційний стан (Mock Board) для демонстрації всіх станів клітинок через Props
const MOCK_BOARD_DATA = [
  [
    { row: 0, col: 0, type: 'empty', state: 'opened', neighborMines: 0 },
    { row: 0, col: 1, type: 'empty', state: 'opened', neighborMines: 1 },
    { row: 0, col: 2, type: 'mine', state: 'flagged', neighborMines: 0 },
    { row: 0, col: 3, type: 'empty', state: 'closed', neighborMines: 1 },
  ],
  [
    { row: 1, col: 0, type: 'empty', state: 'opened', neighborMines: 1 },
    { row: 1, col: 1, type: 'empty', state: 'opened', neighborMines: 2 },
    { row: 1, col: 2, type: 'empty', state: 'opened', neighborMines: 3 },
    { row: 1, col: 3, type: 'empty', state: 'closed', neighborMines: 2 },
  ],
  [
    { row: 2, col: 0, type: 'empty', state: 'closed', neighborMines: 1 },
    { row: 2, col: 1, type: 'mine', state: 'opened', neighborMines: 0, exploded: true },
    { row: 2, col: 2, type: 'empty', state: 'opened', neighborMines: 4 },
    { row: 2, col: 3, type: 'mine', state: 'opened', neighborMines: 0 },
  ],
  [
    { row: 3, col: 0, type: 'empty', state: 'closed', neighborMines: 1 },
    { row: 3, col: 1, type: 'empty', state: 'closed', neighborMines: 2 },
    { row: 3, col: 2, type: 'mine', state: 'flagged', neighborMines: 0 },
    { row: 3, col: 3, type: 'empty', state: 'closed', neighborMines: 1 },
  ],
];

const DIFFICULTIES = {
  beginner: { label: 'Початковий 9×9', rows: 9, cols: 9, mines: 10 },
  intermediate: { label: 'Середній 16×16', rows: 16, cols: 16, mines: 40 },
};

function createBoard(rows, cols, minesCount) {
  const board = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      row: r,
      col: c,
      type: 'empty',
      state: 'closed',
      neighborMines: 0,
      exploded: false,
    }))
  );

  let placed = 0;
  while (placed < minesCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (board[r][c].type !== 'mine') {
      board[r][c].type = 'mine';
      placed++;
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].type === 'mine') continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].type === 'mine') {
            count++;
          }
        }
      }
      board[r][c].neighborMines = count;
    }
  }

  return board;
}

export default function KostrovMinesweeper() {
  const [difficultyKey, setDifficultyKey] = useState('beginner');
  const config = DIFFICULTIES[difficultyKey];

  const [boardData, setBoardData] = useState(() =>
    createBoard(config.rows, config.cols, config.mines)
  );
  const [minesCount, setMinesCount] = useState(config.mines);
  const [flagsPlaced, setFlagsPlaced] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameStatus, setGameStatus] = useState('process'); // 'process' | 'win' | 'lose'
  const [isMockPreview, setIsMockPreview] = useState(false);

  // Таймер гри через useEffect
  useEffect(() => {
    if (gameStatus !== 'process' || isMockPreview) return undefined;
    const intervalId = setInterval(() => {
      setTimer((prev) => (prev < 999 ? prev + 1 : prev));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [gameStatus, isMockPreview]);

  const handleRestart = useCallback(
    (nextKey = difficultyKey) => {
      const cfg = DIFFICULTIES[nextKey];
      setIsMockPreview(false);
      setBoardData(createBoard(cfg.rows, cfg.cols, cfg.mines));
      setMinesCount(cfg.mines);
      setFlagsPlaced(0);
      setTimer(0);
      setGameStatus('process');
    },
    [difficultyKey]
  );

  const handleDifficultyChange = (newKey) => {
    setDifficultyKey(newKey);
    handleRestart(newKey);
  };

  const handleCellClick = useCallback(
    (row, col) => {
      if (gameStatus !== 'process' || isMockPreview) return;

      setBoardData((prevBoard) => {
        const nextBoard = prevBoard.map((r) => r.map((cell) => ({ ...cell })));
        const target = nextBoard[row][col];

        if (target.state === 'opened' || target.state === 'flagged') {
          return prevBoard;
        }

        if (target.type === 'mine') {
          target.state = 'opened';
          target.exploded = true;
          nextBoard.forEach((r) =>
            r.forEach((c) => {
              if (c.type === 'mine' && c.state !== 'flagged') c.state = 'opened';
            })
          );
          setGameStatus('lose');
          return nextBoard;
        }

        // Рекурсивне відкриття порожніх клітинок (Flood-Fill)
        const reveal = (r, c) => {
          if (r < 0 || r >= nextBoard.length || c < 0 || c >= nextBoard[0].length) return;
          const cell = nextBoard[r][c];
          if (cell.state !== 'closed' || cell.type === 'mine') return;
          cell.state = 'opened';
          if (cell.neighborMines === 0) {
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                if (dr !== 0 || dc !== 0) reveal(r + dr, c + dc);
              }
            }
          }
        };

        reveal(row, col);

        const remainingSafe = nextBoard
          .flat()
          .filter((c) => c.type === 'empty' && c.state !== 'opened').length;
        if (remainingSafe === 0) {
          setGameStatus('win');
        }

        return nextBoard;
      });
    },
    [gameStatus, isMockPreview]
  );

  const handleCellRightClick = useCallback(
    (event, row, col) => {
      event.preventDefault();
      if (gameStatus !== 'process' || isMockPreview) return;

      setBoardData((prevBoard) => {
        const nextBoard = prevBoard.map((r) => r.map((cell) => ({ ...cell })));
        const target = nextBoard[row][col];
        if (target.state === 'opened') return prevBoard;

        if (target.state === 'closed' && flagsPlaced < minesCount) {
          target.state = 'flagged';
          setFlagsPlaced((f) => f + 1);
        } else if (target.state === 'flagged') {
          target.state = 'closed';
          setFlagsPlaced((f) => f - 1);
        }
        return nextBoard;
      });
    },
    [gameStatus, isMockPreview, flagsPlaced, minesCount]
  );

  const activeBoard = isMockPreview ? MOCK_BOARD_DATA : boardData;
  const remainingMines = isMockPreview ? 8 : minesCount - flagsPlaced;

  return (
    <main className={styles.appWrapper}>
      <section className={styles.gameContainer}>
        <div className={styles.topControls}>
          <div className={styles.difficultyGroup}>
            {Object.entries(DIFFICULTIES).map(([key, item]) => (
              <button
                key={key}
                type="button"
                className={`${styles.modeBtn} ${
                  difficultyKey === key && !isMockPreview ? styles.modeBtnActive : ''
                }`}
                onClick={() => handleDifficultyChange(key)}
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              className={`${styles.modeBtn} ${isMockPreview ? styles.modeBtnActive : ''}`}
              onClick={() => setIsMockPreview((prev) => !prev)}
            >
              Демо станів (Mock 4×4)
            </button>
          </div>
        </div>

        <Header
          minesCount={remainingMines}
          timer={isMockPreview ? 45 : timer}
          gameStatus={isMockPreview ? 'process' : gameStatus}
          onRestart={() => handleRestart(difficultyKey)}
        />

        <Board
          boardData={activeBoard}
          onCellClick={handleCellClick}
          onCellContextMenu={handleCellRightClick}
        />
      </section>
    </main>
  );
}
