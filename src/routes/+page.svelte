<script>
  import debounce from "lodash/debounce"
  import { getWord } from "../solver"

  let board = [
    ["A","B","C","D","E"],
    ["F","G","H","I","J"],
    ["K","L","M","N","O"],
    ["P","Q","R","S","T"],
    ["U","V","W","X","Y"],
  ]
  let double_letter_pos = [-1, -1];
  let triple_letter_pos = [-1, -1];
  let doubler_pos = [-1, -1];
  let word = ""
  let score = 0

  $: {
    // @ts-ignore
    const scoring = getWord(board, double_letter_pos, triple_letter_pos, doubler_pos)
    word = scoring.best_word
    score = scoring.best_score
  }

  /**
   * @param x {number}
   * @param y {number}
   * @param value {string}
   */
  function setBoard(x, y, value) {
    board[x][y] = value;
  }
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true">
<link href="https://fonts.googleapis.com/css2?family=Baloo+Bhai+2&display=swap" rel="stylesheet">

<div style="width: 100vw; height: 100vh; display: flex; flex-direction:column; justify-content: center; align-items: center; color: white; font-family: 'Baloo Bhai 2', sans-serif;">
  <h1 style="font-size: 3em; margin: 0 0 -20px 0;">Discord's Spell<span style="color: #34d2eb">Cast</span> Solver</h1>
  <h2>The best word is: {word} (~{score} points)</h2>
  <div style="display:grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; grid-template-rows: 1fr 1fr 1fr 1fr 1fr; gap:4px; width: max-content; height: max-content; background: black;">
    {#each board as row, x}
      {#each row as cell, y}
        <div style="position: relative;">
          <button style="position: absolute; width: 32px; aspect-ratio : 1 / 1; border-radius: 20px; background: black; color: white; border: 2px solid #c9661a;" on:click={()=>{
            if(double_letter_pos[0] === x && double_letter_pos[1] === y) {
              double_letter_pos = [-1, -1]
              triple_letter_pos = [x, y]
            } else if(triple_letter_pos[0] === x && triple_letter_pos[1] === y) {
              double_letter_pos = [-1, -1]
              triple_letter_pos = [-1, -1]
            } else {
              double_letter_pos = [x, y]
              triple_letter_pos = [-1, -1]
            }
          }}>
            {#if double_letter_pos[0] === x && double_letter_pos[1] === y}
              DL
            {:else if triple_letter_pos[0] === x && triple_letter_pos[1] === y}
              TL
            {:else}
              SL
            {/if}
          </button>
          <button style="position: absolute; right: 0px; width: 32px; aspect-ratio : 1 / 1; border-radius: 20px; background: black; color: white; border: 2px solid #c9661a;" on:click={()=>{
            if(doubler_pos[0] === x && doubler_pos[1] === y) {
              doubler_pos = [-1, -1]
            } else {
              doubler_pos = [x, y]
            }
          }}>
            {#if doubler_pos[0] === x && doubler_pos[1] === y}
              2X
            {:else}
              1X
            {/if}
          </button>
          
          <input style="border: 4px solid #ffddc8; padding: 4px; max-width: 80px; aspect-ratio : 1 / 1; text-align: center; border-radius: 10px; font-size: 2em;" value={cell} on:input={(e)=>{
            // @ts-ignore
            e.target.value = e.data.toUpperCase();
            // @ts-ignore
            setBoard(x,y, e.data.toUpperCase())
            e.preventDefault()
          }}>
        </div>
        {/each}
    {/each}
  </div>
</div>