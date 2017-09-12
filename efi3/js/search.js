(function() {

  const showSearch = () => {
    const searchBtn = document.querySelector('.settings-search');
    const searchPanel = document.querySelector('.search');
    const searchInput = document.querySelector('.search-input');

    searchBtn.addEventListener('click', () => {
      searchPanel.classList.remove('hidden');
      searchInput.focus();
    })
  };

  const hideSearch = () => {
    const searchPanel = document.querySelector('.search');
    const searchInput = document.querySelector('.search-input');

    searchPanel.addEventListener('focusout', () => {
      searchPanel.classList.add('hidden');
      searchInput.value = '';
    })
  };

  showSearch();
  hideSearch();

})();
