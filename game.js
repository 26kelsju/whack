window.onload = () => {
  // --- Global Variables ---
  let score = 0;
  const holes = document.querySelectorAll('.hole');
  const scoreText = document.querySelector('#scoreText');
  let activeMole = null; // To keep track of the current mole
  const gameSpeed = 1000; // How often a new mole appears (in milliseconds)

  // --- Game Functions ---

  /**
   * Updates the score display in the VR scene.
   */
  function updateScore() {
    scoreText.setAttribute('value', `Score: ${score}`);
  }

  /**
   * Makes the current mole disappear and prepares for the next one.
   * @param {boolean} wasHit - True if the mole was hit by the player.
   */
  function hideMole(wasHit) {
    if (!activeMole) return; // No active mole to hide

    if (wasHit) {
      score++;
      updateScore();
    }
    
    // Remove the mole from the scene
    activeMole.parentNode.removeChild(activeMole);
    activeMole = null;
  }
  
  /**
   * Creates and displays a new mole at a random hole.
   */
  function showMole() {
    // If a mole is already active, hide it (as if it was a miss)
    if (activeMole) {
      hideMole(false);
    }
    
    // 1. Pick a random hole
    const randomIndex = Math.floor(Math.random() * holes.length);
    const randomHole = holes[randomIndex];

    // 2. Decide if it's a box or a sphere
    const isBox = Math.random() > 0.5;
    const moleShape = isBox ? 'a-box' : 'a-sphere';
    const moleColor = isBox ? '#FFC107' : '#E91E63';

    // 3. Create the mole entity
    const mole = document.createElement(moleShape);
    
    // 4. Set its properties
    mole.setAttribute('class', 'mole'); // IMPORTANT for the cursor to detect it
    mole.setAttribute('color', moleColor);
    
    // Position it slightly below the hole to start
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
    mole.setAttribute('animation', {
      property: 'position',
      to: {
        x: holePosition.x,
        y: holePosition.y + 0.5, // Pop up above ground
        z: holePosition.z
      },
      dur: 300, // Duration of pop-up animation
      easing: 'easeOutQuad'
    });
    
    // 6. Add event listener for when it's clicked/gazed at
    mole.addEventListener('click', () => {
      hideMole(true);
    });

    // 7. Add the mole to the scene and track it
    const scene = document.querySelector('a-scene');
    scene.appendChild(mole);
    activeMole = mole;
  }

  // --- Game Start ---
  console.log("Whack-a-Mole Game Loaded! 🔨");
  updateScore();
  
  // The main game loop: show a new mole at a regular interval
  setInterval(showMole, gameSpeed);
};
