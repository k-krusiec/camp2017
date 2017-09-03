(function() {

  const customSelect = () => {
    // dorobić czekowanie w datasecie!
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

        // what a f... piece of code :(
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
    let accountNumber = customSelect.children[1].children[1];
    let accountAmount = customSelect.children[2];

    for (let i = 0, l = accountListItem.length; i < l; i++) {
      accountListItem[i].addEventListener('click', function() {
        accountNumber.innerText = this.children[0].innerText;
        accountAmount.innerHTML = this.children[1].innerHTML;
      })
    }
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
    badFormat: 'Incorrect account number format',
    toShort: 'Account number is to short',
    toLong: 'Account number is to long',
    badValue: 'Incorrect value'
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

    getErrorElement(errClass.recipient);

    if (!recipientValue) {
      addErrTemplate(errClass.recipient, errMsg.empty, recipient);
    }
  };

  const getAccountNumberValue = () => {
    const accountNumberInput = document.querySelector('.acount-number-input');
    accountNumberInput.addEventListener('focusout', () => {

      let accNumberData = {
        length: 0,
        format: ''
      };
      let accNumberVal = accountNumberInput.value;
      accNumberVal = accNumberVal.trim().replace(/\s/g,'');;
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

      validateAccountNumber(errorClasses, errorMsg, accNumberData);
    })
  };

  const validateAccountNumber = (errClass, errMsg, accNumData) => {
    const accountNumber = document.querySelector('#account-number');
    const accountNumberInput = document.querySelector('.acount-number-input');
    const regexpNumSpace = /^(\d|\s)+$/;
    let accountNumberValue = accountNumberInput.value;

    getErrorElement(errClass.accountNumber);

    if (!accountNumberValue) {
      addErrTemplate(errClass.accountNumber, errMsg.empty, accountNumber);
    } else if (accountNumberValue.match(regexpNumSpace) === null) {
      addErrTemplate(errClass.accountNumber, errMsg.badFormat, accountNumber);
    } else if (accNumData.length < 26) {
      addErrTemplate(errClass.accountNumber, errMsg.toShort, accountNumber);
    } else if (accNumData.length > 26) {
      addErrTemplate(errClass.accountNumber, errMsg.toLong, accountNumber);
    }

    accountNumberInput.value = accNumData.format;
  };

  const validateSum = (errClass, errMsg) => {
    const sum = document.querySelector('#sum');
    const sumInput = document.querySelector('.sum-input');
    let sumValue = sumInput.value;

    getErrorElement(errClass.sum);

    if (sumValue === '0,00') {
      addErrTemplate(errClass.sum, errMsg.badValue, sum);
    }
  };

  const validateTitle = (errClass, errMsg) => {
    const title = document.querySelector('#title');
    const titleInput = document.querySelector('.title-input');
    let titleValue = titleInput.value;

    getErrorElement(errClass.title);

    if (!titleValue) {
      addErrTemplate(errClass.title, errMsg.empty, title);
    }
  };

  const onSubmit = () => {
    // czym submitować?!?
    // const submitBtn = document.querySelector('.submit');
    const form = document.querySelector('.form');

    form.addEventListener('submit', e => {
      e.preventDefault();
      validateRecipient(errorClasses, errorMsg);
      validateAccountNumber(errorClasses, errorMsg, accNumData);
      validateSum(errorClasses, errorMsg);
      validateTitle(errorClasses, errorMsg);
      console.log('klik');
    })
  };

  customSelect();
  // getAccountNumberInput();
  getAccountNumberValue();
  onSubmit();


})();
