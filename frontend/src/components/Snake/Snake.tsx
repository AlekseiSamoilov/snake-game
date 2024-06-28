import React from "react";
import style from "./Snake.module.css"

interface ISnakeProps {
    snakeDots: number[][];
    isInvisible: boolean;
    isBlinking: boolean;
    isFreez: boolean;
    isHot: boolean;
    cutTails: number[][][];
    isInvulnerable: boolean;
}

const Snake: React.FC<ISnakeProps> = ({ snakeDots, isInvisible, isBlinking, isFreez, isHot, cutTails, isInvulnerable }) => {
    return (
    <div>
        {snakeDots.map((dot, i) => (
            <div 
            className={
            `${style.snake_dot} 
            ${isInvisible ? style.invisible : ''} 
            ${isBlinking ? style.blinking : ''} 
            ${isFreez ? style.freez : ''} 
            ${isHot ? style.hot : ''}
            ${isInvulnerable ? style.invulnerable : ''}
            `}
            key={i} 
            style={{ top: `${dot[1]}%`, left: `${dot[0]}%`, animationDelay: `${i * 50}ms`}} />
        ))}
        {cutTails.map((tail, tailIndex) => 
                tail.map((dot, dotIndex) => (
                    <div 
                        className={`${style.snake_dot} ${style.cut_tail}`}
                        key={`cut-${tailIndex}-${dotIndex}`} 
                        style={{ 
                            top: `${dot[1]}%`, 
                            left: `${dot[0]}%`
                        }} 
                    />
                ))
            )}
    </div>
    )
};

export default Snake; 