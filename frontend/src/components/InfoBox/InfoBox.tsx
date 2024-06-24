import React from 'react'
import style from './InfoBox.module.css'
import { formatTime } from '../../constants/constants';

interface IInfoBoxProps {
    userName: string;
    score: number;
    gameTime: number;
    onResultOpne: () => void;
}

const InfoBox: React.FC<IInfoBoxProps> = ({ userName, score, gameTime, onResultOpne}) => {
    const formattedTime = formatTime(gameTime);

  return (
     <div className={style.inform_box}>
        <h4 className={style.info_text}>current result: <span className={style.info_res}>{userName}:{score}</span></h4>
        <h4 className={style.info_text}>best result: {userName}:{score}</h4>
        <h4 className={style.info_text}>game time: {formattedTime}</h4>
        <button className={style.table_button} onClick={onResultOpne}>results</button>
      </div>
  )
};
  
export default InfoBox
