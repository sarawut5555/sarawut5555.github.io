let nav = document.getElementsByTagName('nav');
let ul = document.getElementsById('ul');
const items = document.querySelectorAll('li');

for (let i = 0; i < items.length; i++) {
    items[i].addEventListener('click', function() {
        alert('You clicked on item ');
    }); 
}
