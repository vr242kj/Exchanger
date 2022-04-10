const store = function() {
    let currency = [];
    return {
        setData: newData => currency = newData,
        getData: () => currency
    }
}();

function renderCurrencies() {
    let htmlStr = store.getData().reduce((htmlStr, ex) => htmlStr + `<tr>
                                                  <td>${ex.r030}</td>
                                                  <td>${ex.txt }</td>
                                                  <td>${ex.rate}</td>
                                                  <td>${ex.cc}</td>
                                                  <td>${ex.exchangedate}</td>
                                              </tr>`,
        '');

    document.querySelector('.table tbody').innerHTML = htmlStr;
}

function currencySelectionRender(textedCurrency) {
    let currencyHtml = textedCurrency.map(txt => `<option>${txt}</option>`);
    document.getElementById('currencyInput').innerHTML = currencyHtml.join('');
}

function useLocalOrNewDate () {
    if (localStorage.getItem('Date') !== null) {
        return localStorage.getItem('Date').split('-').join('');
    }
    return new Date().toLocaleDateString().split('.').reverse().join('');
}

document.getElementById("dateInput").addEventListener("change", function() {
    localStorage.setItem('Date', this.value);
    let selectedDate = this.value.split('-').join('');
    fetchPlus(`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${selectedDate}&json`).then(_res => {
    })
});

let getUAHInput;
document.getElementById("UAHInput").addEventListener("change", function() {
    getUAHInput = this.value;
});

let getCurrencyInput;
document.getElementById("currencyInput").addEventListener("change", function(){
    getCurrencyInput = this.value;
});

function correctInputsForConverting(){
    if (!getUAHInput) {
        alert('Select amount of money in UAH!')
        return false;
    }
    if (!getCurrencyInput) {
        alert('Select currency!')
        return false;
    }
    return true;
}

document.getElementById('form').addEventListener('submit', function (event) {
    if (correctInputsForConverting()) {
        let index = store.getData().filter(currency => currency.txt === getCurrencyInput).map(currency => currency.rate);
        let convertedValue = getUAHInput / index;
        document.getElementById('output').value = convertedValue.toFixed(2);
    }
    event.preventDefault();
});

const fetchPlus = (url) =>
    fetch(url)
        .then(res => res.json())
        .then(data => {
            store.setData(data);
            renderCurrencies();
            let textedCurrency = data.map(currency => currency.txt);
            textedCurrency.unshift('');
            currencySelectionRender(textedCurrency);
        });

fetchPlus(`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${useLocalOrNewDate()}&json`)
    .then(_res => {});
