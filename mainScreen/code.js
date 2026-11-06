// ---------- Konstansok ----------
const KEYWORDS = new Set([
    "and","by","else","false","forward","here","if",
    "isthere","mine","not","or","print","set","step",
    "to","true","turn","while"
]);
const BIN_OPERATORS = new Set(["+","-","*","=","<>","<","<=",">",">=","and","or"]);
const ARITH_OPS   = new Set(["+","-","*"]);
const COMPARE_OPS = new Set(["<","<=",">",">="]);
const EQUALITY_OPS = new Set(["=","<>"]);
const LOGIC_OPS   = new Set(["and","or"]);
const terminal = document.getElementById("terminal");

// ---------- Hibák ----------
class MineSyntaxError extends Error {
    constructor(lineNum, message) {
        super(`Szintaktikai hiba a(z) ${lineNum}. sorban: ${message}`);
        this.name = 'MineSyntaxError';
        this.lineNum = lineNum;
    }
}
class MineRuntimeError extends Error {
    constructor(code, message) {
        super(`${code}: ${message}`);
        this.name = 'MineRuntimeError';
        this.code = code;
    }
}

// ---------- Token segédek ----------
const isKeyword     = t => KEYWORDS.has(t.toLowerCase());
const isValidIdent  = t => /^[a-zA-Z][a-zA-Z0-9]*$/.test(t) && !isKeyword(t);
const isNumberTok   = t => /^[0-9]+$/.test(t);
const isBooleanLit  = t => t === "true" || t === "false";

// 1. tokenizálás
function tokenizeLine(raw, lineNum) {
    if (raw.includes("\t")) throw new MineSyntaxError(lineNum, "Tab használata tilos.");
    if (raw.trim() === "")  throw new MineSyntaxError(lineNum, "Üres sor nem megengedett.");
    const indent = raw.length - raw.trimStart().length;
    const text = raw.trim();
    if (text.includes("  ")) throw new MineSyntaxError(lineNum, "Egynél több szóköz a tokenek között.");
    return { lineNum, indent, tokens: text.split(" "), text };
}

// 2. PARSZER (AST)
function parseSimpleVal(token, lineNum) {
    if (isBooleanLit(token)) return { kind:'bool', value: token === "true" };
    if (isNumberTok(token)) {
        const n = parseInt(token, 10);
        if (n < 0 || n > 100) throw new MineSyntaxError(lineNum, `A szám (${n}) 0 és 100 közé kell essen.`);
        return { kind:'number', value: n };
    }
    if (isValidIdent(token)) return { kind:'ident', name: token };
    throw new MineSyntaxError(lineNum, `Érvénytelen egyszerű érték: "${token}".`);
}

function parseCalculatedVal(tokens, lineNum) {
    if (tokens.length === 1) return { type:'simple', sv: parseSimpleVal(tokens[0], lineNum) };
    if (tokens.length === 2) {
        if (tokens[0] === "isThere") return { type:'isThere', arg: parseSimpleVal(tokens[1], lineNum) };
        if (tokens[0] === "not")     return { type:'unop', op:'not', operand: parseSimpleVal(tokens[1], lineNum) };
        throw new MineSyntaxError(lineNum, `Érvénytelen kifejezés: "${tokens.join(" ")}".`);
    }
    if (tokens.length === 3) {
        if (!BIN_OPERATORS.has(tokens[1]))
            throw new MineSyntaxError(lineNum, `Érvénytelen bináris operátor: "${tokens[1]}".`);
        return { type:'binop', op: tokens[1],
                 left:  parseSimpleVal(tokens[0], lineNum),
                 right: parseSimpleVal(tokens[2], lineNum) };
    }
    throw new MineSyntaxError(lineNum, `Érvénytelen kifejezés: "${tokens.join(" ")}".`);
}

