// This registers a new component called 'game-logic'.
AFRAME.registerComponent('game-logic', {
  /**
   * The init function is called once when the component is first attached.
   */
  init: function () {
    console.log("Game logic initialized!");
    // 'this.el' refers to the entity the component is attached to, which is <a-scene>
    this.sceneEl = this.el;

    // Get all the elements with the class 'hole'. These are our mole positions.
    this.holes = document.querySelectorAll('.hole');

    // Get the score text entity
    this.scoreText = document.querySelector('#scoreText');

    // Initialize score
    this.score = 0;

    // Start the game loop. Call the spawnMole function every 1 second (1000ms).
    // We save the interval ID so we could clear it later if we wanted to end the game.
    this.gameLoop = setInterval(this.spawnMole.bind(this), 1000);
  },

  /**
   * This function makes a mole appear in a random hole.
   */
  spawnMole: function () {
    // Pick a random hole from the list of holes.
    const randomIndex = Math.floor(Math.random() * this.holes.length);
    const selectedHole = this.holes[randomIndex];

    // Check if there is already a mole in this hole. If so, don't spawn another one.
    if (selectedHole.querySelector('.mole')) {
      return;
    }

    // Create a new entity for our mole
    const mole = document.createElement('a-entity');

    // Randomly choose between a box and a sphere
    if (Math.random() > 0.5) {
      mole.setAttribute('geometry', { primitive: 'box', height: 0.5, width: 0.5, depth: 0.5 });
    } else {
      mole.setAttribute('geometry', { primitive: 'sphere', radius: 0.25 });
    }

    // Give it the 'mole' class so our cursor can interact with it
    mole.classList.add('mole');

    // Set its position to the selected hole's position
    mole.setAttribute('position', selectedHole.getAttribute('position'));

    // Set a random color
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    mole.setAttribute('material', { color: randomColor });

    // Add an animation to make it pop up from the ground
    mole.setAttribute('animation', {
      property: 'position',
      to: {
        x: selectedHole.getAttribute('position').x,
        y: 0.5, // Pop up to this height
        z: selectedHole.getAttribute('position').z
      },
      dur: 300, // Duration of the pop-up animation in milliseconds
      easing: 'easeOutQuad' // A nice easing effect
    });

    // --- WHACK! ---
    // This is the most important part. We add a 'click' event listener.
    // When the user's cursor clicks this mole, this function will run.
    mole.addEventListener('click', () => {
      // Increase the score by 10
      this.score += 10;

      // Update the score text display
      this.scoreText.setAttribute('value', `Score: ${this.score}`);

      // Remove the mole from the scene
      mole.parentNode.removeChild(mole);
    });

    // Make the mole disappear after a certain time if not hit
    setTimeout(() => {
      // We check if the mole still exists in the scene before trying to remove it
      if (mole.parentNode) {
        mole.parentNode.removeChild(mole);
      }
    }, 2000); // Mole stays for 2 seconds (2000ms)

    // Add the newly created mole to our scene
    this.sceneEl.appendChild(mole);
  }
});
