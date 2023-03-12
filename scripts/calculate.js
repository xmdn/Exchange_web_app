//import { Chart } from 'https://cdn.jsdelivr.net/npm/chart.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';
import { getFirestore, doc, setDoc, collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';
//import { initializeApp } from "./app.js";

const firebaseApp = initializeApp({  //FireBase csonfiguration of application
    apiKey: "AIzaSyAci7cExKpy7KdcaKtV-NynPs3kNWOUegA",
    authDomain: "currency-f1988.firebaseapp.com",
    databaseURL: "https://currency-f1988-default-rtdb.firebaseio.com",
    projectId: "currency-f1988",
    storageBucket: "currency-f1988.appspot.com",
    messagingSenderId: "1009009054053",
    appId: "1:1009009054053:web:3df8a1eef37bac6a70d18c"
  });
  const auth = getAuth(firebaseApp);
  const db = getFirestore();



const messageElement = document.getElementById('message'); //Message Form
function showMessage(message){  //Message showing
  messageElement.textContent = messaSge;
}
const logElement = document.getElementById('log'); //Message Form
function showLog(){  //Message showing
}

const calcForm = document.getElementById("calc-form"); //Calculation Form
  // let oldDate = new Date("Thu Jan 01 1970 21:30:00 GMT +0530(IST)");
  // let newDate = new Date();
  // newDate.setHours(oldDate.getHours());
  // newDate.setMinutes(oldDate.getMinutes());
  // newDate.setSeconds(oldDate.getSeconds()); 
  // console.log(newDate)
// fetch(`https://bank.gov.ua/ua/markets/exchangerate-chart?startDate=10.03.2022&endDate=${newDate}`)
//  .then(data => {
//     console.log(newDate);
//  })
 fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=20200302&json') // Get the currency API Endpoint
 .then(response => response.json()) // Getting json from response
 .then(data => {  // Showing response to dropdown with forEach
   const currencyDropdown = calcForm["currency"];
   data.forEach(currency => {
     const option = document.createElement('option');
     option.value = currency.rate.toFixed(1);
     option.innerHTML = currency.cc;
     currencyDropdown.appendChild(option);
   });
 })
 .catch(error => {
   console.error('Error:', error);
 });

 calcForm.addEventListener('submit', e => { // Event listener "on click" and calculating currency to amount
  e.preventDefault();
  const rate = calcForm["currency"].value;
  const amount = calcForm["amount"].value;
  const result = calcForm["result"];
  result.value = amount * rate 
  onAuthStateChanged(auth, user => {  // If user loged result will be sended to current history list results of calculation
    if (user) { 
      if(result.value != "NaN" ) { // Also checking for Not A Number 
        addDoc(collection(db, 'users/', user.uid ,'/history'), {
          Amount: amount,
          Result: result.value,
        }).then(()=>{
          console.log('success');
        }).catch(err=>{
           console.log(err.message);
         })
      } else {
        console.log('Dont use Not a Number chars again, understand me, fucking punk?')
      } } else {
            console.log('you dont even a user, fuck you, why you pretending like being you its ok?');
            showMessage('You are not loged');
            showLog();
        }
  })
});
function getDataAndDrawChart() {
  fetch('https://bank.gov.ua/NBU_Exchange/exchange_site?start=20220115&end=20220131&valcode=aud&sort=exchangedate&order=desc&json', {mode: 'no-cors'})
    .then(console.log(response))
    // .then(data => {
    //   const chartData = [];
    //   data.forEach(currency => {
    //     console.log(data);
    //     chartData.push({
    //       date: currency.date,
    //       rate: currency.rate.toFixed(1),
    //     });
    //   });
    //   new Chart(document.getElementById('myChart'), {
    //     type: 'line',
    //     data: {
    //       labels: chartData.map(data => data.date),
    //       datasets: [{
    //         label: 'Exchange Rates',
    //         data: chartData.map(data => data.rate),
    //         fill: false,
    //         borderColor: 'rgb(75, 192, 192)',
    //         tension: 0.1,
    //       }]
    //     },
    //     options: {
    //       scales: {
    //         y: {
    //           beginAtZero: true,
    //         }
    //       }
    //     }
    //   });
    // })
    .catch(error => {
      console.error('Error:', error);
    });
};

// Example usage
getDataAndDrawChart();