import { useState } from 'react';

export interface IFoodEffect {
    effect: string;
    action: (...args: any[]) => void;
    duration: number;
    timeoutId?: NodeJS.Timeout;
  }

export const useEffectQueue = (setActiveEffects: React.Dispatch<React.SetStateAction<string[]>>) => {
    const [activeEffects, setInternalActiveEffects] = useState<IFoodEffect[]>([]);
  
    const applyEffect = (effect: IFoodEffect) => {

      if (effect.effect !== 'grow') {
        activeEffects.forEach(activeEffect => {
          if (activeEffect.effect !== 'grow' && activeEffect.effect !== effect.effect) {
            clearTimeout(activeEffect.timeoutId);
            activeEffect.action(false);
            setActiveEffects(prevState => prevState.filter(e => e !== activeEffect.effect));
            setInternalActiveEffects(prevEffects => prevEffects.filter(e => e.effect !== activeEffect.effect));
          }
        });
      }

      let updatedEffect = effect;
      const existingEffect = activeEffects.find(e => e.effect === effect.effect);
      if (existingEffect) {
        clearTimeout(existingEffect.timeoutId);
        updatedEffect.duration += existingEffect.duration;
        setInternalActiveEffects(prevEffects => prevEffects.filter(e => e.effect !== effect.effect));
      }
  
      setActiveEffects(prevState => [...prevState, effect.effect]);
      effect.action(true);
  
      const timeoutId = setTimeout(() => {
        setActiveEffects(prevState => prevState.filter(e => e !== effect.effect));
        effect.action(false);
        setInternalActiveEffects(prevEffects => prevEffects.filter(e => e.effect !== effect.effect));
      }, updatedEffect.duration);
  
      setInternalActiveEffects(prevEffects => [...prevEffects, { ...updatedEffect, timeoutId }]);
    };
  
    return applyEffect;
  };