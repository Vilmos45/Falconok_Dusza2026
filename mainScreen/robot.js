import { map, robot, generateTable, mapX, mapY} from "./ui.js";
export { forwardRobot, turnRobot, mineRobot, isThere };

//    2
// 3     1
//    0
const directions =  [[1, 0],[0, 1],[-1, 0], [0, -1]];
function forwardRobot(cnt = 1) {
    console.log(".")
    const [dy, dx] = directions[robot.dir];

    const nx = robot.x + dx * cnt;
    const ny = robot.y + dy * cnt;

    //if (ny < 0 || ny >= map.length || nx < 0 || nx >= map[ny].length || map[ny][nx] !== ".") return false;

    map[robot.y][robot.x] = ".";
    map[ny][nx] = [">", "^", "<", "v"][robot.dir];

    robot.x = nx;
    robot.y = ny;
    console.log("robot at:" + nx + ", " + ny);
    generateTable(mapX, mapY, map);
    return true;
}

function turnRobot(cnt) {
    robot.dir = (robot.dir + cnt % 4) % 4;
    map[robot.y][robot.x] = [">", "^", "<", "v"][robot.dir];
    generateTable(mapX, mapY, map);
}

function identify(y, x) {
    const cell = map[y]?.[x];

    switch (cell) {
        case ".": return "empty";
        case "#": return "bedrock";
        case "@": return "gold";
        default: return "unidentified matter";
    }
}

function mineRobot() {
    const [dy, dx] = directions[robot.dir];

    const y = robot.y + dy;
    const x = robot.x + dx;
    const target = identify(y, x);

    if (target === "bedrock" || target === "unidentified matter") {
        console.warn("Ezt nem teheted!");
        return false;
    }

    map[y][x] = ".";
    generateTable(mapX, mapY, map);
    return target === "gold";
}

function isThere() {
    const [dy, dx] = directions[robot.dir];

    return identify(robot.y + dy, robot.x + dx);
}   

console.log("robot.js loaded");