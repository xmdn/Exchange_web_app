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
  messageElement.textContent = message;
}

export async function initializeCalculate () {

  const calcForm = document.getElementById("calc-form"); //Calculation Form
  const chartBtn = document.getElementById("btn-start");

  let myChart = null;

  let valueOfSeeking = null;
  let currencyDropdown = calcForm["currency"];

let indexMap = new Map();

async function getOption(myValue, myIndex) {
  let index = 0;
  await fetch("https://bank.gov.ua/NBUStatService/v1/statdirectory/exchangenew?json") // Get the currency API Endpoint
    .then((response) => response.json()) // Getting json from responses
    .then((data) => {
      // Showing response to dropdown with forEach
      let option;
      data.forEach((currency) => {
        index++;
        if (!indexMap.has(currency.cc)) {
          indexMap.set(index, currency.cc);
        }
        // indexMap.get(index).push({
        //   cc: currency.cc
        // })
        option = document.createElement("option");
        option.dataset.tick = currency.cc;
        option.value = currency.rate.toFixed(1);
        option.innerHTML = currency.cc;
        currencyDropdown.appendChild(option);
        
      });
      
      if (myValue) {
        console.log(option.innerHTML)
        //let selectElement = document.getElementById('currency');

        $("#currency").val("`${myValue}`")

        //selectElement.querySelector(`option[value="${myValue}"]`);
        //currencyDropdown.selectedIndex = myIndex;
        //option.innerHTML = myValue;
      } else if (!myValue) {
        //option.innerHTML = Val;
        console.log("something");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
    console.log('indexMap', indexMap);

  }
  
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

  $("#startDate").datepicker();
  $("#endDate").datepicker();
  $('#startDate').datepicker('hide');
  $('#endDate').datepicker('hide');

 

  const initialStartDate = $("#startDate").val();
  const initialEndDate = $("#startDate").val();
  let selectedBefore = currencyDropdown.selectedIndex;


  
  $("#currency").on("change", function() {
    $(this).prop("changed", true);
    
  });
    const currentDate = new Date(); // create a new Date object
    const startDate = new Date(currentDate); // create a copy of currentDate
    startDate.setDate(startDate.getMonth());
    let endDate = new Date();
    startDate.setMonth(startDate.getMonth() + 1);
    startDate.setDate(startDate.getDate() - 1);
    endDate.setMonth(endDate.getMonth() + 1);
    
    await renderCalculate();

  async function renderCalculate () {
    if(myChart) {
      myChart.destroy();
    }

    let chngCurr = $("#currency").prop("changed");
    let selectedOption = currencyDropdown.options[currencyDropdown.selectedIndex];
    let myValue = localStorage.getItem("myKey");
    let myIndex = localStorage.getItem("myIndex");
    if (myValue !== null) {
      currencyDropdown.querySelector(`option[data-tick=${myValue}]`);
    }
    let mySelect = $('#currency');

    if (myValue == null || chngCurr) {
      valueOfSeeking = selectedOption.innerHTML;
    } else if (myValue !== null && !chngCurr) {
      valueOfSeeking = myValue;
      //selectedOption.innerHTML = myValue;
      //mySelect.val(`${myValue}`);
      
      getOption(myValue, myIndex);
      

    }  

    
    $(this).prop("changed", false);
    

    let chartData = [];
    let currVal;
    let currIndx;
    let combinedMap = new Map();

    if(startDate & endDate) {
      //let chartData = [];
      
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

        

        currVal = result.find(({ cc }) => cc === valueOfSeeking);
        //currIndx = indexMap.find(({ cc }) => cc === valueOfSeeking);

        console.log("Value of Currency: ", currVal);
        chartData.push({
          //index: currIndx.indx,
          cc: currVal.cc,
          date: currVal.exchangedate,
          rate: currVal.rate,
          name: currVal.txt,
        });
      }
      //let indSet = currVal.get(currVal.cc);
      //  indexMap.forEach((value, index) => {
      //    const key = currVal.get(value);
      // //   currVal[cc].push({
      // //     indx: index
      // // })
      //    combinedMap.set(index, {key, value});
      //  })
      //console.log('currValue', indSet);
      console.log('chartData', chartData);
      const getVal = await myValue;
      async function setElementOption (myValue) {
        //currencyDropdown.option.innerHTML = myValue;
        //$("#currencyDropdown").val(myValue);
      }
      console.log('combined', currVal)
      
      setElementOption(getVal);
      myValue = null;
      // chartData[0].forEach((currency) => {
      //   console.log(currency);
      //   // const option = document.createElement("option");
      //   // option.value = currency.rate.toFixed(1);
      //   // option.innerHTML = currency.cc;
      //   // currencyDropdown.appendChild(option);
      // });
      
      let dates = [];
      let rates = [];
      let names = chartData[0].name;

      chartData.forEach(element => {
        dates.push(element.date);
        rates.push(element.rate);
      });

      let percBox = document.getElementById("percentageBox");
      let algoBox = document.getElementById("algoBox");

      percBox.textContent = "";

      let closestValue = rates[rates.length - 2];
      let theLastOne = rates[rates.length - 1];
      let percentage = (closestValue / theLastOne).toFixed(3) + " %";

      
      percBox.height = 40;
      percBox.width = 50;
      percBox.align = "right";
      percBox.textContent = percentage;


        if(closestValue < theLastOne) {
          percBox.style.backgroundColor = "#8888d1";
        } else if (closestValue > theLastOne) {
          percBox.style.backgroundColor = "red";
        } else {
          percBox.style.backgroundColor = "grey";
        }

        //let valuesBuffer = [];
        let valuesBuffer = rates.slice();
        valuesBuffer.pop()
        const values = valuesBuffer;
        console.log(values);
        // function findClosestBiggestDiff(values, theLastOne, n) {
        //   const sortedvalues = values.slice().sort((a, b) => a - b);
        //   const diffs = sortedvalues.map((value) => Math.abs(theLastOne - value));
        //   const maxDiffs = diffs.slice().sort((a, b) => b - a).slice(0, n);
        //   const maxDiffValues = sortedvalues.filter((value) => maxDiffs.includes(Math.abs(theLastOne - value)));
        //   const closestValue = maxDiffValues.reduce((closest, value) => Math.abs(values.indexOf(value) - values.length + 1) < Math.abs(values.indexOf(closest) - values.length + 1) ? value : closest);
        //   return closestValue;
        // }

        
        
        // const n = 3;
        // const closestBiggestDiff = findClosestBiggestDiff(values, theLastOne, n);
        // console.log("result algo: ", closestBiggestDiff); // Output: 26.5076
        // //const closest = findClosestValue(values, theLastOne);
        
        function findClosestValue(arr, anchorValue) {
          let closestValue = arr[arr.length - 1];
          let largestDifference = Math.abs(anchorValue - closestValue);
        
          for (let i = arr.length - 2; i >= 0; i--) {
            const currentValue = arr[i];
            const currentDifference = Math.abs(anchorValue - currentValue);
        
            if (currentValue < anchorValue) {
              return closestValue;
            }
        
            if (currentDifference > largestDifference) {
              closestValue = currentValue;
              largestDifference = currentDifference;
            }
          }
        
          return closestValue;
        }

        let arr = values;
        let anchorValue = theLastOne;

        const closestValues = findClosestValue(arr, anchorValue);
        
        console.log(closestValues); // Output: 26.5076

        let percentageAlgo = (closestValues / theLastOne).toFixed(3) + " %";

        algoBox.textContent = "";
        algoBox.height = 40;
        algoBox.width = 50;
        algoBox.align = "left";
        algoBox.textContent = percentageAlgo;

        if(closestValues < theLastOne) {
          algoBox.style.backgroundColor = "#8888d1";
        } else if (closestValues > theLastOne) {
          algoBox.style.backgroundColor = "red";
        } else {
          algoBox.style.backgroundColor = "grey";
        }
      
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
    console.log(currVal);
    index = currVal.cc
  }
}