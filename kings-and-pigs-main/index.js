const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// Function to set canvas size to full window size
function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Set initial canvas size
setCanvasSize();

// Handle window resizing
window.addEventListener('resize', () => {
  setCanvasSize();
});

// Rest of your code...

let parsedCollisions;
let collisionBlocks;
let background;
let doors;
const player = new Player({
  imageSrc: './img/king/idle.png',
  frameRate: 8,
  animations: {
    idleRight: {
      frameRate: 11,
      frameBuffer: 2,
      loop: true,
      imageSrc: './img/king/idle.png',
    },
    idleLeft: {
      frameRate: 11,
      frameBuffer: 2,
      loop: true,
      imageSrc: './img/king/idleLeft.png',
    },
    runRight: {
      frameRate: 8,
      frameBuffer: 4,
      loop: true,
      imageSrc: './img/king/runRight.png',
    },
    runLeft: {
      frameRate: 8,
      frameBuffer: 4,
      loop: true,
      imageSrc: './img/king/runLeft.png',
    },
    enterDoor: {
      frameRate: 8,
      frameBuffer: 4,
      loop: false,
      imageSrc: './img/king/enterDoor.png',
      onComplete: () => {
        console.log('completed animation');
        gsap.to(overlay, {
          opacity: 1,
          onComplete: () => {
            if (level === 1) {
              // If the player enters the third level door, redirect to indexshoot.js
              window.location.href = "indexgame.html"; // Ensure this file exists
            } else {
              level++;
              if (level === 4) level = 1;
              levels[level].init();
              player.switchSprite('idleRight');
              player.preventInput = false;
              gsap.to(overlay, {
                opacity: 0,
              });
            }
          },
        });
      },
    }
    
  },
});

