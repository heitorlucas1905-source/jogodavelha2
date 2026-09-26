(function () {
  const SIZE = 4;
  const PLAYERS = [
    { id: 'X', name: 'Jogador 1', color: 'var(--p1)' },
    { id: 'O', name: 'Jogador 2', color: 'var(--p2)' },
    { id: 'T', name: 'Jogador 3', color: 'var(--p3)' }
  ];

  const boardEl = document.getElementById('board');
  const statusEl = document.getElementById('status');
  const scorebarEl = document.getElementById('scorebar');
  const resetBtn = document.getElementById('resetBtn');

  let cells = Array(SIZE * SIZE).fill(null);
  let turn = 0;
  let gameOver = false;
  let scores = { X: 0, O: 0, T: 0 };

  function markSVG(id, color) {
    if (id === 'X') {
      return `<svg viewBox="0 0 100 100"><line x1="20" y1="20" x2="80" y2="80" stroke="${color}" stroke-width="14" stroke-linecap="round"/><line x1="80" y1="20" x2="20" y2="80" stroke="${color}" stroke-width="14" stroke-linecap="round"/></svg>`;
    }
    if (id === 'O') {
      return `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="34" fill="none" stroke="${color}" stroke-width="14"/></svg>`;
    }
    return `<svg viewBox="0 0 100 100"><polygon points="50,16 86,82 14,82" fill="none" stroke="${color}" stroke-width="14" stroke-linejoin="round"/></svg>`;
  }

  function playerColor(id) {
    return PLAYERS.find(p => p.id === id).color;
  }

  function lines() {
    const L = [];
    for (let r = 0; r < SIZE; r++) {
      L.push([0,1,2,3].map(c => r * SIZE + c));
    }
    for (let c = 0; c < SIZE; c++) {
      L.push([0,1,2,3].map(r => r * SIZE + c));
    }
    L.push([0,5,10,15]);
    L.push([3,6,9,12]);
    return L;
  }
  const ALL_LINES = lines();

  function checkWin() {
    for (const line of ALL_LINES) {
      const [a,b,c,d] = line;
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c] && cells[a] === cells[d]) {
        return { winner: cells[a], line };
      }
    }
    return null;
  }

  function render() {
    boardEl.innerHTML = '';
    for (let i = 0; i < cells.length; i++) {
      const btn = document.createElement('button');
      btn.className = 'cell';
      btn.disabled = !!cells[i] || gameOver;
      btn.setAttribute('aria-label', 'Casa ' + (i + 1));
      if (cells[i]) {
        btn.innerHTML = markSVG(cells[i], playerColor(cells[i]));
      }
      btn.addEventListener('click', () => handleMove(i));
      boardEl.appendChild(btn);
    }
    renderStatus();
    renderScore();
  }

  function renderStatus() {
    if (gameOver) {
      const result = checkWin();
      if (result) {
        const p = PLAYERS.find(pl => pl.id === result.winner);
        statusEl.innerHTML = `<span class="mark">${markSVG(p.id, p.color)}</span> ${p.name} venceu!`;
      } else {
        statusEl.textContent = 'Empate — tabuleiro completo!';
      }
      return;
    }
    const p = PLAYERS[turn];
    statusEl.innerHTML = `Vez de: <span class="mark">${markSVG(p.id, p.color)}</span> ${p.name}`;
  }

  function renderScore() {
    scorebarEl.innerHTML = PLAYERS.map(p => `
      <div class="score">
        <span class="mark">${markSVG(p.id, p.color)}</span>
        <b>${scores[p.id]}</b>
      </div>
    `).join('');
  }

  function handleMove(i) {
    if (gameOver || cells[i]) return;
    cells[i] = PLAYERS[turn].id;
    const result = checkWin();
    if (result) {
      gameOver = true;
      scores[result.winner]++;
      render();
      highlightWin(result.line);
      return;
    }
    if (cells.every(c => c)) {
      gameOver = true;
      render();
      return;
    }
    turn = (turn + 1) % PLAYERS.length;
    render();
  }

  function highlightWin(line) {
    const btns = boardEl.querySelectorAll('.cell');
    line.forEach(idx => btns[idx].classList.add('win'));
  }

  function resetGame() {
    cells = Array(SIZE * SIZE).fill(null);
    turn = 0;
    gameOver = false;
    render();
  }

  resetBtn.addEventListener('click', resetGame);

  // Fill legend marks
  document.querySelectorAll('.legend-item .mark').forEach((el, idx) => {
    const p = PLAYERS[idx];
    el.innerHTML = markSVG(p.id, p.color);
  });

  render();
})();
