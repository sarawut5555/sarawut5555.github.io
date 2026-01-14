const X_IMAGE_URL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1083533/x.png';
const O_IMAGE_URL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1083533/circle.png';
// Add event listeners?
let isXTurn = true;

function changeToX(event) {
  // Get the element that was clicked
  const container = event.currentTarget;
  // Create an <img> tag with the X img src
  const image = document.createElement('img');
  image.src = X_IMAGE_URL;
  // Append that <img> tag to the element
  container.appendChild(image);
  container.removeEventListener('click', changeToX)
}

function changeToO(event) {
    // Get the element that was clicked
    const container = event.currentTarget;
    // Create an <img> tag with the X img src
    const image = document.createElement('img');
    image.src = O_IMAGE_URL;
    // Append that <img> tag to the element
    container.appendChild(image);
    container.removeEventListener('click', changeToO)
  }

  function playXO(event) {
    const box = event.currentTarget;
  
    if (isXTurn) {
      changeToX(event);
    } else {
      changeToO(event);
    }
  
    isXTurn = !isXTurn;
    box.removeEventListener('click', playXO); // ช่องกดได้ครั้งเดียว
  }

const boxes = document.querySelectorAll('#grid div');
for (const box of boxes) {
  box.addEventListener('click', playXO);
}