function parseSingleStatement(line) {
    const { lineNum, tokens } = line;
    const head = tokens[0];

    if (head === "set") {
        if (tokens.length < 4) throw new MineSyntaxError(lineNum, "A set formája: set <változó> to <kifejezés>.");
        if (!isValidIdent(tokens[1])) throw new MineSyntaxError(lineNum, `Érvénytelen változónév: "${tokens[1]}".`);
        if (tokens[2] !== "to")       throw new MineSyntaxError(lineNum, "A set után 'to' kulcsszó kell.");
        return { type:'set', name: tokens[1], expr: parseCalculatedVal(tokens.slice(3), lineNum), lineNum };
    }
    if (head === "step") {
        if (tokens.length !== 3) throw new MineSyntaxError(lineNum, "A step formája: step forward <érték>.");
        if (tokens[1] !== "forward") throw new MineSyntaxError(lineNum, "A step után 'forward' kulcsszó kell.");
        return { type:'step', arg: parseSimpleVal(tokens[2], lineNum), lineNum };
    }
    if (head === "turn") {
        if (tokens.length !== 3) throw new MineSyntaxError(lineNum, "A turn formája: turn by <érték>.");
        if (tokens[1] !== "by") throw new MineSyntaxError(lineNum, "A turn után 'by' kulcsszó kell.");
        return { type:'turn', arg: parseSimpleVal(tokens[2], lineNum), lineNum };
    }
    if (head === "mine") {
        if (tokens.length !== 2 || tokens[1] !== "here")
            throw new MineSyntaxError(lineNum, "A mine formája: mine here.");
        return { type:'mine', lineNum };
    }
    if (head === "print") {
        if (tokens.length !== 2) throw new MineSyntaxError(lineNum, "A print formája: print <érték>.");
        return { type:'print', arg: parseSimpleVal(tokens[1], lineNum), lineNum };
    }
    if (head === "if") {
        if (tokens.length !== 2) throw new MineSyntaxError(lineNum, "Az if formája: if <feltétel>.");
        return { type:'if', cond: parseSimpleVal(tokens[1], lineNum), lineNum };
    }
    if (head === "while") {
        if (tokens.length !== 2) throw new MineSyntaxError(lineNum, "A while formája: while <feltétel>.");
        return { type:'while', cond: parseSimpleVal(tokens[1], lineNum), lineNum };
    }
    if (head === "else") throw new MineSyntaxError(lineNum, "A 'else' csak 'if' blokk után állhat.");
    throw new MineSyntaxError(lineNum, `Ismeretlen utasítás: "${head}".`);
}

function parseProgram(code) {
    if (code.trim() === "") return [];
    const rawLines = code.split(/\r?\n/);
    const lines = rawLines.map((raw, i) => tokenizeLine(raw, i + 1));

    if (lines.length > 0 && lines[0].indent !== 0)
        throw new MineSyntaxError(lines[0].lineNum, "A program tetején (0. szinten) 0 behúzás várható.");

    let idx = 0;
    function parseBlock(minIndent) {
        if (idx >= lines.length) return [];
        const blockIndent = lines[idx].indent;
        if (blockIndent <= minIndent) return [];        // üres blokk

        const stmts = [];
        while (idx < lines.length) {
            const line = lines[idx];
            if (line.indent < blockIndent) break;
            if (line.indent > blockIndent)
                throw new MineSyntaxError(line.lineNum, "Nem egységes behúzás a blokkon belül.");

            const head = line.tokens[0];
            if (head === "if") {
                const ifStmt = parseSingleStatement(line);
                idx++;
                ifStmt.thenBlock = parseBlock(blockIndent);
                if (idx < lines.length && lines[idx].tokens[0] === "else") {
                    const elseLine = lines[idx];
                    if (elseLine.tokens.length !== 1)
                        throw new MineSyntaxError(elseLine.lineNum, "Az 'else' után nem állhat semmi.");
                    if (elseLine.indent !== blockIndent)
                        throw new MineSyntaxError(elseLine.lineNum, "Az 'else' behúzása nem egyezik az 'if'-ével.");
                    idx++;
                    ifStmt.elseBlock = parseBlock(blockIndent);
                }
                stmts.push(ifStmt);
            } else if (head === "while") {
                const w = parseSingleStatement(line);
                idx++;
                w.body = parseBlock(blockIndent);
                stmts.push(w);
            } else {
                stmts.push(parseSingleStatement(line));
                idx++;
            }
        }
        return stmts;
    }

    const program = parseBlock(-1);
    if (idx < lines.length)
        throw new MineSyntaxError(lines[idx].lineNum, "Nem egységes behúzás (a program tetején 0 behúzás várható).");
    return program;
}

// 3. robot szimulációja
class Robot {
    static DX = [0, 1, 0, -1];   // fel, jobbra, le, balra
    static DY = [-1, 0, 1, 0];

    constructor(map, x, y, dir) { this.map = map; this.x = x; this.y = y; this.dir = dir; }

    _inBounds(x, y) { return y >= 0 && y < this.map.length && x >= 0 && x < this.map[0].length; }
    _cellAt(x, y)   { return this._inBounds(x, y) ? this.map[y][x] : 1; }   // fal a pályán kívül
    _frontCell()    { return this._cellAt(this.x + Robot.DX[this.dir], this.y + Robot.DY[this.dir]); }

