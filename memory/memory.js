import fs from "fs";

const FILE = "./memory/memory.json";

let memory = {};

if (fs.existsSync(FILE)) {

    const data =
        fs.readFileSync(FILE);

    memory =
        JSON.parse(data);

}


export function saveMemory(key, value) {

    memory[key] = value;

    fs.writeFileSync(
        FILE,
        JSON.stringify(
            memory,
            null,
            4
        )
    );

}

export function getMemory(key) {

    return memory[key];

}

export function getAllMemory() {

    return memory;

}