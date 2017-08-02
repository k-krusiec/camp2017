(function() {
  const password = document.querySelector('.password-field');
  const submit = document.querySelector('.submit');

  submit.addEventListener('click', e => {
    e.preventDefault();

    let passValue = password.value;

    console.log(passValue);

    if (passValue.length < 1) {
      console.log('za mało znakow');
    }

  })

})();