    isThere(w) {
        if (typeof w !== 'number' || !Number.isInteger(w) || ![0,1,2].includes(w))
            throw new MineRuntimeError('E_BAD_ARG', `Az isThere paramétere 0, 1 vagy 2 kell legyen, de ${w} lett.`);
        return this._frontCell() === w;
    }
    forward(n) {
        if (typeof n !== 'number' || !Number.isInteger(n) || n < 0)
            throw new MineRuntimeError('E_BAD_ARG', `A step forward paramétere nemnegatív egész kell legyen, de ${n} lett.`);
        const dx = Robot.DX[this.dir], dy = Robot.DY[this.dir];
        for (let i = 1; i <= n; i++) {
            const nx = this.x + dx*i, ny = this.y + dy*i;
            if (this._cellAt(nx, ny) === 1)
                throw new MineRuntimeError('E_BEDROCK_HIT', `A robot falba ütközne a (${nx}, ${ny}) mezőn.`);
        }
        this.x += dx*n; this.y += dy*n;
    }
    turn(n) {
        if (typeof n !== 'number' || !Number.isInteger(n) || n < 0)
            throw new MineRuntimeError('E_BAD_ARG', `A turn by paramétere nemnegatív egész kell legyen, de ${n} lett.`);
        this.dir = ((this.dir - n) % 4 + 4) % 4;   // balra = óramutató járásával ellentétesen
    }
    mine() {
        if (this._cellAt(this.x, this.y) !== 2)
            throw new MineRuntimeError('E_NO_GOLD', `A (${this.x}, ${this.y}) mezőn nincs arany.`);
        this.map[this.y][this.x] = 0;
    }
}

// 4. végrehajtás
class Interpreter {
    constructor(robot, outputFn) {
        this.robot = robot;
        this.variables = new Map();          // name -> { value, type }
        this.outputFn = outputFn || (x => console.log(x));
        this.instructionCount = 0;
        this.maxInstructions = 1_000_000;    // védőkorlát végtelen ciklus ellen
    }
    _count() {
        if (++this.instructionCount > this.maxInstructions)
            throw new MineRuntimeError('E_INSTRUCTION_LIMIT', 'Túl sok utasítás (végtelen ciklus?).');
    }
    async run(program) {
        this.variables.clear(); this.instructionCount = 0;
        await this.executeBlock(program);
    }
    async executeBlock(stmts) { for (const s of stmts) await this.executeStatement(s); }

    async executeStatement(stmt) {
        this._count();
        switch (stmt.type) {
            case 'set': {
                const v = this.evaluateCalculatedVal(stmt.expr);
                this.setVariable(stmt.name, v);
                break;
            }
            case 'step':  this.robot.forward(this.evaluateSimpleVal(stmt.arg)); break;
            case 'turn':  this.robot.turn(this.evaluateSimpleVal(stmt.arg));    break;
            case 'mine':  this.robot.mine();                                    break;
            case 'print': this.outputFn(this.evaluateSimpleVal(stmt.arg));      break;
            case 'if': {
                const c = this.evaluateSimpleVal(stmt.cond);
                if (typeof c !== 'boolean')
                    throw new MineRuntimeError('E_NON_BOOL_CONDITION', `Az if feltétele nem logikai érték (${typeof c}).`);
                if (c) await this.executeBlock(stmt.thenBlock);
                else if (stmt.elseBlock) await this.executeBlock(stmt.elseBlock);
                break;
            }
            case 'while': {
                while (true) {
                    this._count();
                    const c = this.evaluateSimpleVal(stmt.cond);
                    if (typeof c !== 'boolean')
                        throw new MineRuntimeError('E_NON_BOOL_CONDITION', `A while feltétele nem logikai érték (${typeof c}).`);
                    if (!c) break;
                    await this.executeBlock(stmt.body);
                }
                break;
            }
        }
    }

    setVariable(name, value) {
        const type = typeof value;
        if (this.variables.has(name)) {
            const old = this.variables.get(name);
            if (old.type !== type)
                throw new MineRuntimeError('E_TYPE_MISMATCH', `A(z) "${name}" változó típusa ${old.type}, de ${type} értéket kapna.`);
            old.value = value;
        } else this.variables.set(name, { value, type });
    }

    evaluateSimpleVal(sv) {
        if (sv.kind === 'bool' || sv.kind === 'number') return sv.value;
        if (sv.kind === 'ident') {
            if (!this.variables.has(sv.name))
                throw new MineRuntimeError('E_UNINITIALIZED', `A(z) "${sv.name}" változó még nincs inicializálva.`);
            return this.variables.get(sv.name).value;
        }
    }

