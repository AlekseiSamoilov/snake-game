import React, { useEffect, useState } from 'react'
import styles from './modal.module.css'
import { getTopScores, IGameResult } from '../../api/gameApi';

interface iResultModalProps {
    show: boolean;
    name: string;
    score: number;
    onClose: () => void;
}

const ResultModal: React.FC<iResultModalProps> = ({ onClose, show, name, score}) => {
  const [topScores, setTopScores] = useState<IGameResult[]>([]);
  useEffect(() => {
    const fetchTopScores = async () => {
      try {
        const scores = await getTopScores(10);
        setTopScores(scores);
      } catch(error) {
        console.log('Failed to fetch top scores', error);
      }
    };
    if (show) {
      fetchTopScores();
    }
  }, [show]);
  if (!show) return null;
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Top scores</h2>
        {topScores.map((result, index) => (
        <div key={index} className={styles.result_row}>
        <p className={styles.result_cell}>{result.playerName}</p>
        <p className={styles.result_cell}>{result.score}</p>
        </div>
            ))}
        <button className={styles.close_btn} onClick={onClose}>X</button>
      </div>
    </div>
  )
}

export default ResultModal
