import React, { useEffect, useState } from 'react'
import styles from './modal.module.css'
import { getTopScores, IGameResult } from '../../api/gameApi';

interface iResultModalProps {
  show: boolean;
  name: string;
  score: number;
  onClose: () => void;
}

const ResultModal: React.FC<iResultModalProps> = ({ onClose, show, name, score }) => {
  const [topScores, setTopScores] = useState<IGameResult[]>([]);
  const formatGameDate = (gameDate?: string) => {
    if (!gameDate) {
      return '-';
    }
    return new Date(gameDate).toLocaleString();
  };

  useEffect(() => {
    const fetchTopScores = async () => {
      try {
        const scores = await getTopScores(20);
        setTopScores(scores);
      } catch (error) {
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
      <div className={styles.modal_result}>
        <h2 className={styles.result_title}>Top scores</h2>
        <div className={styles.result_container}>
          {topScores.map((result, index) => (
            <div key={index} className={styles.result_row}>
              <p className={styles.result_cell}>{result.playerName}</p>
              <p className={styles.result_cell}>{result.score}</p>
              <p className={styles.result_cell}>{formatGameDate(result.gameDate)}</p>

            </div>
          ))}
          <button className={styles.close_btn} onClick={onClose}>X</button>
        </div>
      </div>
    </div>
  )
}

export default ResultModal
