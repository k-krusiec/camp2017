var ValidationModule = (function() {
  var options = {};
  var classError = {};

  var errorMsg = {
    empty: 'This field is required',
    text: {
      badFormat: 'Incorrect text format',
      toLong: 'Text should be no longer than 100 characters'
    },
    accountNumber: {
      badFormat: 'Incorrect account number format',
      toShort: 'Account number is to short',
      toLong: 'Account number is to long',
      equalAccNumbers: 'You can not make a transfer within the same account'
    },
    amount: {
      badValue: 'Incorrect value',
      notEnoughCash: 'You do not have enough funds in your account'
    },
    date: {
      badFormat: 'Incorrect date format',
      badValue: 'Incorrect date'
    }
  };

  var getCustomSelectData = function() {
    var select = options.form.querySelector('.custom-account-selector');
    var accNumber = select.children[1].children[1].innerText;
    var amount = select.children[2].children[0].innerText;
    var currency = select.children[2].children[1].innerText;
    var selectData;

    accNumber = accNumber.replace(/\s/g,'');
    amount = parseFloat(amount.replace(/\s/g,'').replace(/\,/g,'.')).toFixed(2);

    selectData = {
      accNumber: accNumber,
      amount: amount,
      currency: currency
    }

    return selectData;
  }

  var setTodaysDate = function() {
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();

    return d.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
  };

  var showErrorBox = function(input, isValid, eMsg) {
    var fieldMainContainer = options.form.querySelector('#' + input.name);
    var errTemplate =
      '<div class="error-sausage">'
        + '<div class="row">'
          + '<div class="small-9 small-offset-3 columns">'
            + '<p class="error-msg err-' + input.name + '">' + eMsg + '</p>'
          + '</div>'
        + '</div>'
      + '</div>';

    if (!isValid) {
      if (!input.className || input.className.indexOf(options.classError) === -1) {
        input.className += ' ' + options.classError;
      }
      if (!fieldMainContainer.nextElementSibling.classList.contains('error-sausage')) {
        fieldMainContainer.insertAdjacentHTML('afterend', errTemplate);
      } else {
        options.form.querySelector('.err-' + input.name).innerText = eMsg;
      }

    } else {
      var regError = new RegExp('(\\s|^)' + options.classError + '(\\s|$)');
      input.className = input.className.replace(regError, '');
      if (fieldMainContainer.nextElementSibling.classList.contains('error-sausage')) {
        fieldMainContainer.nextElementSibling.outerHTML  = ''; //wywapa okienko z błędem
      }
    }
  };

  var testInputText = function(input) {
    var inputValue = input.value;
    var pattern = /^([0-9a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\.\-\"\(\)\s])+$/;
    var isValid = true;
    var eMsg;

    if (!inputValue) {
      isValid = false;
      eMsg = errorMsg.empty;
    } else if (inputValue.length > 100) {
      isValid = false;
      eMsg = errorMsg.text.toLong;
    } else if (!pattern.test(inputValue)) {
      isValid = false;
      eMsg = errorMsg.text.badFormat;
    }

    if (isValid) {
      showErrorBox(input, true, eMsg);
      return true;
    } else {
      showErrorBox(input, false, eMsg);
      return false;
    }
  };

  var testAccNumber = function(input) {
    var inputValue = input.value.replace(/\s/g,'');
    var pattern = /^[0-9]{2}\s?([0-9]{4}\s?){5}([0-9]{4})$/;
    var isValid = true;
    var eMsg;

    if (!inputValue) {
      isValid = false;
      eMsg = errorMsg.empty;
    } else if ((!pattern.test(inputValue) && isNaN(inputValue)) || (inputValue.length > 0 && inputValue.length !== 26)) {
      isValid = false;
      eMsg = errorMsg.accountNumber.badFormat;
    } else if (inputValue === getCustomSelectData().accNumber) {
      isValid = false;
      eMsg = errorMsg.accountNumber.equalAccNumbers;
    }

    if (isValid) {
      showErrorBox(input, true, eMsg);
      return true;
    } else {
      showErrorBox(input, false, eMsg);
      return false;
    }
  };

  var testAmountValue = function(input) {
    var inputValue = input.value;
    var pattern = /^[0-9\s?]{1,}([\s\.|\,]?){1}[0-9]{0,2}$/;
    var isValid = true;
    var parsedInputValue;
    var availableFunds = getCustomSelectData().amount;
    var eMsg;

    parsedInputValue = parseFloat(inputValue.replace(/\s/g,'').replace(/\,/g,'.')).toFixed(2);

    if (!inputValue) {
      isValid = false;
      eMsg = errorMsg.empty;
    } else if (!pattern.test(inputValue)) {
      isValid = false;
      eMsg = errorMsg.amount.badValue;
    } else if (inputValue.charAt(0) === ',' || inputValue.charAt(0) === '.') {
      isValid = false;
      eMsg = errorMsg.amount.badValue;
    } else if ((availableFunds - parsedInputValue) < 0) {
      isValid = false;
      eMsg = errorMsg.amount.notEnoughCash;
    } else if (inputValue.length > 0 || inputValue.indexOf(',') !== -1) {
        if (parsedInputValue <= 0) {
          isValid = false;
          eMsg = errorMsg.amount.badValue;
        }
    }

    if (isValid) {
      showErrorBox(input, true, eMsg);
      return true;
    } else {
      showErrorBox(input, false, eMsg);
      return false;
    }
  };

  var testDateValue = function(input) {
    var inputValue = input.value;
    var pattern = /^(19|20\d\d)[-/.](0[1-9]|1[012])[-/.](0[1-9]|[12][0-9]|3[01])$/;
    var isValid = true;
    var usersDate;
    var today = setTodaysDate();
    var eMsg;

    usersDate = inputValue.split('-');
    usersDate = new Date(usersDate[0],usersDate[1]-1,usersDate[2]);
    usersDate = usersDate.getTime() / 1000;

    today = today.split('-');
    todaySec = new Date(today[0],today[1]-1,today[2]);
    todaySec = todaySec.getTime() / 1000;

    if (!inputValue) {
      isValid = false;
      eMsg = errorMsg.empty;
    } else if (!pattern.test(inputValue)) {
      isValid = false;
      eMsg = errorMsg.date.badFormat;
    } else if (todaySec > usersDate) {
      isValid = false;
      eMsg = errorMsg.date.badValue;
    }

    if (isValid) {
      showErrorBox(input, true, eMsg);
      return true;
    } else {
      showErrorBox(input, false, eMsg);
      return false;
    }
  };

  var prepareElements = function() {
    var elements = options.form.querySelectorAll('input[required], textarea[required], select[required]');
    var dateInput = options.form.querySelector('input[data-type="date"]').value = setTodaysDate();

    var forEach = function(array, callback, scope) {
      for (var i = 0; i < array.length; i++) {
        callback.call(scope, i, array[i]);
      }
    };

    forEach(elements, function(index, element) {
      element.removeAttribute('required');
      element.className += ' required';
      if (element.nodeName.toUpperCase() === 'INPUT') {
        var dataType = element.dataset.type;

        if (!dataType) {
          dataType = element.type.toUpperCase();
        } else {
          dataType = element.dataset.type.toUpperCase();
        }

        //standard input validation
        if (dataType === 'TEXT') {
          element.addEventListener('keyup', function() {testInputText(element)});
          element.addEventListener('blur', function() {testInputText(element)});
        }
        // and other conditions: NUMBER, CHECKBOX, RADIO, TEXTAREA, SELECT

        //custom input validation
        if (dataType === 'ACCOUNT-NUMBER') {
          element.addEventListener('keyup', function() {testAccNumber(element)});
          element.addEventListener('blur', function() {testAccNumber(element)});
        }
        if (dataType === 'AMOUNT') {
          element.addEventListener('keyup', function() {testAmountValue(element)});
          element.addEventListener('blur', function() {testAmountValue(element)});
        }
        if (dataType === 'DATE') {
          element.addEventListener('keyup', function() {testDateValue(element)});
          element.addEventListener('blur', function() {testDateValue(element)});
        }
      }
    });
  };

  var formSubmit = function() {
    options.form.addEventListener('submit', function(e) {
      e.preventDefault();

      var validated = true;
      var elements = options.form.querySelectorAll('.required');
      var forEach = function(array, callback, scope) {
        for (var i = 0; i < array.length; i++) {
          callback.call(scope, i, array[i]);
        }
      };

      forEach(elements, function(index, element) {
        if (element.nodeName.toUpperCase() == 'INPUT') {
          var dataType = element.dataset.type;

          if (!dataType) {
            dataType = element.type.toUpperCase();
          } else {
            dataType = element.dataset.type.toUpperCase();
          }

          //standard input validation
          if (dataType == 'TEXT') {
            if (!testInputText(element)) validated = false;
          }
          // and other conditions: NUMBER, CHECKBOX, RADIO, TEXTAREA, SELECT

          //custom input validation
          if (dataType == 'ACCOUNT-NUMBER') {
            if (!testAccNumber(element)) validated = false;
          }
          if (dataType == 'AMOUNT') {
            if (!testAmountValue(element)) validated = false;
          }
          if (dataType == 'DATE') {
            if (!testDateValue(element)) validated = false;
          }
        }
      });

      if (validated) {
        this.submit();
      } else {
        return false;
      }

    });
  };

  var init = function(_options) { // to jest parametr z Module.init({form : form});
    options = {
      form: _options.form || null, //przekazany parametr - form znaleziony w DOMie, lub null jeżeli nieznaleziony
      classError: _options.classError || 'error-border'
    }
    //jeżeli nie ma forma to daj warn w konsoli
    //sprawdza w funkcji init -> options -> form
    if ( options.form === null || options.form === undefined || options.form.length === 0 ) {
      console.warn('ValidationModule: Źle przekazany formularz');
      return false;
    }


    prepareElements();
    formSubmit();
  };

  return {
    init: init
  };

})();

document.addEventListener('DOMContentLoaded', function() {
  var form = document.querySelector('.form');
  ValidationModule.init({form: form});
})
