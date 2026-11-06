let codeInput = document.getElementById("codeInput");
let startTheCodeButton = document.getElementById("startTheCodeButton");

const variables = new Map();

function setVar(name, value) {
    variables.set(name, value);
}

function getVar(name) {
    if (!variables.has(name)) {
        throw new Error(`E_UNINITIALIZED: Nem inicializált változó: ${name}`);
    }
    return variables.get(name);
}

async function forward(steps) {
    console.log(`step forward ${steps}`);
}

async function turn(n) {
    console.log(`turn by ${n}`);
}

async function mineHere() {
    console.log("mine here");
}

async function isThere(w) {
    console.log(`isThere ${w}`);
    return false; 
}

async function printVal(val) {
    console.log("Konstruktor / Print kimenet:", val);
}

startTheCodeButton.addEventListener("click", function () {
    let code = codeInput.value;
    variables.clear();
    codeExecution(code);
});

async function codeExecution(code) {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const rawLines = code.split(/\r?\n/);
    let speed = 100;

    let lines = [];
    for (let i = 0; i < rawLines.length; i++) {
        let raw = rawLines[i];
        if (raw.trim() === "") {
            console.error(`Hiba a(z) ${i + 1}. sorban: A forráskód nem tartalmazhat üres sorokat.`);
            return;
        }
        if (raw.includes("\t")) {
            console.error(`Hiba a(z) ${i + 1}. sorban: Tab használata tilos, a behúzás csak szóközzel engedélyezett.`);
            return;
        }
        let indent = raw.search(/\S/);
        let text = raw.trim();
        lines.push({ lineNum: i + 1, indent, text });
    }

    function resolveSimpleVal(token) {
        if (token === "true") return true;
        if (token === "false") return false;
        if (!isNaN(token)) return parseInt(token, 10);
        return getVar(token);
    }

    async function evaluateCalculatedVal(tokens) {
        if (tokens.length === 1) {
            return resolveSimpleVal(tokens[0]);
        }
        if (tokens[0] === "isThere") {
            let w = resolveSimpleVal(tokens[1]);
            return await isThere(w);
        }
        if (tokens[0] === "not") {
            return !resolveSimpleVal(tokens[1]);
        }
        if (tokens.length === 3) {
            let left = resolveSimpleVal(tokens[0]);
            let op = tokens[1];
            let right = resolveSimpleVal(tokens[2]);
            if (op === "+") return left + right;
            if (op === "-") return left - right;
            if (op === "*") return left * right;
            if (op === "=") return left === right;
            if (op === "<>") return left !== right;
            if (op === "<") return left < right;
            if (op === "<=") return left <= right;
            if (op === ">") return left > right;
            if (op === ">=") return left >= right;
            if (op === "and") return left && right;
            if (op === "or") return left || right;
        }
        return null;
    }

    async function runBlock(index, minIndent) {
        let i = index;
        while (i < lines.length) {
            let current = lines[i];

            if (current.indent < minIndent) {
                break; // Kilépés a külsőbb blokkba
            }
            if (current.indent > minIndent) {
                console.error(`Szintaktikai hiba a(z) ${current.lineNum}. sorban: Nem egységes behúzás.`);
                break;
            }

            let tokens = current.text.split(/\s+/);
            let head = tokens[0];

            if (head === "set") {
                let ident = tokens[1];
                let exprTokens = tokens.slice(3);
                let val = await evaluateCalculatedVal(exprTokens);
                setVar(ident, val);
                i++;
            } else if (head === "step") {
                let val = resolveSimpleVal(tokens[2]);
                await forward(val);
                i++;
            } else if (head === "turn") {
                let val = resolveSimpleVal(tokens[2]);
                await turn(val);
                i++;
            } else if (head === "mine") {
                await mineHere();
                i++;
            } else if (head === "print") {
                let val = resolveSimpleVal(tokens[1]);
                await printVal(val);
                i++;
            } else if (head === "if") {
                let condVal = resolveSimpleVal(tokens[1]);
                
                let blockIndent = lines[i + 1] ? lines[i + 1].indent : minIndent + 1;
                i++;

                let thenBlockStart = i;
                while (i < lines.length && lines[i].indent >= blockIndent) {
                    i++;
                }
                let thenBlockEnd = i;

                let elseBlockStart = -1;
                let elseBlockEnd = -1;

                if (i < lines.length && lines[i].text === "else" && lines[i].indent === minIndent) {
                    i++; 
                    let elseIndent = lines[i] ? lines[i].indent : minIndent + 1;
                    elseBlockStart = i;
                    while (i < lines.length && lines[i].indent >= elseIndent) {
                        i++;
                    }
                    elseBlockEnd = i;
                }

                if (condVal) {
                    await runBlock(thenBlockStart, blockIndent);
                } else if (elseBlockStart !== -1) {
                    let elseIndent = lines[elseBlockStart].indent;
                    await runBlock(elseBlockStart, elseIndent);
                }
            } else if (head === "else") {
                i++;
            } else if (head === "while") {
                let condToken = tokens[1];
                let blockIndent = lines[i + 1] ? lines[i + 1].indent : minIndent + 1;
                let bodyStart = i + 1;
                
                let bodyEnd = bodyStart;
                while (bodyEnd < lines.length && lines[bodyEnd].indent >= blockIndent) {
                    bodyEnd++;
                }

                let safety = 0;
                while (resolveSimpleVal(condToken)) {
                    safety++;
                    if (safety > 1000) {
                        console.error("INSTRUCTION_COUNT_LIMIT_EXCEEDED / Végtelen ciklus védelem");
                        break;
                    }
                    let subIndex = bodyStart;
                    while (subIndex < bodyEnd) {
                        subIndex = await runBlock(subIndex, blockIndent);
                    }
                    await delay(speed);
                }
                i = bodyEnd;
            } else {
                console.error(`Ismeretlen utasítás a(z) ${current.lineNum}. sorban: "${head}"`);
                i++;
            }

            await delay(speed);
        }
        return i;
    }

    await runBlock(0, 0);
}