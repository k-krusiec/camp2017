(function() {

  const findForm = () => {
    return document.querySelector('form');
  }

  const findSubmitBtn = () => {
    return findForm().querySelector('.submit');
  }

  const findFields = () => {
    return findForm().querySelectorAll('[data-required]');
  }

  const getFormData = () => {
    let fields = [],
        formData = {},
        find = findFields(),
        wasError = false;
    for (let i = 0; i < find.length; i++) {
      let name = find[i].getAttribute('name'),
          required = find[i].getAttribute('data-required'),
          classes = find[i].getAttribute('class'),
          value = find[i].value,
          valLength = find[i].value.length;

      fields[i] = [
        name,
        required,
        classes,
        value,
        valLength,
        wasError
      ]
      //temp
      // let attributes = findFields()[i].attributes;
      //
      // fields[name] = {
      //   attributes,
      //   value
      // }
      //end of temp
    }
    formData.fields = fields;
    formData.submitBtn = {
      name: findSubmitBtn().getAttribute('name'),
      disabled: findSubmitBtn().getAttribute('disabled')
    };
    formData.trigger = {
      form: findForm(),
    };
    // console.log('formData: ', formData);
    return formData;
  };

  const setFormData = (name, value, length) => {

    // console.log('afafd', getFormData().fields[2][3]);
    // console.log(getFormData().fields[2]);
    // console.log('name: ', name);
    // console.log('value: ', value);

    for (let i = 0, l = getFormData().fields.length; i < l; i++) {
      let formDataField = getFormData().fields[i],
          formDataName = formDataField[0],
          formDataValue = formDataField[3],
          formDataValLength = formDataField[4],
          sdfsdfds = formDataField[5];


      if (formDataName !== name) {
        formDataValue = formDataValue;
      } else {
        formDataValue = value;
        formDataValLength = length;
      }
    }
    // console.log(getFormData().fields);

  }

  const setEventListener = () => {
    // console.log('setEventListener -> getFormData: ', getFormData());
    let formDataObj = getFormData().fields;
    for (let i = 0, l = formDataObj.length; i < l; i++) {
      let element = document.querySelector('.' + formDataObj[i][2]);
      element.addEventListener('blur', e => {
        let targetName = e.target.name,
            targetValue = e.target.value,
            targetValueLength = e.target.value.length;
        ifEmptyField(targetName, targetValueLength, e.target);
        setFormData(targetName, targetValue, targetValueLength);

      });
    }
  }

  const errorMsg = {
    isEmpty: 'To pole jest wymagane'
  }

  const ifEmptyField = (name, length, target) => {
    for (let i = 0, l = getFormData().fields.length; i < l; i++) {
      let formDataField = getFormData().fields[i],
          formDataName = formDataField[0],
          formDataWasError = formDataField[5];
      if (formDataName === name && !length) {
        target.classList.add('error-border');
        console.log(errorMsg.isEmpty);
      } else {
        console.log('ok');
        target.classList.remove('error-border');
      }
    }
    console.log(getFormData().fields);
  }

  setEventListener();


})();
