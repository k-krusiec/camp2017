(function() {

  const submit = () => {
    const submitBtn = document.querySelector('.submit');
    submitBtn.addEventListener('click', e => {
      e.preventDefault();
      comunicateApi();
    })
  };

  const getPassword = () => {
    const password = document.querySelector('.password-field');
    return password;
  };

  const comunicateApi = () => {
      $.ajax({
        type: 'post',
        data: {
          login: 'efi',
          password: getPassword().value
        },
        url: 'https://efigence-camp.herokuapp.com/api/login',
        error: (response) => {
          const responseObject = JSON.parse(response.responseText);
          killErrorBox();
          showErrorMessage(responseObject)
        },
        success: (response) => {
          window.location.replace('./dashboard.html');
        }
      });
    };

    const addErrorBox = (error) => {
      const passContainer = document.querySelector('.password');
      const errorBox = document.createElement('div');
      errorBox.classList.add('error-box');
      passContainer.after(errorBox);
      errorBox.innerHTML = error;
    };

    const showErrorMessage = (response) => {
      getPassword().classList.add('error');
      addErrorBox(response.message);
    };

    const killErrorBox = () => {
      const errorBox = document.querySelector('.error-box');
      if (errorBox !== null) {
        errorBox.parentNode.removeChild(errorBox);
      }
    };

    submit();

})();
