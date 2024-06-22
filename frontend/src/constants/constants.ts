export const getRandomCoordinates = () => {
    const min = 1;
    const max = 98;
    const x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
    const y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
    return [x, y];
}

export const getRandomFoodType = () => {
    const foodTypes = ["blue", "red", "green", "yellow", "purple"];
    const randomType = Math.floor(Math.random() * foodTypes.length);
    return foodTypes[randomType];
}

export const effectDuration = {
    speedDown: 5000,
    speedUp: 5000,
    freeze: 5000,
    blink: 7000,
    invisible: 6000
};

const useEffectQueue = (setActiveEffects: React.Dispatch<React.SetStateAction<string[]>>) => {
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