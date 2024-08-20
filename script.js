const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

var mouseX = 0,
  mouseY = 0,
  circles = [],
  centerX,
  centerY,
  startX,
  startY,
  offsetX,
  offsetY,
  oldOffsetX,
  oldOffsetY,
  scale,
  i,
  j,
  x,
  y,
  clicked,
  RADIUS = 80,
  PADDINGX = 1,
  PADDINGY = 1,
  SCALE_FACTOR = 400;

// Sample data coming from the backend
const data = {
  projects: [
    {
      id: "proj1",
      name: "Project 1",
      icon: "./icon.png",
      tags: ["Engineering", "AI"],
    },
    {
      id: "proj2",
      name: "Project 2",
      icon: "https://via.placeholder.com/64/336699/FFFFFF/?text=Project1",
      tags: ["Engineering", "AI"],
    },
    {
      id: "proj1",
      name: "Project 1",
      icon: "https://via.placeholder.com/64/336699/FFFFFF/?text=P1",
      tags: ["Engineering", "AI"],
    },
    {
      id: "proj2",
      name: "Project 2",
      icon: "https://via.placeholder.com/64/234765/FFFFFF/?text=P2",
      tags: ["Engineering", "AI"],
    },
    {
      id: "proj1",
      name: "Project 1",
      icon: "https://via.placeholder.com/64/FF6045/FFFFFF/?text=P1",
      tags: ["Engineering", "AI"],
    },
    {
      id: "proj2",
      name: "Project 2",
      icon: "https://via.placeholder.com/64/FFF486/FFFFFF/?text=P2",
      tags: ["Engineering", "AI"],
    },
    {
      id: "proj1",
      name: "Project 1",
      icon: "https://via.placeholder.com/64/336699/FFFFFF/?text=P1",
      tags: ["Engineering", "AI"],
    },
    {
      id: "proj2",
      name: "Project 2",
      icon: "https://via.placeholder.com/64/92D43E/FFFFFF/?text=P2",
      tags: ["Engineering", "AI"],
    },
  ],
};

// Set canvas to full size of the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const TOTAL_CIRCLES = data.projects.length;

const HORIZONTAL = Math.ceil(Math.sqrt(TOTAL_CIRCLES));
const VERTICAL = Math.ceil(TOTAL_CIRCLES / HORIZONTAL);

offsetX =
  (canvas.width -
    (RADIUS * 2 * HORIZONTAL +
      PADDINGX * (HORIZONTAL - 1) +
      RADIUS +
      PADDINGX / 2)) /
    2 +
  RADIUS;
offsetY =
  (canvas.height - (RADIUS * 2 * VERTICAL + PADDINGY * (VERTICAL - 1))) / 2 +
  RADIUS;

centerX = canvas.width / 2;
centerY = canvas.height / 2;

x = 0;
y = 0;

// Populate the circles array with project data
for (i = 0; i < VERTICAL; i++) {
  for (j = 0; j < HORIZONTAL; j++) {
    if (circles.length >= TOTAL_CIRCLES) break;

    const project = data.projects[circles.length];

    const img = new Image();
    img.src = project.icon;

    circles.push({
      x: x,
      y: y,
      icon: img,
      id: project.id,
      name: project.name,
    });
    x += RADIUS * 2 + PADDINGX;
  }

  if (i % 2 == 0) {
    x = PADDINGX / 2 + RADIUS;
  } else {
    x = 0;
  }

  y += RADIUS * 2 + PADDINGY;
}

// Create an array to hold the stars
const stars = [];
const TOTAL_STARS = 100; // Adjust this number to change how many stars are rendered

// Function to generate a random number within a range
function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

// Function to generate random star colors
function getRandomColor() {
  const colors = ['#FF6045', '#FF8852', '#FFF486', '#92D43E', '#00BEF0', '#EA526F', '#FFF', '#018DE3'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Initialize stars
for (let i = 0; i < TOTAL_STARS; i++) {
  stars.push({
    x: getRandom(0, canvas.width),
    y: getRandom(0, canvas.height),
    radius: getRandom(1, 2),
    color: getRandomColor(),
    speed: getRandom(0.3, 2),
  });
}

// Function to draw and animate stars
function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = star.color;
    ctx.fill();

    // Move the star downwards for a twinkling effect
    star.y += star.speed;

    // If the star moves off the bottom of the screen, reset it to the top
    if (star.y > canvas.height) {
      star.x = getRandom(0, canvas.width);
      star.y = -star.radius;
    }
  });
}

