import React from 'react';
import styles from './Header.module.css';

function formatDigits(value) {
  const clamped = Math.max(-99, Math.min(999, value));
  return clamped < 0
    ? `-${String(Math.abs(clamped)).padStart(2, '0')}`
    : String(clamped).padStart(3, '0');
}

export default function Header({ minesCount, timer, gameStatus, onRestart }) {
  const statusEmoji =
    gameStatus === 'win' ? '😎' : gameStatus === 'lose' ? '😵' : '😊';

  return (
    <header className={styles.headerPanel} aria-label="Панель керування грою">
      <div className={styles.digitalCounter} title="Залишок прапорців">
        <span className={styles.counterLabel}>МІНИ</span>
        <span className={styles.counterValue}>{formatDigits(minesCount)}</span>
      </div>

      <button
        type="button"
        className={styles.restartButton}
        onClick={onRestart}
        title="Почати нову гру"
      >
        <span role="img" aria-label="Статус гри">
          {statusEmoji}
        </span>
      </button>

      <div className={styles.digitalCounter} title="Час гри у секундах">
        <span className={styles.counterLabel}>ЧАС</span>
        <span className={styles.counterValue}>{formatDigits(timer)}</span>
      </div>
    </header>
  );
}
