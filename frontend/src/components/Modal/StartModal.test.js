
import StartModal from "./StartModal";
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

describe('StartModal component test', () => {
    const mockOnstart = jest.fn();

    it('should not render modal when show is false', () => {
        render(<StartModal show={false} onStart={mockOnstart} />);
        const startModal = screen.queryByTestId('start-modal');
        expect(screen.queryByTestId(startModal)).toBeNull();
    });

    it('should render modal when show is true', () => {
        render(<StartModal show={true} onStart={mockOnstart} />);
        const startModal = screen.getByTestId('start-modal');
        expect(screen.queryByTestId(startModal)).toBeInTheDocument();
    });

    it('allows user to enter name', () => {
        render(<StartModal show={true} onStart={mockOnstart} />);
        const nameInput = screen.getByTestId('name-input');
        userEvent.type(nameInput, 'Player 1');
        expect(nameInput.value).toBe('Player 1')
    });

    it('allows user toggle pathfinding options', () => {
        render(<StartModal show={true} onStart={mockOnstart} />);
        const checkbox = screen.getByTestId('path-find-checkbox')
        expect(checkbox.checked).toBe(false);
        userEvent.click(checkbox);
        expect(checkbox.checked).toBe(true);
    });
})