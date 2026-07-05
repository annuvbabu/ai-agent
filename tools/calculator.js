export function calculate(expression) {
    try {
        return Function(
            `"use strict"; return (${expression})`
        )();
    } catch {
        return "Invalid Expression";
    }
}