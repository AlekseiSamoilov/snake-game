import React from 'react'
import style from './InfoBox.module.css'
import { formatTime } from '../../constants/constants';

interface IInfoBoxProps {
    userName: string;
    score: number;
    gameTime: number;
    bestResult: string;
    onResultOpne: () => void;
}

const InfoBox: React.FC<IInfoBoxProps> = ({ userName, score, gameTime, bestResult, onResultOpne}) => {
    const formattedTime = formatTime(gameTime);

  return (
     <div className={style.inform_box}>
        <h4 className={style.info_text}>current result: <span className={style.info_res}>{userName}:{score}</span></h4>
        <h4 data-testid="player-name" className={style.info_text_best}>best result: {bestResult}</h4>
        <h4 className={style.info_text}>game time: {formattedTime}</h4>
        <button className={style.table_button} onClick={onResultOpne}>results (shift)</button>
      </div>
  )
};
  
export default InfoBox
