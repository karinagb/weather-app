const form = document.querySelector('form');
let zip_code;
let lan;
let lon;
let date;

function setLocation(e) {
  e.preventDefault();

  zip_code = this.querySelector('[name=zip_code]').value;

  originalDate = this.querySelector('[name=date]').value;

  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(originalDate));

  date = formattedDate;

  getCoords(zip_code, date);
}

async function getCoords(zip_code, date) {
  const url = `https://se-weather-api.herokuapp.com/api/v1/geo?zip_code=${zip_code}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();

    lan = result.latitude;
    lon = result.longitude;

  } catch (error) {
    console.error(error.message);
  }
  getForecast(lon, lan, date);
}

async function getForecast(lon, lan, date) {
  const url = `https://se-weather-api.herokuapp.com/api/v1/forecast?latitude=${lan}&longitude=${lon}&date=${date}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error.message);
  }
}

form.addEventListener('submit', setLocation);
