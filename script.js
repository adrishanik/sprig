/*
@title: Circuit Rescue
@author: Adrish Manna
@tags: [puzzle, retro, maze]
@description: Collect all 3 energy cells and reach the terminal without stepping on overloaded sparks!
*/

const player = "p";
const battery = "b";
const wall = "w";
const spark = "s";
const goal = "g";

// Define 16x16 pixel sprites
setLegend(
  [player, bitmap`
................
...000000000....
..07777777770...
.0777000007770..
.0770777770770..
.0770777770770..
.0770000000770..
.0777777777770..
..00000000000...
....0777770.....
...077000770....
..0770...0770...
..0770...0770...
...00.....00....
................
................`],
  [battery, bitmap`
................
......3333......
.....300003.....
.....303303.....
.....303303.....
.....303303.....
.....300003.....
.....303303.....
.....303303.....
.....303303.....
.....300003.....
.....333333.....
................
................
................
................`],
  [spark, bitmap`
................
.......2........
......222.......
.....22222......
....2222222.....
.....2222.......
....222222......
...22222222.....
....222222......
.....2222.......
......22........
.......2........
................
................
................
................`],
  [goal, bitmap`
................
.CCCCCCCCCCCCCC.
.C555555555555C.
.C5C55555555C5C.
.C55C555555C55C.
.C555C5555C555C.
.C5555CCCC5555C.
.C5555CCCC5555C.
.C555C5555C555C.
.C55C555555C55C.
.C5C55555555C5C.
.C555555555555C.
.CCCCCCCCCCCCCC.
................
................
................`],
  [wall, bitmap`
................
.88888888888888.
.80000000000008.
.80888888888808.
.80800000000808.
.80808888880808.
.80808888880808.
.80808888880808.
.80808888880808.
.80808888880808.
.80800000000808.
.80888888888808.
.80000000000008.
.88888888888888.
................
................`]
);

// Level map layout
const levels = [
  map`
wwwwwwwwwwwwwwww
w.......b......w
w.wwwwww.wwwww.w
w.w....w.w...w.w
w.w.s..w.w.b.w.w
w.w....w.w...w.w
w.wwww.w.wwwww.w
w......w.......w
w.wwwwwwwwwwww.w
w.w...s......w.w
w.w.wwwwwwww.w.w
w.w.w......w.w.w
w.w.w.b..s.w.w.w
w.p.w......w.g.w
wwwwwwwwwwwwwwww`
];

let currentLevel = 0;
let score = 0;
let totalBatteries = 3;

setSolids([player, wall]);

function initLevel() {
  setMap(levels[currentLevel]);
  score = 0;
  clearText();
  addText(`Cells: 0/${totalBatteries}`, { y: 1, color: [7, 7, 0] });
}

initLevel();

// Player movement and collision logic
function movePlayer(dx, dy) {
  const p = getFirst(player);
  if (!p) return;

  const targetX = p.x + dx;
  const targetY = p.y + dy;

  // Check collision with obstacles & collectables
  const targetTiles = getTile(targetX, targetY);

  for (const t of targetTiles) {
    if (t.type === wall) return;

    if (t.type === spark) {
      playTune(tune`150: d4-500`);
      clearText();
      addText("Short Circuit! Resetting...", { y: 8, color: [3, 0, 0] });
      setTimeout(() => initLevel(), 1000);
      return;
    }

    if (t.type === battery) {
      t.remove();
      score++;
      playTune(tune`300: c5-100 e5-100 g5-150`);
      clearText();
      addText(`Cells: ${score}/${totalBatteries}`, { y: 1, color: [7, 7, 0] });
    }

    if (t.type === goal) {
      if (score >= totalBatteries) {
        playTune(tune`400: c5-100 e5-100 g5-100 c6-300`);
        clearText();
        addText("Circuit Repaired! You Win!", { y: 8, color: [0, 5, 0] });
        return;
      } else {
        clearText();
        addText("Collect all cells first!", { y: 1, color: [3, 0, 0] });
      }
    }
  }

  p.x = targetX;
  p.y = targetY;
}

// Input bindings
onInput("w", () => movePlayer(0, -1));
onInput("s", () => movePlayer(0, 1));
onInput("a", () => movePlayer(-1, 0));
onInput("d", () => movePlayer(1, 0));

onInput("i", () => movePlayer(0, -1));
onInput("k", () => movePlayer(0, 1));
onInput("j", () => movePlayer(-1, 0));
onInput("l", () => movePlayer(1, 0));
