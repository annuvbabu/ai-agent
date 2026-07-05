export function calculate(expression) {

    try {

        const result = Function(
            `"use strict"; return (${expression})`
        )();

        return String(result);

    } catch {

        return "Invalid expression";

    }

}