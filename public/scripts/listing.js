import { auth, db } from "../fire.js";
import { resolveUserId } from "../router.js";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import {
  doc,
  setDoc,
  getDocs,
  addDoc,
  deleteDoc,
  collection,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

const messageElement = document.getElementById("message"); //Message Form
function showMessage(message) {
  //Message showing
  messageElement.textContent = message;
}

export async function initialize() {
  let favorite = new Map();
  const userId = await resolveUserId();
  // console.log(userId);
  const q = query(collection(db, "users/", userId, "/favorite"), orderBy("Date", "desc"))
  const querySnapshot = await getDocs(q);
  console.log(querySnapshot);
  querySnapshot.forEach((doc) => {
    console.log(doc.data());
       if (!favorite.has(doc.data().Key)) {
        favorite.set(doc.data().Key, []);
      }

      favorite.get(doc.data().Key).push({
        id: doc.id,
      });
    let favsInfo = doc.data();
    // valueMap.push(favsInfo.Key, `${doc.id}`)
    //console.log(valueMap);
  });
  console.log('Favorite', favorite.keys());

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
  // await getUserId();
  await renderContent();


  async function renderContent() {

    const startDate = new Date();
    let endDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);

    let valueMap = new Map();
    let sortedByFavs = new Map();
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
        //const selectedValue = currencyDropdown.value;
        //console.log(result);
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
      valueMap.forEach((key) => {
        if (valueMap.has(key)) {
          sortedByFavs.set(key, valueMap.get(key));
          valueMap.delete(key);
        }
      });

      //let currName = '';
      valueMap.forEach((value, key) => {
        sortedByFavs.set(key, value);
        //currName = value[0].text;

      })

      sortedByFavs.forEach((index, key, value) => {
        let trydates = [];
        let tryrates = [];
        let gettingCurrency = sortedByFavs.get(`${key}`);
        gettingCurrency.forEach((element) => {
          trydates.push(element.date);
          tryrates.push(element.rate);
        });

        const currencyContainer = document.createElement("div");
        currencyContainer.className = "container-value";
        const listedContainer = document.createElement("a"); //"a"
        listedContainer.className = "anchor-value";
        const addFavorite = document.createElement("a");
        addFavorite.textContent = "shit"
        addFavorite.onclick = async function () {
          if (!favorite.has(`${key}`)) { 
            // console.log("this ticket is not exist");
            const date = new Date();
            // if (`${key}` !== favs) {
              addDoc(collection(db, "users/", userId, "/favorite"), {
                Key: `${key}`,
                Date: date
              })
          } else {
            console.log("this ticket is do exist, deleted");
              deleteDoc(doc(db, "users/", userId, "/favorite", `${id}`))

          }
          //console.log('favs:', valueMap.value);
        }
        listedContainer.href = "/calculate";
        listedContainer.onclick = function () {
          localStorage.setItem("myKey", `${key}`);
          console.log("index: ", index);
          route();
        };
        let currName = `${value}`;

        const chart = document.createElement("canvas");
        const scrChart = document.createElement("script");
        const scrChartmin = document.createElement("script");
        const getName = valueMap.get(`${key}`);
        //console.log(getName.text);
        // valueMap.forEach((value, key) => {
        //   const first = value[0];
        //   //let nameValue = elem[0].text;
        //   console.log(`${key}: ${first}`);
        // })
        listedContainer.textContent = `${key} ${currName}` ;
        listedContainer.id = `${key}`;

        chart.id = "myChart";


        //chart.className = "chart-style";
        scrChart.src = "https://cdn.jsdelivr.net/npm/chart.js@3.7.1";
        scrChartmin.src =
          "https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js";

        currencyContainer.appendChild(addFavorite);
        currencyContainer.appendChild(listedContainer);
        currencyContainer.appendChild(scrChart);
        currencyContainer.appendChild(scrChartmin);
        // chart.style.width = 300;
        // //chart.height = 100;
        // chart.style.height = 100;
        //chart.style.height = null;

        // chart.style.removeProperty("width");
        // chart.style.removeProperty("height");
        chart.setAttribute('style', '');
        currencyContainer.appendChild(chart);
        //let element = document.getElementById('myChart');


        contentArr.push(currencyContainer);
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
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },

            scales: {
              x: {
                display: false, // hide the x axis
              },
              y: {
                display: false,
                beginAtZero: false,
              },
            },
            elements: {
              point: {
                radius: 0, // hide the data points
              },
              line: {
                //borderWidth: 0 // hide the line between data points
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
        
        let secondFromLast = tryrates[tryrates.length - 2];
        let theLastOne = tryrates[tryrates.length - 1];
        if (secondFromLast < theLastOne) {
          myChart.data.datasets[0].borderColor = "blue";
        } else if (secondFromLast > theLastOne) {
          myChart.data.datasets[0].borderColor = "red";
        } else {
          myChart.data.datasets[0].borderColor = "grey";
        }
        myChart.data.labels = trydates;
        myChart.data.datasets[0].data = tryrates;
        myChart.update();
      });
    } else {
      showMessage("You are not set up dates for chart");
    }
    setCurrentPage(1);
  }
  const canvas = document.querySelector('canvas'); // select canvas element
  canvas.removeAttribute('style');
}
