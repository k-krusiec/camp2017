(function() {
  const passContainer = document.querySelector('.password');
  const passInput = document.querySelector('.password-field');
  const form = document.querySelector('.form');
  const errorBox = document.createElement('div');

  function addErrorBox() {
    errorBox.classList.add('error-box');
    passContainer.after(errorBox);
  }

  form.addEventListener('click', e => {
    e.preventDefault();

    let passValue = passInput.value;
    comunicateApi(passValue);

    function showErrorMessage(response) {

      passInput.classList.add('error');
      addErrorBox();
      errorBox.innerHTML = response.message;

    }

    function comunicateApi(pass) {
      $.ajax({
        type: 'post',
        data: {
          login: 'efi',
          password: pass
        },
        url: 'https://efigence-camp.herokuapp.com/api/login',
        error: function(response) {

          const responseObject = JSON.parse(response.responseText);
          showErrorMessage(responseObject);

        },
        success: function(response) {
          console.log(response);
          window.location.replace('./dashboard.html');
        }
      });
    }

  })

})();
