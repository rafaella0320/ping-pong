// Obtendo o elemento canvas e seu contexto 2D
const canvasEl = document.querySelector("canvas"),
  canvasCtx = canvasEl.getContext("2d"),
  gapX = 10 // Espaço entre a borda do campo e as raquetes

const mouse = { x: 0, y: 0 }

// Objeto representando o campo de jogo
const field = {
  w: window.innerWidth, // Largura do campo igual à largura da janela do navegador
  h: window.innerHeight, // Altura do campo igual à altura da janela do navegador
  draw: function () { // Método para desenhar o campo
    canvasCtx.fillStyle = "#191970"; // Cor azul escuro
    canvasCtx.fillRect(0, 0, this.w, this.h); // Desenha o retângulo do campo
  },
}

// Objeto representando a linha divisória no meio do campo
const line = {
  w: 15, // Largura da linha
  h: field.h, // Altura igual à altura do campo
  draw: function () { // Método para desenhar a linha
    canvasCtx.fillStyle = "#ffffff"; // Cor branca
    canvasCtx.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h); // Desenha a linha no centro do campo
  },
};

// Objeto representando a raquete esquerda do jogador humano
const leftPaddle = {
  x: gapX, // Posição x da raquete
  y: 0, // Posição y da raquete
  w: line.w, // Largura da raquete igual à largura da linha
  h: 200, // Altura da raquete
  _move: function () { // Método para mover a raquete com base na posição do mouse
    this.y = mouse.y - this.h / 2;
  },
  draw: function () { // Método para desenhar a raquete
    canvasCtx.fillStyle = "#9B111E"; // Cor vermelha
    canvasCtx.fillRect(this.x, this.y, this.w, this.h); // Desenha a raquete
    this._move(); // Move a raquete de acordo com a posição do mouse
  },
};

// Objeto representando a raquete direita controlada pelo computador
const rightPaddle = {
  x: field.w - line.w - gapX, // Posição x da raquete
  y: 0, // Posição y da raquete
  w: line.w, // Largura da raquete igual à largura da linha
  h: 200, // Altura da raquete
  speed: 5, // Velocidade de movimento da raquete
  _move: function () { // Método para mover a raquete automaticamente
    if (this.y + this.h / 2 < ball.y + ball.r) {
      this.y += this.speed; // Move para baixo se a bola estiver acima da raquete
    } else {
      this.y -= this.speed; // Move para cima se a bola estiver abaixo da raquete
    }
  },
  speedUp: function () { // Método para aumentar a velocidade da raquete direita
    this.speed += 2;
  },
  draw: function () { // Método para desenhar a raquete
    canvasCtx.fillStyle = "#9B111E"; // Cor vermelha
    canvasCtx.fillRect(this.x, this.y, this.w, this.h); // Desenha a raquete
    this._move(); // Move a raquete automaticamente
  },
};

// Objeto representando o placar do jogo
const score = {
  human: 0, // Pontuação do jogador humano
  computer: 0, // Pontuação do computador
  increaseHuman: function () { // Método para aumentar a pontuação do jogador humano
    this.human++;
  },
  increaseComputer: function () { // Método para aumentar a pontuação do computador
    this.computer++;
  },
  draw: function () { // Método para desenhar o placar
    canvasCtx.font = "bold 72px Arial"; // Estilo da fonte
    canvasCtx.textAlign = "center"; // Alinhamento central
    canvasCtx.textBaseline = "top"; // Alinhamento superior
    canvasCtx.fillStyle = "#ffffff"; // Cor branca
    // Desenha as pontuações na tela
    canvasCtx.fillText(this.human, field.w / 4, 50); // Pontuação do jogador humano
    canvasCtx.fillText(this.computer, field.w / 4 + field.w / 2, 50); // Pontuação do computador
  },
};

