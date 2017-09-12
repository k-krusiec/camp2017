(function() {

  const apiUrl = 'https://efigence-camp.herokuapp.com/api/';

  const endpoints = {
    summary: 'data/summary/',
    products: 'data/products/',
    history: 'data/history/'
  };

  const containers = {
    balance: '.summary-balance',
    funds: '.summary-funds',
    payments: '.summary-payments',
    products: '.products',
    productsNotAvailable: '.products-not-available',
    historyNotAvailable: '.history-not-available',
    history: '.history-box'
  };

  // const showMobileMenu = () => {
  //   const hamburgerMenu = document.querySelector('.menu-title');
  //   const menu = document.querySelector('.mobile-menu');
  //
  //   hamburgerMenu.addEventListener('click', () => {
  //     menu.classList.toggle('show');
  //   })
  // };
  //
  // showMobileMenu();

  // const showSearch = () => {
  //   const searchBtn = document.querySelector('.settings-search');
  //   const searchPanel = document.querySelector('.search');
  //   const searchInput = document.querySelector('.search-input');
  //
  //   searchBtn.addEventListener('click', () => {
  //     searchPanel.classList.remove('hidden');
  //     searchInput.focus();
  //   })
  // };
  //
  // showSearch();
  //
  // const hideSearch = () => {
  //   const searchPanel = document.querySelector('.search');
  //   const searchInput = document.querySelector('.search-input');
  //
  //   searchPanel.addEventListener('focusout', () => {
  //     searchPanel.classList.add('hidden');
  //     searchInput.value = '';
  //   })
  // };
  //
  // hideSearch();

  const switchBtn = () => {
    const customSwitch = document.querySelector('.custom-switch-track');
    const customSwitchKnob = document.querySelector('.custom-switch-knob');
    const chartSection = document.querySelector('.chart');
    const accountAnalysisSection = document.querySelector('.accounts-analysis');

    customSwitch.addEventListener('click', () => {
      let isChecked = customSwitch.hasAttribute('checked');
      if (!isChecked) {
        customSwitch.setAttribute('checked', 'true');
        customSwitchKnob.classList.add('custom-switch-on');
        chartSection.classList.add('hidden');
        accountAnalysisSection.classList.remove('hidden');
      } else {
        customSwitch.removeAttribute('checked');
        customSwitchKnob.classList.remove('custom-switch-on');
        chartSection.classList.remove('hidden');
        accountAnalysisSection.classList.add('hidden');
      }
    })
  };

  switchBtn();

  const getSummary = (endpoints, containers) => {

    const balance = document.querySelector(containers.balance);
    const funds = document.querySelector(containers.funds);
    const payments = document.querySelector(containers.payments);

    $.get( apiUrl + endpoints, data => {
      console.log(data.content[0]);

      const balanceValue = data.content[0].balance;
      const fundsValue = data.content[0].funds;
      const paymentsValue = data.content[0].payments;

      balance.innerText = addSeparator(balanceValue);
      funds.innerText = addSeparator(fundsValue);
      payments.innerText = addSeparator(paymentsValue);

    });

  };

  getSummary(endpoints.summary, containers);

  const getProducts = (endpoints, containers) => {

    const productsContainer = document.querySelector(containers.products);
    const productsNotAvailable = document.querySelector(containers.productsNotAvailable);

    $.get( apiUrl + endpoints,  data => {
      // console.log(data);

      const productsList = data.content;
      const productTemplate = (data) => {
        productsNotAvailable.classList.add('hidden');

        return `
          <div class="small-12 large-6 columns">
            <div class="product-item">
              <img class="product-icon" src="./images/${addProductIcon(data.type)}" alt="${data.type}">
              <div class="product-info">
                <p class="product-type">${data.type}</p>
                <p class="product-price">${addSeparator(data.amount)}
                  <span>${data.currency}</span>
                </p>
              </div>
            </div>
          </div>`;
      };

      productsList.forEach((element, index) => {
        productsContainer.insertAdjacentHTML('beforeend', productTemplate(element));
      });
    });
  };

  getProducts(endpoints.products, containers);

  const getHistory = (endpoints, containers) => {

    const historyContainer = document.querySelector(containers.history);
    const historyNotAvailable = document.querySelector(containers.historyNotAvailable);

    $.get( apiUrl + endpoints,  data => {
      console.log(data);

      const historyList = data.content;
      const historyTemplate = (data) => {
        historyNotAvailable.classList.add('hidden');

        return `
          <div class="history-item">
            <div class="row">
              <div class="small-1 columns">
                <p class="history-date">${formatDate(data.date)}</p>
              </div>
              <div class="small-7 columns">
                <div class="history-info">
                  <p class="history-description">${data.description}</p>
                  <p class="history-category">${data.category}</p>
                  ${addHistoryIcon(data.category)}
                </div>
              </div>
              <div class="small-4 columns">
                <p class="history-cash">${formatHistoryAmount(addSeparator(data.amount), data.status)}${data.currency}</p>
              </div>
            </div>
          </div>`
      };

      historyList.forEach((element, index) => {
        historyContainer.insertAdjacentHTML('beforeend', historyTemplate(element));
      });

    });

  };

  getHistory(endpoints.history, containers);

  // Data formatting function. Adds two decimal places and separators every 3 digits
  const addSeparator = (val) => {
    let value = Array.from(val.toFixed(2).toString()).reverse();
    let result = [];

    for (let i = 0, l = value.length; i < l; i++) {
      if (i < 3) {
        if (value[i] === '.') {
          value[i] = ','
        }
        result.push(value[i]);
      } else {
        if (!((i - 5) % 3)) {
          result.push(' ' + value[i])
        } else {
          result.push(value[i]);
        }
      }
    }

    return result.reverse().join('');
  };

  const addProductIcon = (val) => {
    let icon;

    switch(val) {
      case 'Wallet':
        icon = 'wallet-gray.png';
      break;
      case 'Deposits':
        icon = 'piggy-gray.png';
      break;
      case 'Accounts':
        icon = 'money-gray.png';
      break;
      case 'Funds':
        icon = 'chart-gray.png';
      break;
      case 'Bank loans':
        icon = 'finger-gray.png';
      break;
      default:
        icon = 'default';
    }

    return icon;
  };

  const addHistoryIcon = (val) => {
    if (val === 'Cash') {
      return '<a href="#" class="button cash-ok-button">Ok</a>'
    } else {
      return '<a href="#"><img class="history-icon" src="./images/arrow-down-topaz.png" alt="More"></a>'
    }
  };

  const formatDate = (val) => {
    let date;
    let value = val.split('-').reverse();
    let historyDate = {
      day: value[0],
      month: value[1],
      year: value[2]
    }
    if (matchMedia) {
      const mq = window.matchMedia("(min-width: 1023px)");
      mq.addListener(WidthChange);
      WidthChange(mq);
    }

    // media query change
    function WidthChange(mq) {
      if (mq.matches) {
        date = historyDate.day + '.' + historyDate.month;
      } else {
        date = '<span class="history-day">' + historyDate.day + '</span><span class="history-month">' + historyDate.month + '</span>';
      }

    }

    return date;
  };

  const formatHistoryAmount = (val, statuses) => {
    let value = val;
    let status = statuses;

    if (status === 'income') {
      return '<span class="income">' + val + '</span> ';
    } else {
      return '<span class="outcome">- ' + val + '</span> ';
    }

  };

  const addChart = () => {
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["0", "3", "7", "11", "14", "21", "25"],
            datasets: [{
                data: [11000, 5000, 10000, 15000, 5000, 2000, 2000],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
  };

  addChart();

  const addPieChart = () => {
    var ctx = document.getElementById("myChart2");
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["0", "3", "7", "11", "14", "21", "25"],
            datasets: [{
                data: [11000, 5000, 10000, 15000, 5000, 2000, 2000],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
  };

  addPieChart();

})();