    evaluateCalculatedVal(expr) {
        switch (expr.type) {
            case 'simple': return this.evaluateSimpleVal(expr.sv);
            case 'isThere': {
                const w = this.evaluateSimpleVal(expr.arg);
                if (typeof w !== 'number')
                    throw new MineRuntimeError('E_BAD_ARG', `Az isThere paramétere szám kell legyen (${typeof w}).`);
                return this.robot.isThere(w);
            }
            case 'unop': {
                const o = this.evaluateSimpleVal(expr.operand);
                if (typeof o !== 'boolean')
                    throw new MineRuntimeError('E_BAD_OPERAND', `A 'not' operandusa logikai kell legyen (${typeof o}).`);
                return !o;
            }
            case 'binop': {
                const op = expr.op;
                // Bal operandus
                const left = this.evaluateSimpleVal(expr.left);
                if (ARITH_OPS.has(op)   && typeof left !== 'number')  throw new MineRuntimeError('E_BAD_OPERAND', `A(z) "${op}" bal operandusa egész kell legyen.`);
                if (COMPARE_OPS.has(op) && typeof left !== 'number')  throw new MineRuntimeError('E_BAD_OPERAND', `A(z) "${op}" bal operandusa egész kell legyen.`);
                if (LOGIC_OPS.has(op)   && typeof left !== 'boolean') throw new MineRuntimeError('E_BAD_OPERAND', `A(z) "${op}" bal operandusa logikai kell legyen.`);
                // Jobb operandus (akkor is beolvassa, ha rövidzár lehetséges)
                const right = this.evaluateSimpleVal(expr.right);
                if (ARITH_OPS.has(op)   && typeof right !== 'number')  throw new MineRuntimeError('E_BAD_OPERAND', `A(z) "${op}" jobb operandusa egész kell legyen.`);
                if (COMPARE_OPS.has(op) && typeof right !== 'number')  throw new MineRuntimeError('E_BAD_OPERAND', `A(z) "${op}" jobb operandusa egész kell legyen.`);
                if (LOGIC_OPS.has(op)   && typeof right !== 'boolean') throw new MineRuntimeError('E_BAD_OPERAND', `A(z) "${op}" jobb operandusa logikai kell legyen.`);
                if (EQUALITY_OPS.has(op) && typeof left !== typeof right)
                    throw new MineRuntimeError('E_BAD_OPERAND', `A(z) "${op}" operandusai azonos típusúak kell legyenek.`);
                switch (op) {
                    case '+': return left + right;   case '-': return left - right;
                    case '*': return left * right;   case '<': return left < right;
                    case '<=': return left <= right; case '>': return left > right;
                    case '>=': return left >= right; case '=': return left === right;
                    case '<>': return left !== right;case 'and': return left && right;
                    case 'or': return left || right;
                }
            }
        }
    }
}

// 5. ui
const codeInput = document.getElementById("codeInput");
const startTheCodeButton = document.getElementById("startTheCodeButton");

// Egyszerű default pálya: [üres, üres, arany, üres, arany, üres, arany, üres, fal]
const DEFAULT_MAP   = [[0,0,2,0,2,0,2,0,1]];
const DEFAULT_START = { x:0, y:0, dir:1 };  // jobbra néz

const DEFAULT_PROGRAM = `set count to 0
set fal to isThere 1
set megy to not fal
while megy
    set arany to isThere 2
    if arany
        step forward 1
        mine here
        set count to count + 1
    else
        step forward 1
        set fal to isThere 1
        set megy to not fal
print count`;

if (codeInput && !codeInput.value) codeInput.value = DEFAULT_PROGRAM;

function showOutput(msg) {
    if (terminal) terminal.textContent += msg + "\n";
}

function clearOutput() { if (terminal) terminal.textContent = ""; }

function highlightLine(lineNum) {
    if (!codeInput || !lineNum) return;
    const lines = codeInput.value.split(/\r?\n/);
    if (lineNum < 1 || lineNum > lines.length) return;
    let start = 0;
    for (let i = 0; i < lineNum - 1; i++) start += lines[i].length + 1;
    codeInput.focus();
    codeInput.setSelectionRange(start, start + lines[lineNum - 1].length);
}

if (startTheCodeButton) {
    startTheCodeButton.addEventListener("click", async () => {
        clearOutput();
        if (!codeInput) return;
        const code = codeInput.value;

        // 1) Szintaktikai elemzés
        let program;
        try {
            program = parseProgram(code);
        } catch (e) {
            if (e instanceof MineSyntaxError) {
                showOutput(e.message);
                highlightLine(e.lineNum);
            } else showOutput("\nVáratlan hiba: " + e.message);
            return;
        }

        // 2) Robot létrehozása (a térkép másolva, hogy minden futás tiszta legyen)
        const mapCopy = DEFAULT_MAP.map(r => r.slice());
        const robot = new Robot(mapCopy, DEFAULT_START.x, DEFAULT_START.y, DEFAULT_START.dir);

        // 3) Végrehajtás
        const interp = new Interpreter(robot, v => showOutput(String(v)));
        try {
            await interp.run(program);
            showOutput(`\n--- Futás vége. Utasítások: ${interp.instructionCount} ---`);
        } catch (e) {
            if (e instanceof MineRuntimeError) showOutput("Futásidejű hiba: " + e.message);
            else showOutput("Váratlan hiba: " + e.message);
        }
    });
}