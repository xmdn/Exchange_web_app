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
let currencyDropdown = calcForm["currency"];

fetch("https://bank.gov.ua/NBUStatService/v1/statdirectory/exchangenew?json") // Get the currency API Endpoint
  .then((response) => response.json()) // Getting json from responses
  .then((data) => {
    // Showing response to dropdown with forEach
    
    data.forEach((currency) => {
      const option = document.createElement("option");
      option.value = currency.rate.toFixed(1);
      option.innerHTML = currency.cc;
      currencyDropdown.appendChild(option);
    });
  })
  .catch((error) => {
    console.error("Error:", error);
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
$("#endDate").datepicker();
$("#currency").val()




let myChart = null;

chartBtn.addEventListener("click", async (e) => {
  let startDate = new Date(Date.parse($("#startDate").val()));
  let endDate = new Date(Date.parse($("#endDate").val()));
  startDate.setMonth(startDate.getMonth() + 1);
  startDate.setDate(startDate.getDate() + 1);
  endDate.setMonth(endDate.getMonth() + 1);

  if(myChart) {
    myChart.destroy();
  }

  const selectedOption = currencyDropdown.options[currencyDropdown.selectedIndex];
  let chartData = [];
  for (
    let currentDate = new Date(startDate);
    currentDate <= endDate;
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    let dateS = `${currentDate.getFullYear()}${currentDate
      .getMonth()
      .toString()
      .padStart(2, "0")}${currentDate.getDate().toString().padStart(2, "0")}`;
    let response = await fetch(
      `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${dateS}&json`
    );
    let result = await response.json();
    //const selectedValue = currencyDropdown.value;

    let curr = result.find(({ cc }) => cc === selectedOption.innerHTML);
    console.log(curr);
    chartData.push({
      date: curr.exchangedate,
      rate: curr.rate,
      name: curr.txt,
    });
  }
  let dates = [];
  let rates = [];

  chartData.forEach(element => {
    dates.push(element.date);
    rates.push(element.rate);
  });

  // const minRate = Math.min(rates);
  // const maxRate = Math.max(rates);
  
  myChart = new Chart(document.getElementById("myChart"), {
    type: "line",
    data: {
      datasets: [
        {
          label: chartData[1].name,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.2,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
          // min: minRate,
          // max: maxRate,
        },
      },
      layout: {
        padding: {
          left: 50,
          right: 50,
          top: 50,
          bottom: 50,
        },
      }
    },
  });

  
  myChart.data.labels = dates;
  myChart.data.datasets[0].data = rates;
  myChart.update();

});
