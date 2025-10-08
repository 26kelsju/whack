/*
 * Whack-a-Mole Game Logic
 */
function runGame() {
  // --- Game Variables ---
  let score = 0;
  const holes = document.querySelectorAll('.hole');
  const scoreText = document.querySelector('#scoreText');
  let activeMole = null; // To keep track of the current mole
  const gameSpeed = 1000; // How often a new mole appears (in milliseconds)

  console.log("A-Frame scene loaded. Starting the game! 🔨");

  // --- Game Functions ---

  function updateScore() {
    scoreText.setAttribute('value', `Score: ${score}`);
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
    
    // 1. Pick a random hole
    const randomIndex = Math.floor(Math.random() * holes.length);
    const randomHole = holes[randomIndex];

    // Check if we found a hole, if not, something is wrong.
    if (!randomHole) {
        console.error("Could not find a random hole. Check your .hole class in HTML.");
        return;
    }

    // 2. Decide mole shape and color
    const isBox = Math.random() > 0.5;
    const moleShape = isBox ? 'a-box' : 'a-sphere';
    const moleColor = isBox ? '#FFC107' : '#E91E63';

    // 3. Create the mole entity
    const mole = document.createElement(moleShape);
    
    // 4. Set its properties
    mole.setAttribute('class', 'mole');
    mole.setAttribute('color', moleColor);
    
    const holePosition = randomHole.getAttribute('position');
    
    mole.setAttribute('position', {
      x: holePosition.x,
      y: holePosition.y + 0.1, // Start below ground
      z: holePosition.z
    });

    if (isBox) {
      mole.setAttribute('scale', '0.5 0.5 0.5');
    } else { // It's a sphere
      mole.setAttribute('radius', '0.3');
    }

    // 5. Add an animation to make it pop up
    const targetPosition = `${holePosition.x} ${holePosition.y + 0.5} ${holePosition.z}`;

    mole.setAttribute('animation', {
      property: 'position',
      to: targetPosition,
      dur: 300,
      easing: 'easeOutQuad'
    });
    
    // 6. Add event listener for when it's clicked/gazed at
    mole.addEventListener('click', () => {
      hideMole(true);
    });

    // 7. Add the mole to the scene and track it
    const sceneEl = document.querySelector('a-scene');
    sceneEl.appendChild(mole);
    activeMole = mole;
  }

  // --- Start the Game ---
  updateScore();
  setInterval(showMole, gameSpeed);
}

// --- Wait for the A-Frame scene to load before starting the game ---
const scene = document.querySelector('a-scene');
if (scene.hasLoaded) {
  runGame();
} else {
  scene.addEventListener('loaded', runGame);
}
