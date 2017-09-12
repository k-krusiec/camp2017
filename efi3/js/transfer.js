(function() {

  const findForm = () => {
    return document.querySelector('form');
  }

  const findSubmitBtn = () => {
    return findForm().querySelector('.submit');
  }

  const findFields = () => {
    return findForm().querySelectorAll('[data-validation]');
  }

  const errorMsg = {
    empty: 'This field is required',
    accountNumber: {
      badFormat: 'Incorrect account number format',
      toShort: 'Account number is to short',
      toLong: 'Account number is to long',
    },
    sum: {
      badValue: 'Incorrect value',
      differentValues: 'Please check again if the amount is correct',
      notEnoughCash: 'You do not have enough funds in your account'
    },
    title: {
      badFormat: 'Incorrect title format',
      toLong: 'Title should be no longer than 150 characters',
    }
  };

  const addErrTemplate = (errorData) => {
    let target = document.querySelector('#' + errorData.target);
    let errTemplate = `
      <div class="${errorData.specClass}">
        <div class="row">
          <div class="small-9 small-offset-3 columns">
            <p class="error-sausage">${errorData.msg}</p>
          </div>
        </div>
      </div>`
    target.insertAdjacentHTML('afterend', errTemplate);
  };  

  const getFormData = () => {
    let fields = {};
    let find = findFields();
    for (var i = 0, l = find.length; i < l; i++) {
      let name = find[i].getAttribute('name'),
          classes = find[i].getAttribute('class'),
          value = find[i].value,
          valLength = find[i].value.length;

      fields[name] = {
        name: name,
        classes: classes,
        value: value,
        valLength: valLength,
        error: false
      }
    }
    // console.log(fields);
    return fields;
  }

  //dodaj event do każdego sprawdzanego pola
  const setEventListener = () => {
    let getData = getFormData();

    for (var prop in getData) {
      document.querySelector('.' + getData[prop].classes)
        .addEventListener('blur', e => {
          let name = e.target.getAttribute('name'),
              classes = e.target.getAttribute('class'),
              value = e.target.value,
              valLength = e.target.value.length;

          validateField(name, classes, value, valLength);
          saveDataInObj(name, classes, value, valLength);
        })
    }
  }

  //zapisz w obiekcie nowe wartości zaciągnięte z pól (po zmianach/blurze)
  const saveDataInObj = (name, classes, value, valLength) => {
    let getData = getFormData();

    for (var key in getData) {
      if (getData[key].name === name){
        getData[key].classes = classes;
        getData[key].value = value;
        getData[key].valLength = valLength;
      }
    }
    // console.log(getData);
  }

  //przerobić zapisywanie klas w obiekcie!
  const validateField = (name, classes, value, valLength) => {
    const errorBox = document.querySelector('.err-' + name);
    let getData = getFormData();
    let isError = false;
    let errorData = {
      target: name,
      msg: 'error',
      specClass: 'err-' + name
    }

    if (errorBox) {
      errorBox.parentNode.removeChild(errorBox);
    }

    for (var key in getData) {
      let element = document.querySelector('input[name="'+ getData[key].name +'"]');

      if (getData[key].name === name) {
        if (!valLength) {
          element.classList.add('error-border');
          errorData.msg = errorMsg.empty;
          isError = true;
          addErrTemplate(errorData);
        } else {
          element.classList.remove('error-border');
          isError = false;
        }
        // console.log(getData[key].classes);
        getData[key].error = isError;
      }
    }
    // console.log(getData);
  }

  setEventListener();


})();
