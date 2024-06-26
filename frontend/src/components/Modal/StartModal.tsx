import React, {useState} from 'react'
import styles from './modal.module.css'

interface IStartModalProps {
    show: boolean
    onStart: (name: string, enablePathFinding: boolean) => void;
}

const StartModal: React.FC<IStartModalProps> = ({ show, onStart }) => {
    const [name, setName] = useState<string>('')
    const [enablePathFinding, setEnablePathFinding] = useState<boolean>(false);

    if (!show) return null;

    const handleSubmit = () => {
        onStart(name, enablePathFinding);
    }
  return (
<div className={styles.overlay}>
      <div data-testid="start-modal" className={styles.modal}>
        <h2 className={styles.title}>Enter Your Name</h2>
        <input 
          data-testid='name-input'
          className={styles.input} 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Name"
        />
        <label className={styles.input_label}>
        <input
        data-testid='path-find-checkbox'
        type='checkbox'
        checked={enablePathFinding}
        onChange={(e) => setEnablePathFinding(e.target.checked)} />
       Enable pathfinding option </label>
        <button 
        data-testid='start-button'
        className={styles.button} 
        onClick={handleSubmit}>start game</button>
      </div>
    </div>
  )
}

export default StartModal
