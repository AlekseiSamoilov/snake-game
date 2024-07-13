const API_URL = 'http://localhost:3000';

export interface IGameResult {
    playerName: string,
    score: number;
    gameDuration: number;
}

export const saveGameResult = async (result: IGameResult): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/game-results`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(result),
        });

        if (!response.ok) {
            throw new Error('Failed to save game result');
        }
    } catch (err) {
        console.error('Error saving game result:', err);
        throw err;
    }
};

export const getTopScores = async (limit: number = 10): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/game-results/top-scores?limit=${limit}`);

        if (!response.ok) {
            throw new Error('Failed to fetch top scores');
        }
        return response.json();
    } catch (err) {
        console.error('Error fetching top scores', err);
        throw err;
    }
};