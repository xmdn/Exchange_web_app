fetch('https://bank.gov.ua/NBU_Exchange/exchange_site?start=20220115&end=20220131&valcode=aud&sort=exchangedate&order=desc&json') // Get the currency API Endpoint
.then(response => response.json()) // Getting json from response
.then(data => {  // Showing response to dropdown with forEach
  const date = data;
  data.forEach(currency => {
    const data =[];
    data.value = currency.rate.toFixed(1);
    console.log(data)
    date.appendChild(data);
  });
})
.catch(error => {
  console.error('Error:', error);
});
//https://bank.gov.ua/NBU_Exchange/exchange_site?start=20220115&end=20220131&valcode=aud&sort=exchangedate&order=desc&json
const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };
  
  const config = {
    type: 'line',
    data: data,
  };
  
  const myChart = new Chart(
      document.getElementById('myChart'),
      config
  );