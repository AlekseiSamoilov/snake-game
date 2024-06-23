import React, {useState} from 'react'
import styles from './modal.module.css'

interface IStartModalProps {
    show: boolean
    onStart: (name: string) => void;
}

const StartModal: React.FC<IStartModalProps> = ({ show, onStart }) => {
    const [name, setName] = useState<string>('')

    if (!show) return null;

    const handleSubmit = () => {
        onStart(name);
    }
  return (
<div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Enter Your Name</h2>
        <input 
          className={styles.input} 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Name"
        />
        <input type='checkbox' />
        <button className={styles.button} onClick={handleSubmit}>start game</button>
      </div>
    </div>
  )
}

export default StartModal
