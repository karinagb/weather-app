import sunny from '../icons/sunny.png';
import cloudy from '../icons/cloudy.png';
import rain from '../icons/rain.png';
import snow from '../icons/snow.png';

const form = document.querySelector('form');
const weekData = document.getElementById('weekData');
const dayData = document.querySelector('.dayData');

let days = [];
let day = {};

let zip_code;
let lan;
let lon;
let date;

const icons = {
  sunny,
  cloudy,
  rain,
  snow,
};

function setLocation(e) {
  e.preventDefault();

  zip_code = this.querySelector('[name=zip_code]').value;

  const originalDate = this.querySelector('[name=date]').value;

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

    getForecast(lon, lan, date);
  } catch (error) {
    console.error(error.message);
  }
}
async function getForecast(lon, lan, date) {
  const url = `https://se-weather-api.herokuapp.com/api/v1/forecast?latitude=${lan}&longitude=${lon}&date=${date}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();

    days = result.daily.data;
    day = result.daily;
  } catch (error) {
    console.error(error.message);
  }
  renderDaily(day);
  renderWeek(days);
}

function renderDaily(day) {
  return (dayData.innerHTML = ` 
    <h2>Today</h2>  
    <img 
      src="${icons[day.icon]}"
      alt="${day.icon}"
      class="weatherIcon"
    />
    <p>${day.summary}</p>`);
}

function renderWeek(days) {
  weekData.innerHTML = '<tr></tr>';

  const row = weekData.querySelector('tr');

  days.forEach((day) => {
    row.innerHTML += `
      <td class="dayCard">
        <img 
          src="${icons[day.icon]}"
          alt="${day.icon}"
          class="weatherIcon"
        />
        <p>${day.summary}</p>
      </td>
    `;
  });
}

form.addEventListener('submit', setLocation);
