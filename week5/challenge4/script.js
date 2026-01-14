let link = document.querySelectorAll('nav a');

for (let i = 0; i < link.length; i++) {
    link[i].addEventListener('click', (e) => {
        e.preventDefault();
        alert(link[i].innerHTML);
    }); 
}