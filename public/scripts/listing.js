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

export async function initialize () {
//window.addEventListener("load", async () => {
  //const paginatedList = document.getElementById("listing-container");
  const nextButton = document.getElementById("btn-next");
  const prevButton = document.getElementById("btn-prev");
  const listingContainer = document.getElementById("listing-container");
  const messageElement = document.getElementById("message");

  let myChart = null;

  const pageSize = 10;

  let currentPage = 1;
  let contentArr = [];

  const setCurrentPage = (pageNum) => {
    currentPage = pageNum;
    const pageCount = Math.ceil(contentArr.length / pageSize);
    const prevRange = (pageNum - 1) * pageSize;
    const currRange = pageNum * pageSize;
    nextButton.style = "";
    prevButton.style = "";
    if (pageNum === pageCount) {
      console.log("disabled next");
      //prevButton.classList.add("hidden");
      nextButton.style.display = "none";
    } else if (pageNum === 1) {
      console.log("disabled prev");
      prevButton.style.display = "none";
    }

    let result = contentArr.slice(`${prevRange}`, `${currRange}`);
    //console.log(result);
    listingContainer.innerHTML = "";
    result.forEach((element) => {
      listingContainer.appendChild(element);
    });
  };
    
    prevButton.addEventListener("click", () => {
      setCurrentPage(currentPage - 1);
    });
    nextButton.addEventListener("click", () => {
      setCurrentPage(currentPage + 1);
    });

    await renderContent();
    
    async function renderContent () {
      const currentDate = new Date(); // create a new Date object
      const startDate = new Date(currentDate); // create a copy of currentDate
      startDate.setDate(startDate.getMonth());
      let endDate = new Date();
      startDate.setMonth(startDate.getMonth() + 1);
      startDate.setDate(startDate.getDate() - 1);
      endDate.setMonth(endDate.getMonth() + 1);
    
      let valueMap = new Map();
      if (startDate & endDate) {
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
    
          result.forEach((element) => {
            if (!valueMap.has(element.cc)) {
              valueMap.set(element.cc, []);
            }
    
            valueMap.get(element.cc).push({
              rate: element.rate,
              date: element.exchangedate,
              text: element.txt,
            });
          });
        }

        valueMap.forEach((element, key) => {
          //elementsNum++;
          let trydates = [];
          let tryrates = [];
    
          let gettingCurrency = valueMap.get(`${key}`);
    
          gettingCurrency.forEach((element) => {
            trydates.push(element.date);
            tryrates.push(element.rate);
          });
    
          //const minRate = Math.min(tryrates); // /2
          //const maxRate = Math.max(tryrates); // *2
    
          const listedContainer = document.createElement("a"); //"a"
          listedContainer.href = "/calculate";
          listedContainer.onclick = function() {
            localStorage.setItem("myKey", `${key}`);
            route();
          };
          
          const chart = document.createElement("canvas");
          const scrChart = document.createElement("script");
          const scrChartmin = document.createElement("script");
          listedContainer.textContent = `${key}`;
          //listedContainer.id = "listed-value"
          //listedContainer.className = 'block-currency';
          //listingContainer.appendChild(listedContainer);
          //listedContainer.className = 'block-price';
          listedContainer.id = `${key}`;
    
          //listedContainer.appendChild(someCurrency);
          chart.id = "myChart";
          chart.width = 400;
          chart.height = 200;
          scrChart.src = "https://cdn.jsdelivr.net/npm/chart.js@3.7.1";
          scrChartmin.src =
            "https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js";
          listedContainer.appendChild(chart);
          listedContainer.appendChild(scrChart);
          listedContainer.appendChild(scrChartmin);
          //contentArr.push({ elem: listedContainer, rate: tryrates, date: trydates});
          contentArr.push(listedContainer);
          // contentArr.push(tryrates);
    
          //  if(myChart) {
          //    myChart.destroy();
          //  }
          myChart = new Chart(chart, {
            type: "line",
            data: {
              datasets: [
                {
                  fill: false,
                  borderColor: "rgb(75, 192, 192)",
                  tension: 0.1,
                  //hidden: true,
                },
              ],
            },
            options: {
              plugins: {
                legend: {
                  display: false,
                },
              },
    
              scales: {
                x: {
                  display: false // hide the x axis
                },
                y: {
                  display: false,
                  beginAtZero: false,
                  //min: minRate,
                  //max: maxRate,
                },
              },
              elements: {
                point: {
                  radius: 0 // hide the data points
                },
                line: {
                  //borderWidth: 0 // hide the line between data points
                }
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
    
          
          let secondFromLast = tryrates[tryrates.length - 2];
          let theLastOne = tryrates[tryrates.length - 1];
          if(secondFromLast < theLastOne) {
            myChart.data.datasets[0].borderColor = "blue";
          } else if (secondFromLast > theLastOne) {
            myChart.data.datasets[0].borderColor = "red";
          } else {
            myChart.data.datasets[0].borderColor = "grey";
          }
          myChart.data.labels = trydates;
          //myChart.data.datasets[0].data[2].hidden = true;
          //    myChart.data.datasets[0].label = names;
          myChart.data.datasets[0].data = tryrates;
          myChart.update();
        });
      } else {
        showMessage("You are not set up dates for chart");
      }
    
      setCurrentPage(1);
    };
}
