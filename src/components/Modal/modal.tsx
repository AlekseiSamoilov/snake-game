import React from 'react'
import styles from './modal.module.css'

interface IModalProps {
  show: boolean,
  title: string,
  buttonText: string,
  onClick: () => void
}

const Modal: React.FC<IModalProps> = ({ show, title, buttonText, onClick}) => {
  if (!show) {
    return null;
  }
  return (
    <div className={styles.overlay}>
        <div className={styles.modal}>
          <h2 className={styles.title}>{title}</h2>
          <button className={styles.button} onClick={onClick}>{buttonText}</button>
        </div>
    </div>
  )
}

export default Modal