// Draw function for stars and circles (combined)
function draw() {
  // Draw stars first as the background
  drawStars();

  // Draw circles and other elements on top of the stars
  ctx.save();
  ctx.translate(offsetX, offsetY);

  let allOutOfView = true;

  for (i = 0; i < circles.length; i++) {
    ctx.save();
    scale = getDistance(circles[i]);

    if (scale > 0) allOutOfView = false;

    ctx.translate(circles[i].x, circles[i].y);
    ctx.translate(RADIUS / 2, RADIUS / 2);
    ctx.scale(scale, scale);
    ctx.translate(-RADIUS / 2, -RADIUS / 2);

    // Draw the circular project icon only if it's fully loaded
    const img = circles[i].icon;
    if (img.complete) {
      ctx.save();
      // Clip the context to a circular path
      ctx.beginPath();
      ctx.arc(0, 0, RADIUS, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // Draw the image, filling the circle
      ctx.drawImage(img, -RADIUS, -RADIUS, RADIUS * 2, RADIUS * 2);
      ctx.restore();
    }

    // Draw the project name if the scale is close to 1
    if (scale > 0.8) {
      ctx.font = "20px monospace";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.fillText(circles[i].name, RADIUS / 8, RADIUS + 25); // Positioning the text below the circle
    }

    ctx.restore();
  }

  ctx.restore();

  if (allOutOfView) drawPointer();

  requestAnimationFrame(draw); // Continue the animation loop
}

// Handle resizing to keep stars consistent
window.addEventListener("resize", () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  centerX = canvas.width / 2;
  centerY = canvas.height / 2;
  stars.forEach(star => {
    star.x = getRandom(0, canvas.width);
    star.y = getRandom(0, canvas.height);
  });
});

draw(); // Start the animation loop



function getDistance(circle) {
  var dx, dy, dist;
  dx = circle.x - centerX + offsetX;
  dy = circle.y - centerY + offsetY;
  dist = Math.sqrt(dx * dx + dy * dy);
  scale = 1 - dist / SCALE_FACTOR;
  scale = scale > 0 ? scale : 0;

  return scale;
}

function drawPointer() {
  const avgX = circles.reduce((sum, circle) => sum + (circle.x + offsetX), 0) / circles.length;
  const avgY = circles.reduce((sum, circle) => sum + (circle.y + offsetY), 0) / circles.length;

  const angle = Math.atan2(avgY - centerY, avgX - centerX);

  const pointerLength = 50;

  const pointerX = centerX + Math.cos(angle) * (canvas.width / 2 - RADIUS);
  const pointerY = centerY + Math.sin(angle) * (canvas.height / 2 - RADIUS);

  ctx.save();
  ctx.translate(pointerX, pointerY);
  ctx.rotate(angle);

  ctx.fillStyle = "#FFF";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-pointerLength / 2, -pointerLength / 2);
  ctx.lineTo(-pointerLength / 2, pointerLength / 2);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

// Handle touch and mouse events (unchanged)
window.addEventListener("touchstart", handleTouch);

function handleTouch(e) {
  window.addEventListener("touchmove", handleSwipe);
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  oldOffsetX = offsetX;
  oldOffsetY = offsetY;
}

function handleSwipe(e) {
  mouseX = e.changedTouches[0].clientX;
  mouseY = e.changedTouches[0].clientY;
  offsetX = oldOffsetX + mouseX - startX;
  offsetY = oldOffsetY + mouseY - startY;
}

window.addEventListener("touchend", () => {
  window.removeEventListener("touchmove", handleSwipe);
});

window.addEventListener("mousedown", handleClick);

function handleClick(e) {
  window.addEventListener("mousemove", handleMouse);
  window.addEventListener("mouseup", handleRelease);
  startX = e.clientX;
  startY = e.clientY;
  oldOffsetX = offsetX;
  oldOffsetY = offsetY;
  canvas.style.cursor = "grabbing";

  // Handle clicking on a circle
  const clickedCircle = circles.find(
    (circle) =>
      Math.sqrt(
        Math.pow(e.clientX - offsetX - circle.x - RADIUS / 2, 2) +
          Math.pow(e.clientY - offsetY - circle.y - RADIUS / 2, 2)
      ) < RADIUS
  );

  if (clickedCircle) {
    window.location.href = "./details.html"; // Navigate to details page
  }
}

function handleMouse(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  offsetX = oldOffsetX + mouseX - startX;
  offsetY = oldOffsetY + mouseY - startY;
}

function handleRelease() {
  window.removeEventListener("mouseup", handleRelease);
  window.removeEventListener("mousemove", handleMouse);
  canvas.style.cursor = "grab";
}

window.addEventListener("resize", () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  centerX = canvas.width / 2;
  centerY = canvas.height / 2;
});

draw();