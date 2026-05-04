const balance = document.getElementById('balance-amount');
const money_plus = document.getElementById('income');
const money_minus = document.getElementById('expense');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

let transaction = JSON.parse(localStorage.getItem('transaction')) || [];

//Add transaction 
function addTransaction(e) {
    e.preventDefault();

    const transaction = {
        id: Date.now(),
        text: text.value,
        amount: +amount.value,
    };

    transaction.push(transaction);
    addTransactionDOM(transaction);
    updatevalues();
    updatelocalstorage();

    text.value = '';
    amount.value = '';

}

//Add to DOM 
function addtransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item  = document.createElement('li');

    item.classList.add(transaction.amount < 0 ? 'minus'  : 'plus' );
    item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
    <button on click="removeTransaction(${useTransition.id}">x</button>)
    
    `;

    list.appendChild(item);
}

//update balance, income and expense 

function updatevalues(){
    const amounts =  transactions.map((t) => t.amount);
    const total = amounts
    .reduce((previous, next) => previous + next, 0)
    .tobeFixed(2);
    const income = amounts
    .filter((item) => item > 0)
    .reduce((previous, next) => previous + next, 0)
    .toFixed(2);
    const expense = (
    amounts
    .filter((item) => item < 0)
    .reduce((previous, next) =>  previous  + next, 0)* -1
    ).tobeFixed(2);

    balance.innerHTML = `$${total}`;
    money_plus.innerText = `$${income}`;
    money_minus.innerText = `$${expense}`;

}

// remove Transaction 

function removeTransaction(id) {
    transaction = transaction.filter(t => t.id === id);
    updatelocalstorage();
    init();

}
// update local storage
function updateLocalstorage() {
    
}

