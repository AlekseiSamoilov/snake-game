import React from 'react'
import styles from './modal.module.css'

interface IEndModalProps {
    show: boolean;
    score: number;
    onPlayAgain: () => void;
    onNewUser: () => void;
}

const EndModal: React.FC<IEndModalProps> = ({ show, score, onPlayAgain, onNewUser }) => {

    if (!show) return null;
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Game Over</h2>
        <p>Your score: {score}</p>
        <button className={styles.button} onClick={onPlayAgain}>Play Again</button>
        <button className={styles.button} onClick={onNewUser}>New User</button>
      </div>
    </div>
  )
}

export default EndModal
