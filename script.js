const links = document.querySelectorAll('a[href^="#"]');

links.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    window.scrollTo({
      top: targetElement.offsetTop,
      behavior: 'smooth'
    });
  });



  const words = ["Developer", "Designer", "Freelancer", "Innovator"];
        let i = 0, j = 0, del = false;
        const el = document.getElementById("typed");

        function type() {
            el.textContent = words[i].slice(0, j += del ? -1 : 1);
            if (!del && j === words[i].length) {
                del = true;
                setTimeout(type, 1000);
            } else if (del && j === 0) {
                del = false;
                i = (i + 1) % words.length;
                setTimeout(type, 500);
            } else {
                setTimeout(type, del ? 50 : 100);
            }
        }

        document.addEventListener("DOMContentLoaded", type);

});
