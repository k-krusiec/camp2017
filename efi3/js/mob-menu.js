(function() {

  const showMobileMenu = () => {
    const hamburgerMenu = document.querySelector('.menu-title');
    const menu = document.querySelector('.mobile-menu');

    hamburgerMenu.addEventListener('click', () => {
      menu.classList.toggle('show');
    })
  };

  showMobileMenu();

})();
