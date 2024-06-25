import React from "react";
import { render } from "@testing-library/react";
import Food from "./Food";
import style from "./Food.module.css";

describe('Food component', () => {
    it('Render correctly with props', () => {
        const { container } = render(<Food dot={[10, 20]} type="apple" />);
        const foodElement = container.firstChild;

        expect(foodElement).toHaveClass(style.food);
        expect(foodElement.style.top).toBe("20%");
        expect(foodElement.style.left).toBe("10%");
    })
})
