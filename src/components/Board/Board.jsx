import React from 'react';
import Cell from '../Cell/Cell';
import styles from './Board.module.css';

export default function Board({ boardData, onCellClick, onCellContextMenu }) {
  const rows = boardData.length;
  const cols = boardData[0]?.length || 0;

  return (
    <section className={styles.boardWrapper} aria-label="Ігрове поле">
      <div
        className={styles.boardGrid}
        style={{
          gridTemplateColumns: `repeat(${cols}, 38px)`,
          gridTemplateRows: `repeat(${rows}, 38px)`,
        }}
        role="grid"
      >
        {boardData.map((rowItems, rIdx) =>
          rowItems.map((cell) => (
            <Cell
              key={`${rIdx}-${cell.col}`}
              cell={cell}
              onClick={() => onCellClick(cell.row, cell.col)}
              onContextMenu={(e) => onCellContextMenu(e, cell.row, cell.col)}
            />
          ))
        )}
      </div>
    </section>
  );
}
