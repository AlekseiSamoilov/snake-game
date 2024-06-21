import React from 'react'
import styles from './modal.module.css'

interface iResultModalProps {
    show: boolean;
    name: string;
    score: number;
    onClose: () => void;
}

const ResultModal: React.FC<iResultModalProps> = ({ onClose, show, name, score}) => {
    if (!show) return null;
    
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.result_row}>
        <p className={styles.result_cell}>{name}</p>
        <p className={styles.result_cell}>{score}</p>
        </div>
        <button className={styles.close_btn} onClick={onClose}>X</button>
      </div>
    </div>
  )
}

export default ResultModal
