//import { Chart } from 'https://cdn.jsdelivr.net/npm/chart.js';
//import { callback } from 'chart.js/dist/helpers/helpers.core';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
//import { initializeApp } from "./app.js";

const firebaseApp = initializeApp({
  //FireBase csonfiguration of application
  apiKey: "AIzaSyAci7cExKpy7KdcaKtV-NynPs3kNWOUegA",
  authDomain: "currency-f1988.firebaseapp.com",
  databaseURL: "https://currency-f1988-default-rtdb.firebaseio.com",
  projectId: "currency-f1988",
  storageBucket: "currency-f1988.appspot.com",
  messagingSenderId: "1009009054053",
  appId: "1:1009009054053:web:3df8a1eef37bac6a70d18c",
});
const auth = getAuth(firebaseApp);
const db = getFirestore();

const messageElement = document.getElementById("message"); //Message Form
function showMessage(message) {
  //Message showing
  messageElement.textContent = messaSge;
}
const logElement = document.getElementById("log"); //Message Form
function showLog() {
  //Message showing
}

const calcForm = document.getElementById("calc-form"); //Calculation Form
const chartBtn = document.getElementById("btn-start");
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

//fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=20200302&json') // Get the currency API Endpoint

fetch("https://bank.gov.ua/NBUStatService/v1/statdirectory/exchangenew?json") // Get the currency API Endpoint
  .then((response) => console.log(response.json())) // Getting json from responses
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

calcForm.addEventListener("submit", (e) => {
  // Event listener "on click" and calculating currency to amount
  e.preventDefault();
  const rate = calcForm["currency"].value;
  const amount = calcForm["amount"].value;
  const result = calcForm["result"];
  result.value = amount * rate;
  onAuthStateChanged(auth, (user) => {
    // If user loged result will be sended to current history list results of calculation
    if (user) {
      if (result.value != "NaN") {
        // Also checking for Not A Number
        addDoc(collection(db, "users/", user.uid, "/history"), {
          Amount: amount,
          Result: result.value,
        })
          .then(() => {
            console.log("success");
          })
          .catch((err) => {
            console.log(err.message);
          });
      } else {
        console.log(
          "Dont use Not a Number chars again, understand me, fucking punk?"
        );
      }
    } else {
      console.log(
        "you dont even a user, fuck you, why you pretending like being you its ok?"
      );
      showMessage("You are not loged");
      showLog();
    }
  });
});
// function getDataAndDrawChart() {
$("#startDate").datepicker();

$("#startDate").change(function (e) {
  console.log(this.value);
  let startDate = this.value;
});

$("#endDate").datepicker();

$("#endDate").change(function (e) {
  console.log(this.value);
  let endDate = this.value;
});
chartBtn.addEventListener("click", (e) => {
  let startDate = new Date(Date.parse($("#startDate").val()));
  let endDate = new Date(Date.parse($("#endDate").val()));
  startDate.setMonth(startDate.getMonth() + 1);
  endDate.setMonth(endDate.getMonth() + 1);
  // console.log(startDate.getDay());
  // console.log(startDate.getMonth());
  // console.log(startDate.getFullYear());

  //let dateS = (startDate.getFullYear(), startDate.getMonth().toString().padStart(2, '0'), startDate.getDate().toString().padStart(2, '0'));
  //console.log('Date', dateS);
  for (
    let currentDate = new Date(startDate);
    currentDate <= endDate;
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    startDate.setDate(startDate.getDate() + 1);
    let dateS = `${startDate.getFullYear()}${startDate
      .getMonth()
      .toString()
      .padStart(2, "0")}${startDate
        .getDate()
        .toString()
        .padStart(2, "0")}`;
    console.log("Curr date", currentDate);
    fetch(
      `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${dateS}&json`
    )
      .then((response) => response.json())
      .then((data) => {
        const chartData = [];
        data.forEach((element) =>
          //  {console.log(element.exchangedate); console.log(element.rate)}
          {
            console.log(element.exchangedate);
            console.log(element.rate);

            chartData.push({
              date: element.exchangedate,
              rate: element.rate.toFixed(1),
            });
          }
        );
        new Chart(document.getElementById("myChart"), {
          type: "line",
          data: {
            labels: chartData.map((data) => data.date),
            datasets: [
              {
                label: "Exchange Rates",
                data: chartData.map((data) => data.rate),
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      })
      .catch((error) => console.error(error));
  }
});

//$("#btn-start").click(function () {

// var xmlHttp = new XMLHttpRequest();
//   xmlHttp.onreadystatechange = function() {
//       if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
//           callback(xmlHttp.responseText);
//   }

//   xmlHttp.open("GET", 'https://bank.gov.ua/NBU_Exchange/exchange_site?start=20220115&end=20220131&valcode=usd&sort=exchangedate&order=desc'); // true for asynchronous
//   xmlHttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
//   xmlHttp.setRequestHeader('Access-Control-Allow-Origin', 'http://localhost:5500/calculate');
//   xmlHttp.send(true);
//   console.log(xmlHttp.responseText)

//xmlHttp.open("GET", 'https://bank.gov.ua/NBU_Exchange/exchange_site?start=20220115&end=20220131&valcode=aud&sort=exchangedate&order=desc&json', false)
// fetch('https://bank.gov.ua/NBU_Exchange/exchange_site?start=20220115&end=20220131&valcode=aud&sort=exchangedate&order=desc&json', {mode: 'no-cors'})
//   .then(response => console.log(response))
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
// .catch(error => {
//   console.error('Error:', error);
// });

// Example usage
//getDataAndDrawChart();
