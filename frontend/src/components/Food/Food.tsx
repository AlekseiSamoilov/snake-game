import React from "react";
import style from "./Food.module.css"

interface IFoodProps {
    dot: number[];
    type: string;
}

const Food: React.FC<IFoodProps> = ({ dot, type }) => {
    return (
        <div 
        data-testid='food'
        className={`${style.food} ${style[type]}`}
        style={{ top: `${dot[1]}%`, left: `${dot[0]}%` }}>
        </div>
    )
}

export default Food;