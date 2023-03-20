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
  messageElement.textContent = message;
}

const listingContainer = document.getElementById("listing-container"); //

 const listedContainer = document.getElementById("listed-container");

        // script.src = `./scripts/${scriptFile}`;

// listedContainer.addEventListener("click", () => {
//    window.location.href = "/calculate";
//    route();
//  });s






fetch("https://bank.gov.ua/NBUStatService/v1/statdirectory/exchangenew?json") // Get the currency API Endpoint
  .then((response) => response.json()) // Getting json from responses
  .then((data) => {
    // Showing response to dropdown with forEach
    
    data.forEach((currency) => {
      const listedContainer = document.createElement("a")
  //     href="/calculate"
  // onclick="route()"
      const someCurrency = document.createElement("div");
      const myChart = document.createElement("canvas");
      listedContainer.id = `block-${currency.cc}`
        listedContainer.textContent = currency.txt;
        listedContainer.className = 'block-currency';
          listingContainer.appendChild(listedContainer);
        someCurrency.textContent = currency.rate.toFixed(1);
          someCurrency.className = 'block-price';
          listedContainer.appendChild(someCurrency);
          myChart.id = "myChart";
          myChart.value = `${currency.cc}`;
          listedContainer.appendChild(myChart);
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


let myChart = null;


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
  let dates = [];
  let rates = [];
  let names = chartData[0].name;
  if(startDate & endDate) {
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
      let valutes = new Map();
      result.forEach(element =>{
        valutes.set( element.cc, element.rates)
      })
      for (let [key, value] of valutes) {
        if(myChart.value)
        console.log(key + " goes " + value);
        curr = result.reduce(() => {
          chartData.push({
            date: curr.exchangedate,
            rate: curr.rate,
            name: curr.txt,
          });
        }, {});
      }


    }



    const minRate = Math.min(rates) / 2;
    const maxRate = Math.max(rates) * 2;
    
    myChart = new Chart(document.getElementById("myChart"), {
      type: "line",
      data: {
        datasets: [
          {
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
            min: minRate,
            max: maxRate,
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
    myChart.data.datasets[0].label = names
    myChart.data.datasets[0].data = rates;
    myChart.update();
  }
  else {
    showMessage("You are not set up dates for chart");
  }

