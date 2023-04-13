import values from "./values.json" assert { type: "json" };

const dictionary = Deno.readTextFileSync("dictionary.txt").toUpperCase().split(
  "\n",
);
const board = Deno.readTextFileSync("board.txt").split("\n").map((b) =>
  b.split("")
);
const size = 5;

const words: string[] = [];
let best = "";
let best_score = 0;

// First number is x, second number is y. They are 0 indexed.
const double_word = (4 * size) + 0;
const triple_word = (-1 * size) + -1;
const doubler = (2 * size) + 1;

function find_best(possible: string[], used: number[]) {
  if (possible.length == 0) return;

  const prefix: string = used.map((pos) =>
    board[pos % size][Math.floor(pos / size)]
  ).reduce((a, b) => a + b, "");
  const cur_pos = used[used.length - 1];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx == -1 && cur_pos % 5 == 0) continue;
      if (dx == 1 && cur_pos % 5 == 4) continue;
      const this_pos = cur_pos + dx + (size * dy);
      if (this_pos < 0 || this_pos >= 25) continue;
      if (!used.includes(this_pos)) {
        const this_prefix = prefix +
          board[this_pos % size][Math.floor(this_pos / size)];
        find_best(possible.filter((word) => word.startsWith(this_prefix)), [
          ...used,
          this_pos,
        ]);

        if (dictionary.includes(this_prefix)) {
          words.push(this_prefix);

          let double = false;
          let this_score = 0;

          for (const position of [...used, this_pos]) {
            const letter = board[position % size][Math.floor(position / size)];
            if (position == double_word) {
              this_score += (values as Record<string, number>)[letter] * 2;
            } else if (position == triple_word) {
              this_score += (values as Record<string, number>)[letter] * 3;
            } else {
              this_score += (values as Record<string, number>)[letter];
            }

            if (position == doubler) {
              double = true;
            }
          }

          if (double) {
            this_score *= 2;
          }

          // if(this_prefix === "WIENIE") {
          //   const map = "#####\n#####\n#####\n#####\n#####".split("\n").map((k)=>k.split(""));
          //   [...used, this_pos].forEach((pos, i) => {
          //     console.log(pos)
          //     map[pos%size][Math.floor(pos/size)] = i.toString()
          //   });
          //   console.log(map)
          // }

          if (this_score > best_score) {
            best = this_prefix;
            best_score = this_score;
          }
        }
      }
    }
  }
}

for (let pos = 0; pos < size * size; pos++) {
  const letter = board[pos % size][Math.floor(pos / size)];
  find_best(dictionary.filter((word) => word.startsWith(letter)), [pos]);
}

console.log("Total Words:", words.length);
console.log("Best Word:", best);
console.log("Best Score:", best_score);
// console.log("Words:", words)
