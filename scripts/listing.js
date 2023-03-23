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

const paginationLimit = 10;
const pageSize = 10;

let elementsNum = null;
const paginatedList = document.getElementById("listing-container");
let listItems = paginatedList.querySelectorAll("li");
const nextButton = document.getElementById("btn-next");
const prevButton = document.getElementById("btn-prev");
let currentPage = 1;





window.addEventListener("load", async (e) => {
  
  let contentArr = [];
  const currentDate = new Date(); // create a new Date object
  const startDate = new Date(currentDate); // create a copy of currentDate
  startDate.setDate(startDate.getMonth());
  let endDate = new Date();
  startDate.setMonth(startDate.getMonth() + 1);
  startDate.setDate(startDate.getDate() - 1);
  endDate.setMonth(endDate.getMonth() + 1);

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
      })
    }

    
    valueMap.forEach((element, key) =>{

      elementsNum++;
      let trydates = [];
      let tryrates = [];
      
      let gettingCurrency = valueMap.get(`${key}`);

      gettingCurrency.forEach((element) => {
          trydates.push(element.date)
          tryrates.push(element.rate)
         })
        
        //  const minRate = Math.min(rates); // /2
        //  const maxRate = Math.max(rates); // *2
        
        contentArr.push()

        const listedContainer = document.createElement("li") //"a"
        //     href="/calculate"
        // onclick="route()"
            // const someCurrency = document.createElement("li"); // "div"
            const chart = document.createElement("canvas");
            const scrChart = document.createElement("script")
            const scrChartmin = document.createElement("script")
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
                scrChartmin.src = "https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js";
                listedContainer.appendChild(chart);
                listedContainer.appendChild(scrChart);
                listedContainer.appendChild(scrChartmin);
                contentArr.push(listingContainer);
                console.log(contentArr);
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

          myChart.data.labels = trydates;
       //    myChart.data.datasets[0].label = names;
          myChart.data.datasets[0].data = tryrates;
          myChart.update();
              })

  }
  else {
    showMessage("You are not set up dates for chart");
  }
  
  // const paginatedList = document.getElementById("listing-container");
  // const paginationNumbers = document.getElementById("pagination-numbers");
  // const listItems = paginatedList.querySelectorAll("li");

  // const nextButton = document.getElementById("btn-next");
  // const prevButton = document.getElementById("btn-prev");



  // const pageCount = Math.ceil(listItems.length / paginationLimit);
  // for (let i = 1; i <= pageCount; i++) {
  //   appendPageNumber(i);
  // }
  // const setCurrentPage = (pageNum) => {
  //   currentPage = pageNum;
  // };
  // if (currentPage === 1) {
  //   disableButton(prevButton);
  // } else {
  //   enableButton(prevButton);
  // }

  // if (pageCount === currentPage) {
  //   disableButton(nextButton);
  // } else {
  //   enableButton(nextButton);
  // }
  // prevButton.addEventListener("click", () => {
  //   setCurrentPage(currentPage - 1);
  // });

  // nextButton.addEventListener("click", () => {
  //   setCurrentPage(currentPage + 1);
  // });
  // document.querySelectorAll(".pagination-number").forEach((button) => {
  //   const pageIndex = Number(button.getAttribute("page-index"));

  //   if (pageIndex) {
  //     button.addEventListener("click", () => {
  //       setCurrentPage(pageIndex);
  //     });
  //   }
  // });
  
  setCurrentPage(1);
  prevButton.addEventListener("click", () => {
    setCurrentPage(currentPage - 1);
  });
  nextButton.addEventListener("click", () => {
    setCurrentPage(currentPage + 1);
  });
  document.querySelectorAll("li").forEach((button) => {
    const pageIndex = Number(button.getAttribute("page-index"));

    if (pageIndex) {
      button.addEventListener("click", () => {
        setCurrentPage(pageIndex);
      });
    }
  })

})
const pageCount = Math.ceil(listItems.length / pageSize);
console.log('length', listItems.length);
const setCurrentPage = (pageNum) => {
  currentPage = pageNum;

  //document.getElementById("listed-value").style.display = "none";
  //elems.className = "hidden";
  

  const prevRange = (pageNum - 1) * pageSize;
  const currRange = pageNum * pageSize;
  
  listItems.forEach((item, index) => {
    item.classList.add("hidden");
    if (index >= prevRange && index < currRange) {
      item.classList.remove("hidden");
    }
  });

  //console.log(pageCount);
}