// Objeto representando a bola
const ball = {
  x: field.w / 2, // Posição inicial x da bola
  y: field.h / 2, // Posição inicial y da bola
  r: 20, // Raio da bola
  speed: 10, // Velocidade de movimento da bola
  directionX: 1, // Direção de movimento horizontal
  directionY: 1, // Direção de movimento vertical
  _calcPosition: function () { // Método para calcular a posição da bola
    // Verifica se a bola atingiu a raquete direita ou ultrapassou a borda direita do campo
    if (this.x > field.w - this.r - rightPaddle.w - gapX) {
      // Verifica se a bola está na altura da raquete direita
      if (
        this.y + this.r > rightPaddle.y &&
        this.y - this.r < rightPaddle.y + rightPaddle.h
      ) {
        this._reverseX(); // Inverte a direção horizontal da bola
      } else {
        score.increaseHuman(); // Incrementa a pontuação do jogador humano
        this._pointUp(); // Prepara para iniciar um novo ponto
      }
    }

    // Verifica se a bola atingiu a raquete esquerda ou ultrapassou a borda esquerda do campo
    if (this.x < this.r + leftPaddle.w + gapX) {
      // Verifica se a bola está na altura da raquete esquerda
      if (
        this.y + this.r > leftPaddle.y &&
        this.y - this.r < leftPaddle.y + leftPaddle.h
      ) {
        this._reverseX(); // Inverte a direção horizontal da bola
      } else {
        score.increaseComputer(); // Incrementa a pontuação do computador
        this._pointUp(); // Prepara para iniciar um novo ponto
      }
    }

    // Verifica se a bola atingiu as bordas superior ou inferior do campo
    if (
      (this.y - this.r < 0 && this.directionY < 0) ||
      (this.y > field.h - this.r && this.directionY > 0)
    ) {
      this._reverseY(); // Inverte a direção vertical da bola
    }
  },
  _reverseX: function () { // Método para inverter a direção horizontal da bola
    this.directionX *= -1;
  },
  _reverseY: function () { // Método para inverter a direção vertical da bola
    this.directionY *= -1;
  },
  _speedUp: function () { // Método para aumentar a velocidade da bola
    this.speed += 2;
  },
  _pointUp: function () { // Método para preparar para iniciar um novo ponto
    this._speedUp(); // Aumenta a velocidade da bola
    rightPaddle.speedUp(); // Aumenta a velocidade da raquete direita

    // Define a posição inicial da bola no centro do campo
    this.x = field.w / 2;
    this.y = field.h / 2;
  },
  _move: function () { // Método para mover a bola
    this.x += this.directionX * this.speed; // Move a bola na direção horizontal
    this.y += this.directionY * this.speed; // Move a bola na direção vertical
  },
  draw: function () { // Método para desenhar a bola
    canvasCtx.fillStyle = "#ffffff"; // Cor branca
    canvasCtx.beginPath(); // Inicia um novo caminho
    canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false); // Desenha um círculo (bola)
    canvasCtx.fill(); // Preenche o círculo com a cor definida

    this._calcPosition(); // Calcula a nova posição da bola
    this._move(); // Move a bola
  },
};

// Função para configurar o tamanho do canvas
function setup() {
  canvasEl.width = canvasCtx.width = field.w; // Define a largura do canvas
  canvasEl.height = canvasCtx.height = field.h; // Define a altura do canvas
}

// Função para desenhar os elementos do jogo
function draw() {
  field.draw(); // Desenha o campo
  line.draw(); // Desenha a linha no meio do campo

  leftPaddle.draw(); // Desenha a raquete esquerda
  rightPaddle.draw(); // Desenha a raquete direita

  score.draw(); // Desenha o placar

  ball.draw(); // Desenha a bola
}

window.animateFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      return window.setTimeout(callback, 1000 / 60)
    }
  )
})()

// Função principal que inicia o jogo
function main() {
  animateFrame(main); // Função para animar o jogo
  draw(); // Desenha os elementos do jogo
}

setup(); // Configura o tamanho do canvas
main(); // Inicia o jogo

// Evento de movimento do mouse para atualizar a posição do mouse
canvasEl.addEventListener("mousemove", function (e) {
  mouse.x = e.pageX; // Atualiza a posição x do mouse
  mouse.y = e.pageY; // Atualiza a posição y do mouse
});