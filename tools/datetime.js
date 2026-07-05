export function getCurrentDateTime() {

    const now = new Date();

    return {
        date: now.toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric"
        }),

        day: now.toLocaleDateString("en-IN", {
            weekday: "long"
        }),

        time: now.toLocaleTimeString("en-IN")
    };
}