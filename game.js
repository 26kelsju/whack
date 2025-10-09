/*
 * Whack-a-Mole Game Logic
 */
function runGame() {
  // --- Game Variables ---
  let score = 0;
  let timeLeft = 60; // Timer starts at 60 seconds
  const holes = document.querySelectorAll('.hole');
  const scoreText = document.querySelector('#scoreText');
  const timerText = document.querySelector('#timerText'); // Get the timer element
  let activeMole = null;
  const gameSpeed = 1000;
  let moleInterval = null; // To store the mole generation interval
  let timerInterval = null; // To store the timer interval

  console.log("A-Frame scene loaded. Starting the game! 🔨");

  // --- Game Functions ---

  function updateScore() {
    scoreText.setAttribute('value', `Score: ${score}`);
  }

  function updateTimer() {
    timerText.setAttribute('value', `Time: ${timeLeft}`);
  }

  function hideMole(wasHit) {
    if (!activeMole) return;

    if (wasHit) {
      score++;
      updateScore();
    }
    
    activeMole.parentNode.removeChild(activeMole);
    activeMole = null;
  }
  
  function showMole() {
    if (activeMole) {
      hideMole(false);
    }
    
    const randomIndex = Math.floor(Math.random() * holes.length);
    const randomHole = holes[randomIndex];

    if (!randomHole) {
        console.error("Could not find a random hole. Check your .hole class in HTML.");
        return;
    }

    const isBox = Math.random() > 0.5;
    const moleShape = isBox ? 'a-box' : 'a-sphere';
    const moleColor = isBox ? '#FFC107' : '#E91E63';
    const mole = document.createElement(moleShape);
    
    mole.setAttribute('class', 'mole');
    mole.setAttribute('color', moleColor);
    
    const holePosition = randomHole.getAttribute('position');
    mole.setAttribute('position', {
      x: holePosition.x,
      y: holePosition.y + 0.1,
      z: holePosition.z
    });

    if (isBox) {
      mole.setAttribute('scale', '0.5 0.5 0.5');
    } else {
      mole.setAttribute('radius', '0.3');
    }

    const targetPosition = `${holePosition.x} ${holePosition.y + 0.5} ${holePosition.z}`;
    mole.setAttribute('animation', {
      property: 'position',
      to: targetPosition,
      dur: 300,
      easing: 'easeOutQuad'
    });
    
    mole.addEventListener('click', () => {
      // Only allow hits if the game is still running
      if (timeLeft > 0) {
        hideMole(true);
      }
    });

    const sceneEl = document.querySelector('a-scene');
    sceneEl.appendChild(mole);
    activeMole = mole;
  }

  // --- Start the Game ---
  updateScore();
  updateTimer();

  // Start the mole popping interval
  moleInterval = setInterval(showMole, gameSpeed);

  // Start the countdown timer interval
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();

    // Check if the game is over
    if (timeLeft <= 0) {
      clearInterval(moleInterval); // Stop moles from appearing
      clearInterval(timerInterval); // Stop the timer
      timerText.setAttribute('value', 'Game Over!');

      // Hide the last mole
      if (activeMole) {
        hideMole(false);
      }
    }
  }, 1000); // This function runs every 1000ms (1 second)
}

// --- Wait for the A-Frame scene to load before starting the game ---
const scene = document.querySelector('a-scene');
if (scene.hasLoaded) {
  runGame();
} else {
  scene.addEventListener('loaded', runGame);
}
