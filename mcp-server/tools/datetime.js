export function getCurrentDateTime() {

    return new Date().toString();

}

export function getCurrentDate() {

    return new Date().toLocaleDateString();

}

export function getCurrentTime() {
    console.log("from mcp server")

    return new Date().toLocaleTimeString();

}