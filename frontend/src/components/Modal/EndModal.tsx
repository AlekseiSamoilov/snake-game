import React, { useEffect, useState } from 'react'
import styles from './modal.module.css'
import { saveGameResult } from '../../api/gameApi';

interface IEndModalProps {
    show: boolean;
    score: number;
    onPlayAgain: () => void;
    onNewUser: () => void;
    playerName: string;
    gameDuration: number;
}

const EndModal: React.FC<IEndModalProps> = ({ show, score, playerName, gameDuration, onPlayAgain, onNewUser, }) => {
  const [resultSaved, setResultSaved] = useState<boolean>(false)
  const [lastSavedName, setLastSavedName] = useState<string>('')
  useEffect(() => {
    const saveResult = async () => {
      if (show && !resultSaved && playerName && playerName !== lastSavedName) {
        try {
          await saveGameResult({
            playerName,
            score,
            gameDuration,
          });
          setResultSaved(true);
          setLastSavedName(playerName);
        } catch(err) {
          console.error('Failed to save game result');
        } 
      }
    };
    saveResult();
  }, [show, score, playerName, gameDuration, resultSaved, lastSavedName]);
    if (!show) return null;
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Game Over</h2>
        <p>Your score: {score}</p>
        <button className={styles.button} onClick={onPlayAgain}>Play Again</button>
        <button className={styles.button} onClick={onNewUser}>New User</button>
        {/* <button className={styles.button} onClick={handleSaveResult}>Save Result</button> */}
      </div>
    </div>
  )
}

export default EndModal
