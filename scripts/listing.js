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

$("#startDate").datepicker();
$("#endDate").datepicker();


let myChart = null;

const chartBtn = document.getElementById("btn-start");
chartBtn.addEventListener("click", async (e) => {
  let startDate = new Date(Date.parse($("#startDate").val()));
  let endDate = new Date(Date.parse($("#endDate").val()));
  startDate.setMonth(startDate.getMonth() + 1);
  startDate.setDate(startDate.getDate() + 1);
  endDate.setMonth(endDate.getMonth() + 1);

 
  let dates = [];
  let rates = [];
  let names = [];
  let valueMap = new Map();
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

      result.forEach(element =>{
        if(!valueMap.has(element.cc)){
        valueMap.set( element.cc, []);
        }

        valueMap.get(element.cc).push({rate: element.rate, date: element.exchangedate, text: element.txt});
        //valueMap.get(element.rate).push(element.rate, element.exchangedate);
      })

      
    }
    valueMap.forEach(element =>{
      let getingUSD;
      //let nextVal = valueMap.keys().next().value;
      for (const [key] of valueMap.entries()) {
        getingUSD = valueMap.get(key)
      }
        getingUSD.forEach((element) => {
          rates.push(element.rate)
          dates.push(element.date)
        })
        names.push(getingUSD.shift())


         console.log(rates, dates)
        //  const minRate = Math.min(rates); // /2
        //  const maxRate = Math.max(rates); // *2

        const listedContainer = document.createElement("a")
        //     href="/calculate"
        // onclick="route()"
            const someCurrency = document.createElement("div");
            const chart = document.createElement("canvas");
            const scrChart = document.createElement("script")
            const scrChartmin = document.createElement("script")
             listedContainer.id = "blockvalue";
              // listedContainer.textContent = currency.txt;
              listedContainer.className = 'block-currency';
                listingContainer.appendChild(listedContainer);
               someCurrency.textContent = rates[0].toFixed(1);
                someCurrency.className = 'block-price';
                listedContainer.appendChild(someCurrency);
                chart.id = "myChart";
                scrChart.src = "https://cdn.jsdelivr.net/npm/chart.js@3.7.1";
                scrChartmin.src = "https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js";
                // myChart.value = `${currency.cc}`;
                someCurrency.appendChild(chart);
                someCurrency.appendChild(scrChart)
                someCurrency.appendChild(scrChartmin)
                 if(myChart) {
                   myChart.destroy();
                 }
                myChart = new Chart(chart, {
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
           myChart.data.datasets[0].label = names;
          myChart.data.datasets[0].data = rates;
          myChart.update();
              })
       //} //End for all

  }
  else {
    showMessage("You are not set up dates for chart");
  }
})
