// Wait for the entire HTML to load before running the script
window.onload = () => {
  // Get all the placeholder entities for our moles
  const moleHoles = document.querySelectorAll('.mole-hole');
  const scoreText = document.querySelector('#score-text');
  
  let score = 0;
  let activeMole = null; // To keep track of the currently visible mole

  // Function to make a mole appear in a random hole
  function popUpMole() {
    // If a mole is already active, remove it first
    if (activeMole) {
      activeMole.parentNode.removeChild(activeMole);
    }

    // 1. Pick a random hole from our list
    const randomIndex = Math.floor(Math.random() * moleHoles.length);
    const randomHole = moleHoles[randomIndex];

    // 2. Decide if it will be a box or a sphere
    const isBox = Math.random() > 0.5;
    let newMole;

    if (isBox) {
      // Create a box mole
      newMole = document.createElement('a-box');
      newMole.setAttribute('color', 'brown');
      newMole.setAttribute('scale', '0.7 0.7 0.7');
    } else {
      // Create a sphere mole
      newMole = document.createElement('a-sphere');
      newMole.setAttribute('color', 'grey');
      newMole.setAttribute('radius', '0.35');
    }
    
    // 3. Set common properties for the new mole
    newMole.setAttribute('class', 'mole'); // Add 'mole' class for the cursor to target
    newMole.setAttribute('position', '0 0 0');

    // 4. Add an event listener for when it's clicked (or gazed at)
    newMole.addEventListener('click', whackMole);

    // 5. Add the mole to the random hole and track it
    randomHole.appendChild(newMole);
    activeMole = newMole;
  }

  // Function to handle hitting a mole
  function whackMole(event) {
    // The 'event.target' is the mole that was clicked
    const whackedMole = event.target;
    
    // Increase the score
    score++;
    scoreText.setAttribute('value', `Score: ${score}`);
    
    // Remove the whacked mole from its parent (the hole)
    whackedMole.parentNode.removeChild(whackedMole);
    activeMole = null; // No mole is active now
  }
  
  // Start the game loop! Make a mole pop up every 1.5 seconds.
  // The 'setInterval' function repeatedly calls 'popUpMole'.
  setInterval(popUpMole, 1500); // 1500 milliseconds = 1.5 seconds
};
