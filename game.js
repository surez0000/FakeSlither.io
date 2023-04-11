const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;

let snake = [
  { x: 100, y: 100 },
  { x: 90, y: 100 },
  { x: 80, y: 100 },
  { x: 70, y: 100 },
  { x: 60, y: 100 },
];

const speed = 5;
let dx = speed;
let dy = 0;

let foods = [];
let gameInterval;

function generateFood() {
  const x = Math.floor(Math.random() * (canvas.width / 20)) * 20;
  const y = Math.floor(Math.random() * (canvas.height / 20)) * 20;
  const size = Math.random() * 10 + 5;
  const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
  return { x, y, size, color };
}

function generateMultipleFoods(count) {
  for (let i = 0; i < count; i++) {
    foods.push(generateFood());
  }
}

generateMultipleFoods(25);

function eatFood() {
    for (let i = 0; i < foods.length; i++) {
      const food = foods[i];
      const distX = Math.abs(snake[0].x - food.x);
      const distY = Math.abs(snake[0].y - food.y);
  
      if (distX < food.size * 2 && distY < food.size * 2) {
        const growth = Math.ceil(food.size / 4);
        for (let j = 0; j < growth; j++) {
          snake.push({ x: food.x, y: food.y, color: snake[0].color });
        }
        score += 10;
        foods[i] = generateFood();
        break;
      }
    }
  }
  
  function updateSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy, color: snake[0].color };
    let previousSegment = { ...snake[0] };
  
    for (let i = 1; i < snake.length; i++) {
      const currentSegment = { ...snake[i] };
      snake[i] = { ...previousSegment };
      previousSegment = currentSegment;
    }
  
    snake[0] = head;
  }
  

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Draw the foods with a glowing effect
    ctx.shadowBlur = 15;
  
    for (const food of foods) {
      const distX = Math.abs(snake[0].x - food.x);
      const distY = Math.abs(snake[0].y - food.y);
  
      if (distX < food.size * 2 && distY < food.size * 2) {
        // The snake is near this food, so don't draw it
        continue;
      }
  
      ctx.shadowColor = food.color;
      ctx.fillStyle = food.color;
      ctx.beginPath();
      ctx.arc(food.x + food.size / 2, food.y + food.size / 2, food.size / 2, 0, 2 * Math.PI);
      ctx.fill();
    }
  
    // Draw the snake with a glowing effect
    ctx.shadowColor = "rgba(0, 255, 0, 0.5)";
    ctx.shadowBlur = 15;
  
    for (let i = 0; i < snake.length; i++) {
      let segment = snake[i];
      ctx.fillStyle = segment.color || "rgba(0, 255, 0, 0.5)";
      ctx.shadowColor = segment.shadowColor || "rgba(0, 255, 0, 0.5)";
      ctx.beginPath();
      ctx.arc(segment.x + 10, segment.y + 10, 10, 0, 2 * Math.PI);
      ctx.fill();
    }
  
    ctx.shadowColor =  "transparent";
    ctx.shadowBlur = 0;
  
    // Draw the score
    ctx.font = "24px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, canvas.width - 150, 30);
  }
  

function gameLoop() {
  updateSnake();
  eatFood();
  draw();
}

function startGame() {
  
  document.getElementById("startmenu").style.display = "none";
  gameInterval = setInterval(gameLoop, 1000 / 30);
}

function pauseGame() {
  clearInterval(gameInterval);
  gameInterval = null;
}

document.getElementById("startButton").addEventListener("click", () => {
 
    startGame();
  
});

document.addEventListener("mousemove", (event) => {
  const mouseX = event.clientX;
  const mouseY = event.clientY;
  const head = snake[0];

  const angle = Math.atan2(mouseY - (head.y + 10), mouseX - (head.x + 10));

  dx = Math.cos(angle) * speed;
  dy = Math.sin(angle) * speed;
});

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  const boost = 2;

  dx *= boost;
  dy *= boost;

  setTimeout(() => {
    dx /= boost;
    dy /= boost;
  }, 500);
});
let shadowColor
const colorOptions = document.querySelectorAll(".colorOption");
for (const colorOption of colorOptions) {
    colorOption.addEventListener("click", () => {
      const chosenColor = colorOption.id;
      document.querySelectorAll(".colorOption").forEach((el) => el.style.border = "none");
      colorOption.style.border = "3px solid white";
  
      if (chosenColor === "multicolor") {
        snake = snake.map((segment, i) => {
          const colors = ["red", "green", "blue", "yellow"];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          const randomShadow = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`;
          return { ...segment, color: randomColor, shadowColor: randomShadow };
        });
      } else {
        snake = snake.map((segment, index) => {
          if (index === 0) {
            return { ...segment, color: chosenColor, shadowColor: "rgba(0, 255, 0, 0.5)" };
          }
          return { ...segment, color: snake[0].color, shadowColor: "rgba(0, 255, 0, 0.5)" };
        });
      }
      let colors = ["rgba(255, 0, 0, 0.5)", "rgba(0, 255, 0, 0.5)", "rgba(0, 0, 255, 0.5)", "rgba(255, 255, 0, 0.5)"]
     shadowColor = colors[Math.floor(Math.random() * 4) + 1];
    });
  }
  
  // Set the default color to yellow
  document.getElementById("yellow").click();
  


  
