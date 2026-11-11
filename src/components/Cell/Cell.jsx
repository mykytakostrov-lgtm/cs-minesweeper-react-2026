import React from 'react';
import styles from './Cell.module.css';

export default function Cell({ cell, onClick, onContextMenu }) {
  const { type, state, neighborMines, exploded } = cell;

  const classNames = [styles.cell];
  let content = '';

  if (state === 'closed') {
    classNames.push(styles.closed);
  } else if (state === 'flagged') {
    classNames.push(styles.flagged);
    content = '🚩';
  } else if (state === 'opened') {
    if (type === 'mine') {
      classNames.push(exploded ? styles.mineExploded : styles.mine);
      content = exploded ? '💥' : '💣';
    } else {
      classNames.push(styles.opened);
      if (neighborMines > 0) {
        classNames.push(styles[`num${neighborMines}`]);
        content = String(neighborMines);
      }
    }
  }

  return (
    <div
      role="gridcell"
      className={classNames.join(' ')}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {content}
    </div>
  );
}
