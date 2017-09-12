(function() {

  const showMobileMenu = () => {
    const hamburgerMenu = document.querySelector('.menu-title');
    const menu = document.querySelector('.mobile-menu');

    hamburgerMenu.addEventListener('click', () => {
      menu.classList.toggle('show');
    })
  };

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

  const customSelect = () => {
    // dorobić czekowanie w datasecie!
    const body = document.querySelector('body');
    const customSelect = document.querySelector(".custom-account-selector");

    customSelect.addEventListener('click', e => {
      let target = e.target;
      // console.log(target);
      if (target !== customSelect.parentNode) {
        if (customSelect.lastElementChild.classList.contains('hidden')) {
          showAccountList();
          customSelectItem();
        } else {
          hideAccountList();
        }

        // what a f... piece of code :(
        body.addEventListener('click', function(ev) {
          if (ev.target !== customSelect &&
              ev.target !== customSelect.children[0] &&
              ev.target !== customSelect.children[1] &&
              ev.target !== customSelect.children[1].children[0] &&
              ev.target !== customSelect.children[1].children[1] &&
              ev.target !== customSelect.children[2] &&
              ev.target !== customSelect.children[2].children[0] &&
              ev.target !== customSelect.children[2].children[1] &&
              ev.target !== customSelect.children[3] &&
              ev.target !== customSelect.children[4]) {
            hideAccountList();
          }
        });
      }
    })
  };

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
    // console.log(customSelect);
    let accountNumber = customSelect.children[1].children[1];
    let accountAmount = customSelect.children[2];

    for (let i = 0, l = accountListItem.length; i < l; i++) {
      accountListItem[i].addEventListener('click', function() {
        accountNumber.innerText = this.children[0].innerText;
        accountAmount.innerHTML = this.children[1].innerHTML;
      })
    }
  };

  const getCustomSelectData = () => {
    const customSelect = document.querySelector('.custom-account-selector');
    let activeSelectionData = {
      accountNumber: customSelect.children[1].children[1].innerText,
      accountAmount: customSelect.children[2].children[0].innerText,
      accountCurrency: customSelect.children[2].children[1].innerText
    }

    return activeSelectionData;
  };

  const errorClasses = {
    recipient: 'err-recipient',
    accountNumber: 'err-account-number',
    sum: 'err-sum',
    when: 'err-when',
    title: 'err-title'
  };

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

  const addErrTemplate = (errClass, errMsg, insertTarget) => {
    let errTemplate = `
      <div class="new-error ${errClass}">
        <div class="row">
          <div class="small-9 small-offset-3 columns">
            <p class="dash-error">${errMsg}</p>
          </div>
        </div>
      </div>`
    insertTarget.insertAdjacentHTML('afterend', errTemplate);
  };

  const getErrorElement = (errClass) => {
    const wasError = document.querySelector('.' + errClass);
    if (wasError) {
      wasError.parentNode.removeChild(wasError);
    }
  };

  const validateRecipient = (errClass, errMsg) => {
    const recipient = document.querySelector('#recipient');
    const recipientInput = document.querySelector('.recipient-input');
    let recipientValue = recipientInput.value;
    let incorrect = false;

    getErrorElement(errClass.recipient);

    if (!recipientValue) {
      addErrTemplate(errClass.recipient, errMsg.empty, recipient);
      incorrect = true;
    } else {
      incorrect = false;
    }
    submitDisabler(incorrect);
  };

  const validateAccountNumber = (errClass, errMsg, accNumData) => {
    const accountNumber = document.querySelector('#account-number');
    const accountNumberInput = document.querySelector('.acount-number-input');
    const accNumRegexp = {
      numSpace: /^(\d|\s)+$/,
      onlySpace: /^(\D\s)+$/
    }
    let accountNumberValue = accountNumberInput.value;
    let incorrect = false;

    getErrorElement(errClass.accountNumber);

    if (!accountNumberValue) {
      addErrTemplate(errClass.accountNumber, errMsg.empty, accountNumber);
      incorrect = true;
    } else if (accountNumberValue.match(accNumRegexp.numSpace) === null) {
      addErrTemplate(errClass.accountNumber, errMsg.accountNumber.badFormat, accountNumber);
      incorrect = true;
    } else if (accountNumberValue.match(accNumRegexp.onlySpace) !== null) {
      addErrTemplate(errClass.accountNumber, errMsg.accountNumber.badFormat, accountNumber);
      incorrect = true;
    } else if (accNumData.length < 26) {
      addErrTemplate(errClass.accountNumber, errMsg.accountNumber.toShort, accountNumber);
      incorrect = true;
    } else if (accNumData.length > 26) {
      addErrTemplate(errClass.accountNumber, errMsg.accountNumber.toLong, accountNumber);
      incorrect = true;
    } else {
      incorrect = false;
    }
    accountNumberInput.value = accNumData.format;
    submitDisabler(incorrect);
  };

  const getAccountNumberValue = () => {
    const accountNumberInput = document.querySelector('.acount-number-input');

    accountNumberInput.addEventListener('focusout', () => {

      validateAccountNumber(errorClasses, errorMsg, formatAccountNumber(accountNumberInput));
    })
    return formatAccountNumber(accountNumberInput);
  };

  const formatAccountNumber = (accNumInput) => {
    let accNumberData = {
      length: 0,
      format: ''
    };
    let accNumberVal = accNumInput.value;
    accNumberVal = accNumberVal.trim().replace(/\s/g,'');
    accNumberData.length = accNumberVal.length;
    let accNumberArr = [];
    for (let i = 0, l = accNumberVal.length; i < l; i++) {
      if (i < 2) {
        accNumberArr.push(accNumberVal[i]);
      } else {
        if (!((i - 2) % 4)) {
          accNumberArr.push(' ' + accNumberVal[i])
        } else {
          accNumberArr.push(accNumberVal[i]);
        }
      }
    }
    accNumberData.format = accNumberArr.join('');
    return accNumberData;
  };

  const validateSum = (errClass, errMsg, sumData) => {
    const sum = document.querySelector('#sum');
    const sumInput = document.querySelector('.sum-input');
    let sumValue = sumInput.value;
    let incorrect = false;


    // console.log(getCustomSelectData());
    // console.log(parseFloat(getCustomSelectData().accountAmount.replace(/\s/g,'').replace(/\,/g,'.')).toFixed(2));
    //
    // console.log(sumData);

    getErrorElement(errClass.sum);

    if (!sumValue) {
      addErrTemplate(errClass.sum, errMsg.empty, sum);
      incorrect = true;
    } else if (parseFloat(sumValue).toFixed(2) === '0.00') {
      addErrTemplate(errClass.sum, errMsg.sum.badValue, sum);
      incorrect = true;
    } else if (sumData.initAmount.replace(/\s/g,'').replace(/\,/g,'.') !== sumData.value) {
      addErrTemplate(errClass.sum, errMsg.sum.differentValues, sum);
      incorrect = true;
    } else if (parseFloat(getCustomSelectData().accountAmount.replace(/\s/g,'').replace(/\,/g,'.')).toFixed(2) < sumData.value) {
      addErrTemplate(errClass.sum, errMsg.sum.notEnoughCash, sum);
      incorrect = true;
    } else {
      incorrect = false;
    }

    sumInput.value = sumData.format;
    submitDisabler(incorrect);
  };

  const getSumValue = () => {
    const sumInput = document.querySelector('.sum-input');

    sumInput.addEventListener('keypress', function(event) {
      // numbers, space, period and comma only allowed
      if (event.keyCode !== 44 && event.keyCode !== 46 && event.keyCode !== 32 && (event.keyCode < 48 || event.keyCode > 57)) {
        event.returnValue = false;
      }
    })

    sumInput.addEventListener('focusout', () => {

      validateSum(errorClasses, errorMsg, formatSum(sumInput));
    })
    return formatSum(sumInput);
  };

  const formatSum = (sumInput) => {
    const sumRegexp = /^(\D)+$/
    let sumInputData = {
      length: 0,
      format: '',
      value: 0,
      initAmount: ''
    };
    let sumInputVal = sumInput.value;
    sumInputData.initAmount = sumInputVal;

    if (sumInputVal.length !== 0 && sumInputVal.match(sumRegexp) === null) {
      if (sumInputVal.indexOf('.') !== -1 || sumInputVal.indexOf(',') !== -1) {
        if (sumInputVal.indexOf('.') === sumInputVal.length -1 || sumInputVal.indexOf(',') === sumInputVal.length -1) {
          sumInputData.initAmount = sumInputVal + '00';
        } else if (sumInputVal.indexOf('.') === sumInputVal.length -2 || sumInputVal.indexOf(',') === sumInputVal.length -2) {
          sumInputData.initAmount = sumInputVal + '0';
        } else {
          sumInputData.initAmount = sumInputVal;
        }
      } else if (sumInputVal.length !== 0) {
        sumInputData.initAmount = sumInputVal + '.00';
      } else {
        sumInputData.initAmount = sumInputVal;
      }
    } else {
      sumInputVal = '0,00';
    }

    sumInputVal = parseFloat(sumInputVal
      .trim()
      .replace(/\s/g,'')
      .replace(/\,/g,'.')
      .replace(/\,\,/g,'.')
      .replace(/\.\./g,'.')
      .replace(/\,./g,'.')
      .replace(/\.,/g,'.'))
      .toFixed(2);
    sumInputData.value = sumInputVal;
    sumInputVal = sumInputVal.split('').reverse();

    sumInputData.length = sumInputVal.length;
    let sumArr = [];
    for (let i = 0, l = sumInputVal.length; i < l; i++) {
      if (i <= 2) {
        sumArr.push(sumInputVal[i]);
      } else {
        if (!((i - 5) % 3)) {
            sumArr.push(' ' + sumInputVal[i])
          } else {
            sumArr.push(sumInputVal[i]);
          }
      }
    }

    sumInputData.format = sumArr.reverse().join('').replace(/\./g,',');
    return sumInputData;
  };

  const validateTitle = (errClass, errMsg, titleData) => {
    const title = document.querySelector('#title');
    const titleInput = document.querySelector('.title-input');
    const titleRegexp = /^(\s)+$/;
    let titleValue = titleInput.value;
    let incorrect = false;

    getErrorElement(errClass.title);

    if (!titleValue) {
      addErrTemplate(errClass.title, errMsg.empty, title);
      incorrect = true;
    } else if (titleValue.match(titleRegexp) !== null) {
      addErrTemplate(errClass.title, errMsg.title.badFormat, title);
      incorrect = true;
    } else if (titleValue.length > 150) {
      addErrTemplate(errClass.title, errMsg.title.toLong, title);
      incorrect = true;
    } else {
      incorrect = false;
    }
    submitDisabler(incorrect)
    titleInput.value = titleData.format;
  };

  const getTitleValue = () => {
    const titleInput = document.querySelector('.title-input');

    titleInput.addEventListener('focusout', () => {
      validateTitle(errorClasses, errorMsg, formatTitle(titleInput));
    })
    return formatTitle(titleInput);
  };

  const formatTitle = (titleInput) => {
    let titleInputData = {
      length: 0,
      format: ''
    };
    let titleInputVal = titleInput.value;
    titleInputVal = titleInputVal.trim().replace(/\s\s+/g, ' ');
    titleInputData.length = titleInputVal.length;
    titleInputData.format = titleInputVal;

    return titleInputData;
  };

  /* I'm not happy with this solution.
  Why do I have to disable the submit button?
  In the real world I would be pissed off */
  const submitDisabler = (incorrect) => {
    let submitBtn = document.querySelector('.submit');
    submitBtn.disabled = incorrect;
  };

  const onSubmit = () => {
    const form = document.querySelector('.form');
    const sumInput = document.querySelector('.sum-input').value;
    form.addEventListener('submit', e => {
      e.preventDefault();
      validateRecipient(errorClasses, errorMsg);
      validateAccountNumber(errorClasses, errorMsg, getAccountNumberValue());
      validateSum(errorClasses, errorMsg, '0,00');
      validateTitle(errorClasses, errorMsg, getTitleValue());

      console.log('klik');
    })
  };

  showMobileMenu();
  showSearch();
  hideSearch();
  onSubmit();
  customSelect();
  getAccountNumberValue();
  getSumValue();
  getTitleValue();

})();