let level = 3;
let levels = {
  1: {
    init: () => {
      parsedCollisions = collisionsLevel1.parse2D();
      collisionBlocks = parsedCollisions.createObjectsFrom2D();
      player.collisionBlocks = collisionBlocks;
      if (player.currentAnimation) player.currentAnimation.isActive = false;

      background = new Sprite({
        position: { x: 0, y: 0 },
        imageSrc: './img/backgroundLevel1.png',
      });

      doors = [
        new Sprite({ position: { x: 760, y: 307 }, imageSrc: './img/doorOpen.png', frameRate: 5, frameBuffer: 5, loop: false, autoplay: false }),
        new Sprite({ position: { x: 3000, y: 335 }, imageSrc: './img/doorOpen.png', frameRate: 5, frameBuffer: 5, loop: false, autoplay: false }),
        new Sprite({ position: { x: 4500, y: 335 }, imageSrc: './img/doorOpen.png', frameRate: 5, frameBuffer: 5, loop: false, autoplay: false }),
        new Sprite({ position: { x: 6000, y: 335 }, imageSrc: './img/doorOpen.png', frameRate: 5, frameBuffer: 5, loop: false, autoplay: false }),
      ];
    },
  },
  2: {
    init: () => {
      parsedCollisions = collisionsLevel2.parse2D();
      collisionBlocks = parsedCollisions.createObjectsFrom2D();
      player.collisionBlocks = collisionBlocks;
      player.position.x = 96;
      player.position.y = 140;
  
      // Replace the player with the character from indexshoot.js
      player = new Fighter({
        position: {
          x: 96,
          y: 140
        },
        velocity: {
          x: 0,
          y: 0
        },
        offset: {
          x: 0,
          y: 0
        },
        imageSrc: './img2/samuraiMack/Idle.png',
        framesMax: 8,
        scale: 2.5,
        offset: {
          x: 215,
          y: 157
        },
        sprites: {
          idle: {
            imageSrc: './img2/samuraiMack/Idle.png',
            framesMax: 8
          },
          run: {
            imageSrc: './img2/samuraiMack/Run.png',
            framesMax: 8
          },
          jump: {
            imageSrc: './img2/samuraiMack/Jump.png',
            framesMax: 2
          },
          fall: {
            imageSrc: './img2/samuraiMack/Fall.png',
            framesMax: 2
          },
          attack1: {
            imageSrc: './img2/samuraiMack/Attack1.png',
            framesMax: 6
          },
          takeHit: {
            imageSrc: './img2/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
          },
          death: {
            imageSrc: './img2/samuraiMack/Death.png',
            framesMax: 6
          }
        },
        attackBox: {
          offset: {
            x: 100,
            y: 50
          },
          width: 160,
          height: 50
        }
      });
  
      if (player.currentAnimation) player.currentAnimation.isActive = false;
  
      background = new Sprite({
        position: { x: 0, y: 0 },
        imageSrc: './img/backgroundLevel2.png',
      });
  
      doors = [
        new Sprite({ position: { x: 1078, y: 300 }, imageSrc: './img/doorOpen.png', frameRate: 5, frameBuffer: 5, loop: false, autoplay: false }),
        new Sprite({ position: { x: 1300, y: 300 }, imageSrc: './img/doorOpen.png', frameRate: 5, frameBuffer: 5, loop: false, autoplay: false }),
        new Sprite({ position: { x: 1550, y: 300 }, imageSrc: './img/doorOpen.png', frameRate: 5, frameBuffer: 5, loop: false, autoplay: false }),
      ];
    },
  },

  3: {
    init: () => {
      parsedCollisions = collisionsLevel3.parse2D();
      collisionBlocks = parsedCollisions.createObjectsFrom2D();
      player.collisionBlocks = collisionBlocks;
      player.position.x = 750;
      player.position.y = 230;
      if (player.currentAnimation) player.currentAnimation.isActive = false;

      background = new Sprite({
        position: { x: 0, y: 0 },
        imageSrc: './img/backgroundLevel3.png',
      });

      doors = [
        new Sprite({ position: { x: 163, y: 362 }, imageSrc: './img/doorOpen.png', frameRate: 5, frameBuffer: 5, loop: false, autoplay: false }),
        new Sprite({ position: { x: 300, y: 10000 }, imageSrc: './img/doorOpen.png', frameRate: 5, frameBuffer: 5, loop: false, autoplay: false }),
        new Sprite({ position: { x: 450, y: 31000 }, imageSrc: './img/doorOpen.png', frameRate: 5, frameBuffer: 5, loop: false, autoplay: false }),
        new Sprite({ position: { x: 600, y: 31000 }, imageSrc: './img/doorOpen.png', frameRate: 5, frameBuffer: 5, loop: false, autoplay: false }),
      ];
    },
  },
};

const keys = { w: { pressed: false }, a: { pressed: false }, d: { pressed: false } };

const overlay = { opacity: 0 };

function animate() {
  window.requestAnimationFrame(animate);
  background.draw();
  doors.forEach((door) => { door.draw(); });
  player.handleInput(keys);
  player.draw();
  player.update();
  c.save();
  c.globalAlpha = overlay.opacity;
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.restore();
}
// Add a function to check proximity to the door
// Add a function to check proximity to the door
function isPlayerNearDoor(player, door, threshold = 30) {
  return (
    Math.abs(player.position.x - door.position.x) < threshold &&
    Math.abs(player.position.y - door.position.y) < threshold
  );
}

// Function to show a popup above the player
// function showPopup(message) {
//   const popup = document.createElement('div');
//   popup.id = 'popup';
//   popup.style.position = 'absolute';
//   popup.style.left = `${player.position.x-(-96)}px`;
//   popup.style.top = `${player.position.y - (-140)}px`;
//   popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
//   popup.style.color = 'white';
//   popup.style.padding = '10px';
//   popup.style.alignItems="below";
//   popup.style.borderRadius = '5px';
//   popup.style.zIndex = '1000';
//   popup.style.textAlign = 'center';
//   popup.style.transition = 'opacity 0.5s';
//   popup.innerHTML = `<span id='popupText'></span><br><button id='closePopup'></button>`;
//   document.body.appendChild(popup);
  
//   // Display text one by one
//   let index = 0;
//   function typeText() {
//     if (index < message.length) {
//       document.getElementById('popupText').textContent += message[index];
//       index++;
//       setTimeout(typeText, 50);
//     }
//   }
//   typeText();

