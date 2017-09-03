(function() {

  const customSelect = () => {
    const body = document.querySelector('body');
    const customSelect = document.querySelector(".custom-account-selector");

    customSelect.addEventListener('click', e => {
      let target = e.target;
      console.log(target);
      if (target !== customSelect.parentNode) {
        if (customSelect.lastElementChild.classList.contains('hidden')) {
          showAccountList();
          customSelectItem();
        } else {
          hideAccountList();
        }

        // what a f... piece of code. I do not know how to do it otherwise :(
        body.addEventListener('click', function(ev) {
          if (ev.target !== customSelect &&
              ev.target !== customSelect.children[0] &&
              ev.target !== customSelect.children[1] &&
              ev.target !== customSelect.children[1].children[0] &&
              ev.target !== customSelect.children[1].children[1] &&
              ev.target !== customSelect.children[2] &&
              ev.target !== customSelect.children[2].children[0] &&
              ev.target !== customSelect.children[3] &&
              ev.target !== customSelect.children[4]) {
            hideAccountList();
          }
        });
      }
    })
  }

  const showAccountList = () => {
    const accountList = document.querySelector('.account-list');
    accountList.classList.remove('hidden');
  };

  const hideAccountList = () => {
    const accountList = document.querySelector('.account-list');
    accountList.classList.add('hidden');
  };

  const customSelectItem = () => {
    const customSelect = document.querySelector(".custom-account-selector");
    const accountListItem = document.querySelectorAll('.account-list-item');
    let accountNumber = customSelect.children[1].children[1];
    let accountAmount = customSelect.children[2];

    for (let i = 0, l = accountListItem.length; i < l; i++) {
      accountListItem[i].addEventListener('click', function() {
        accountNumber.innerText = this.children[0].innerText;
        accountAmount.innerHTML = this.children[1].innerHTML;
      })
    }
  };

  customSelect();


})();
