import sunny from '../icons/sunny.png';
import cloudy from '../icons/cloudy.png';
import rain from '../icons/rain.png';
import snow from '../icons/snow.png';

const form = document.querySelector('form');
const locationName = document.getElementById('locationName');
const dayData = document.querySelector('.dayData');
const weekData = document.getElementById('weekData');
const weekDay = document.getElementById('weekDay');

const icons = { sunny, cloudy, rain, snow };

let days = [];

async function setLocation(e) {
  e.preventDefault();

  const city = this.querySelector('[name=city]').value;
  const country = this.querySelector('[name=country]').value;

  try {
    const place = await getCoords(city, country);
    renderLocation(place.name, place.country);

    await getForecast(place.latitude, place.longitude);

  } catch (err) {
    console.error('App error:', err);
  }
}

async function getCoords(city, country) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.results?.length) {
    throw new Error('Location not found');
  }

  const countryCode = country.toUpperCase();

  let match = data.results.find((r) => r.country_code === countryCode);

  if (!match) match = data.results[0];

  return match;
}

async function getForecast(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

  const res = await fetch(url);
  const data = await res.json();

  const d = data.daily;

  days = d.time.map((date, i) => ({
    date,
    icon: mapWeatherCode(d.weather_code[i]),
    summary: `Max ${d.temperature_2m_max[i]}° / Min ${d.temperature_2m_min[i]}°`,
  }));

  renderDaily(days[0]);
  renderWeek(days);
}

function mapWeatherCode(code) {
  if (code === 0) return 'sunny';
  if (code <= 3) return 'cloudy';
  if (code <= 48) return 'cloudy';
  if (code <= 67) return 'rain';
  if (code <= 77) return 'snow';
  return 'rain';
}

function renderLocation(name, country) {
  locationName.innerHTML = `<h2 class="locationText">${name}, ${country}</h2>`;
}

function renderDaily(day) {
  const date = new Date(day.date);
  const label = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  dayData.innerHTML = `
    <h2>${label}</h2>
    <img src="${icons[day.icon]}" class="weatherIcon"/>
    <p>${day.summary}</p>
  `;
}

function renderWeek(days) {
  weekDay.innerHTML = '';

  days.slice(1).forEach((day) => {
    const date = new Date(day.date);
    const label = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    weekDay.innerHTML += `
      <div class="dayCard">
        <p class="date">${label}</p>
        <img src="${icons[day.icon]}" class="weatherIcon"/>
        <p class="summary">${day.summary}</p>
      </div>
    `;
  });
}



form.addEventListener('submit', setLocation);