//   // Add event listener to close the popup
//   document.getElementById('closePopup').addEventListener('click', () => {
//     document.body.removeChild(popup);
//     isPopupShown = false;
//   });
// }
// Function to show a popup above the player
function showPopup(message) {
  const popup = document.createElement('div');
  popup.id = 'popup';
  popup.style.position = 'absolute';
  popup.style.left = `${player.position.x + 110}px`;
  popup.style.top = `${player.position.y +100}px`;
  popup.style.background = "rgba(255, 208, 160, 0.9)"; // Warm beige background
  popup.style.padding = '15px';
  popup.style.border = '4px solid #a86e3a'; // Darker brown border
  popup.style.borderRadius = '10px';
  popup.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.5)';
  popup.style.color = '#552d14'; // Deep brown text for contrast
  popup.style.fontFamily = '"Press Start 2P", cursive';
  popup.style.fontSize = '12px';
  popup.style.textAlign = 'center';
  popup.style.zIndex = '1000';
  popup.style.opacity = '0';
  popup.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out';
  popup.style.transform = 'translateY(-10px)';

  popup.innerHTML = `
    <span id='popupText'></span>
    <br><br>
    <button id='closePopup' style="
      background: #a86e3a;
      color: white;
      border: 2px solid #552d14;
      padding: 8px 15px;
      cursor: pointer;
      font-family: 'Press Start 2P', cursive;
      font-size: 10px;
      border-radius: 5px;
      transition: background 0.2s ease;">
      
    </button>
  `;

  document.body.appendChild(popup);

  // Apply fade-in animation
  setTimeout(() => {
    popup.style.opacity = '1';
    popup.style.transform = 'translateY(0)';
  }, 10);

  // Typewriter effect
  let index = 0;
  function typeText() {
    if (index < message.length) {
      document.getElementById('popupText').textContent += message[index];
      index++;
      setTimeout(typeText, 40);
    }
  }
  typeText();

  // Close popup on button click
  document.getElementById('closePopup').addEventListener('click', () => {
    popup.style.opacity = '0';
    popup.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      document.body.removeChild(popup);
      isPopupShown = false;
    }, 300);
  });
}


// Function to remove the popup
function removePopup() {
  const popup = document.getElementById('popup');
  if (popup) {
    document.body.removeChild(popup);
  }
}

// Track if the popup is currently shown
let isPopupShown = false;

// Modify the animate function to handle the popup logic

  // Modify the animate function to handle the popup logic for the second door
// Modify the animate function to handle the popup logic for doors 2, 3, and 4
function animate() {
  window.requestAnimationFrame(animate);
  background.draw();
  doors.forEach((door) => { door.draw(); });

  // Check proximity to the first door
  if (isPlayerNearDoor(player, doors[0]) && !isPopupShown) {
    showPopup('Basics of C');
    isPopupShown = true;
  } 
  // Check proximity to the second door and show a different message
  else if (isPlayerNearDoor(player, doors[1]) && !isPopupShown) {
    showPopup('Look the door 2!');
    isPopupShown = true;
  } 
  // Check proximity to the third door and show a similar message
  else if (isPlayerNearDoor(player, doors[2]) && !isPopupShown) {
    showPopup('Look the door 3!');
    isPopupShown = true;
  }
  // Check proximity to the fourth door and show a similar message
  else if (isPlayerNearDoor(player, doors[3]) && !isPopupShown) {
    showPopup('Look the door!');
    isPopupShown = true;
  } 
  // If the player is not near any of the doors, remove the popup
  else if (
    !isPlayerNearDoor(player, doors[0]) && 
    !isPlayerNearDoor(player, doors[1]) &&
    !isPlayerNearDoor(player, doors[2]) &&
    !isPlayerNearDoor(player, doors[3]) &&
    isPopupShown
  ) {
    removePopup();
    isPopupShown = false;
  }

  player.handleInput(keys);
  player.draw();
  player.update();

  c.save();
  c.globalAlpha = overlay.opacity;
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.restore();
  
}




levels[level].init();
animate();
