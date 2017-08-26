(function() {

  const getSummary = (endpoint, containers) => {

    const balance = document.querySelector(containers.balance);
    const funds = document.querySelector(containers.funds);
    const payments = document.querySelector(containers.payments);

    $.get( 'https://efigence-camp.herokuapp.com/api/' + endpoint, data => {
      console.log(data);

      const balanceValue = data.content[0].balance;
      const fundsValue = data.content[0].funds;
      const paymentsValue = data.content[0].payments;

      balance.innerText = balanceValue;
      funds.innerText = fundsValue;
      payments.innerText = paymentsValue;
    });

  };

  const endpoint = 'data/summary/';
  const containers = {
    balance: '.balance',
    funds: '.funds',
    payments: '.payments'
  };

  getSummary(endpoint, containers);

  const getProducts = () => {

    const productsContainer = document.querySelector('.products');

    $.get( 'https://efigence-camp.herokuapp.com/api/data/products',  data => {
      console.log(data);

      const productsList = data.content;
      const productTemplate = (data) => {

        let icon;

        switch(data.type) {
          case 'Wallet':
            icon = 'wallet';
          break;
          case 'Deposits':
            icon = 'deposits';
          break;
          case 'Accounts':
            icon = 'accounts';
          break;
          case 'Funds':
            icon = 'Funds';
          break;
          case 'Bank loans':
            icon = 'bank loans';
          break;
          default:
            icon = 'default';
        }

        return `
          <div class="product-item">
            <p>${data.type}
              <span>${icon}</span>
              <span>${data.amount}</span>
              <span>${data.currency}</span>
            </p>
          </div>`;
      };

      // for (let i = 0, l = productsList.length; i < l; i++) {
      //   console.log(i, productsList[i]);
      // }

      productsList.forEach((element, index) => {
        console.log(`iteracja: ${index}`, element);
        productsContainer.insertAdjacentHTML('beforeend', productTemplate(element));

      });

    });
  };

  getProducts();

})();
