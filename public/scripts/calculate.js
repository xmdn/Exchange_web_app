import { auth, db } from "../fire.js";
import {
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import {
  getDocs,
  collection,
  addDoc,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";


const messageElement = document.getElementById("message"); //Message Form
function showMessage(message) {
  messageElement.textContent = message;
}

export async function initializeCalculate() {
  const calcForm = document.getElementById("calc-form"); //Calculation Form
  const userInfo = document.getElementById("user-inf");
  const userForm = document.getElementById("user-form"); 
  const userBtn = document.getElementById("btn-user");
  const calcBtn = document.getElementById("btn-calc");
  userInfo.style.display = 'none';
  let myChart = null;

  let valueOfSeeking = null;
  let currencyDropdown = calcForm["currency"];


  async function getOption(myValue) {
    await fetch(
      "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchangenew?json"
    ) // Get the currency API Endpoint
      .then((response) => response.json()) // Getting json from responses
      .then((data) => {
        // Showing response to dropdown with forEach
        let option;
        data.forEach((currency) => {
          option = document.createElement("option");
          option.dataset.tick = currency.cc;
          option.value = currency.rate.toFixed(1);
          option.innerHTML = currency.cc;
          currencyDropdown.appendChild(option);
        });
        let some = currencyDropdown.querySelector(
          `option[data-tick="${myValue}"]`
        );
        if (myValue) {
          //console.log(option.innerHTML);
          some.selected = true;
        } else if (!myValue) {
          console.log("something");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  calcForm.addEventListener("submit", (e) => {
    // Event listener "on click" and calculating currency to amount
    e.preventDefault();
    let amount = calcForm["amount"].value;
    let selected = currencyDropdown.options[currencyDropdown.selectedIndex].innerHTML;
    if (amount)
    { 
      const rate = calcForm["currency"].value;
      //const amount = calcForm["amount"].value;
      const result = calcForm["result"];
      result.value = amount * rate;
      const transactionDate = new Date();
      onAuthStateChanged(auth, (user) => {
        // If user loged result will be sended to current history list results of calculation
        if (user) {
          if (result.value != "NaN") {
            // Also checking for Not A Number
            addDoc(collection(db, "users/", user.uid, "/history"), {
              Amount: amount,
              Result: result.value,
              Ticker: selected,
              Date: transactionDate,
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
    } else {
      showMessage("Set the number!");
    }
    getHistory();
  });
  


  async function getHistory() {
  userForm.innerHTML = "";
  const currentId = auth.currentUser;
  const q = query(collection(db, "users", currentId.uid, "history"), orderBy("Date", "desc"))
  const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      //console.log(`${doc.id} => ${doc.data().Amount}`);
      const outInfo = document.createElement("div");
      outInfo.name = "hist";
      outInfo.id = "hist";
      let calcInfo = doc.data();
      let date = calcInfo.Date.toDate()
      const day = date.getDate().toString().padStart(2, '0'); 
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
      const year = date.getFullYear(); 
      const hours = date.getHours().toString().padStart(2, '0'); 
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const formattedDate = `${hours}:${minutes} ${day}-${month}-${year}`;
      const formattedResult = parseFloat(calcInfo.Result).toFixed(1);

      outInfo.textContent = `${calcInfo.Ticker} Amount: ${calcInfo.Amount}  Result: ${formattedResult} Date: ${formattedDate}`
      userForm.appendChild(outInfo);
    });
  }
  userBtn.addEventListener("click", () =>  {
    if (userInfo.style.display === 'none') {
      userInfo.style.display = 'block';
    } else {
      userInfo.style.display = 'none';
    }
  })

  $("#startDate").datepicker();
  $("#endDate").datepicker();
  $("#startDate").datepicker("hide");
  $("#endDate").datepicker("hide");

  $("#currency").on("change", function () {
    $(this).prop("changed", true);
  });
  const startDate = new Date();
  let endDate = new Date();
  startDate.setMonth(startDate.getMonth() - 1);

  await renderCalculate();
  getHistory();

  async function renderCalculate() {
    if (myChart) {
      myChart.destroy();
    }

    let chngCurr = $("#currency").prop("changed");
    let selectedOption =
      currencyDropdown.options[currencyDropdown.selectedIndex];
    let myValue = localStorage.getItem("myKey");

    if (myValue == null || chngCurr) {
      valueOfSeeking = selectedOption.innerHTML;
    } else if (myValue !== null && !chngCurr) {
      valueOfSeeking = myValue;
      getOption(myValue);
    }

    $(this).prop("changed", false);

    let chartData = [];
    let currVal;

    if (startDate & endDate) {
      for (
        let currentDate = new Date(startDate);
        currentDate <= endDate;
        currentDate.setDate(currentDate.getDate() + 1)
      ) {
        let monthRequest = currentDate.getMonth() + 1;
        let dateS = `${currentDate.getFullYear()}${monthRequest
          .toString()
          .padStart(2, "0")}${currentDate
          .getDate()
          .toString()
          .padStart(2, "0")}`;
        let response = await fetch(
          `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${dateS}&json`
        );
        let result = await response.json();

        currVal = result.find(({ cc }) => cc === valueOfSeeking);

        chartData.push({
          date: currVal.exchangedate,
          rate: currVal.rate,
          name: currVal.txt,
        });
      }
      myValue = null;

      let dates = [];
      let rates = [];
      let names = chartData[0].name;

      chartData.forEach((element) => {
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

      if (closestValue < theLastOne) {
        percBox.style.backgroundColor = "#8888d1";
      } else if (closestValue > theLastOne) {
        percBox.style.backgroundColor = "red";
      } else {
        percBox.style.backgroundColor = "grey";
      }

      //let valuesBuffer = [];
      let valuesBuffer = rates.slice();
      valuesBuffer.pop();
      const values = valuesBuffer;

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

      //console.log(closestValues); // Output: 26.5076

      let percentageAlgo = (closestValues / theLastOne).toFixed(3) + " %";

      algoBox.textContent = "";
      algoBox.height = 40;
      algoBox.width = 50;
      algoBox.align = "left";
      algoBox.textContent = percentageAlgo;

      if (closestValues < theLastOne) {
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
          },
        },
      });

      myChart.data.labels = dates;
      myChart.data.datasets[0].label = names;
      myChart.data.datasets[0].data = rates;
      myChart.update();
    } else {
      showMessage("You are not set up dates for chart");
    }
  }
}
