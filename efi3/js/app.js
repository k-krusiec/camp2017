(function() {
  const passContainer = document.querySelector('.password');
  const passInput = document.querySelector('.password-field');
  const form = document.querySelector('.form');
  const errorBox = document.createElement('p');
  const errorMsg = {
    'empty': 'To pole nie może być puste',
    'toShort': 'To pole musi zawierać 5 znaków'
  }

  function addErrorBox() {
    errorBox.classList.add('error-box');
    passContainer.after(errorBox);
  }

  form.addEventListener('click', e => {
    e.preventDefault();

    let passValue = passInput.value;

    if (passValue.length < 1) {
      addErrorBox();
      passInput.classList.add('error');
      errorBox.innerHTML = errorMsg.empty;
    } else if (passValue.length < 5) {
      addErrorBox();
      passInput.classList.add('error');
      errorBox.innerHTML = errorMsg.toShort;
    } else {
      passInput.classList.remove('error');
      document.querySelector('.error-box').remove();
      window.location.replace('dashboard.html');
    }

  })

})();
