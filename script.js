const cityInput = document.querySelector('.search')
const searchbtn = document.querySelector('.btn')


const notFound = document.querySelector('.not-found')
const searchCity = document.querySelector('.search-city')
const info = document.querySelector('.all-info')

const countryName = document.querySelector('.country-name')
const tempInfo = document.querySelector('.temp')
const conditionInfo = document.querySelector('.condition')
const stateInfo = document.querySelector('.state-info')
const windInfo = document.querySelector('.wind-info')
const stateImg = document.querySelector('.sunny')
const dateInfo = document.querySelector('.date')

const forecastData = document.querySelector('.all')

function currentDate(){
    const currentDate = new Date()
    const options ={
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return currentDate.toLocaleDateString('en-GB', options)
}

function getIcon(id){
    if(id <= 232) return `thunderstorm.svg`
    if(id <= 321) return `drizzle.svg`
    if(id <= 531) return `rain.svg`
    if(id <= 622) return `snow.svg`
    if(id <= 781) return `atmosphere.svg`
    if(id <= 800) return `clear.svg`
    else return `clouds.svg`
}

const apiKey = '526c085a92fd0a9aefb3f92b3bff9977'

searchbtn.addEventListener('click', ()=>{
    if(cityInput.value.trim() != '')
        {
            updateWeatherInfo(cityInput.value);
            cityInput.value = '';
            cityInput.blur();
        }
})
cityInput.addEventListener('keydown', (event)=>{
    if(event.key=='Enter'&&cityInput.value.trim()!='')
        {
            updateWeatherInfo(cityInput.value)
            cityInput.value=''
            cityInput.blur()
        }
})

async function fetchData(end, city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/${end}?q=${city}&appid=${apiKey}&units=metric`
    const response = await fetch(apiURL)
    return response.json()
}

async function updateWeatherInfo(city) {
    const weatherData = await fetchData('weather', city)
    if(weatherData.cod==404)
        {
            showDisplaySection(notFound)
            return
        }

    const{
        name: country,
        main: { temp, humidity },
        weather: [{ id , main}],
        wind: {speed}
    } = weatherData

    countryName.textContent = country
    tempInfo.textContent = Math.round(temp) + ' °C'
    conditionInfo.textContent = main
    windInfo.textContent = speed + ' m/s'
    stateInfo.textContent = humidity + '%'
    stateImg.src = `assets/weather/${getIcon(id)}`
    dateInfo.textContent = currentDate()

    await forecastInfo(city)
    showDisplaySection(info)
}

async function forecastInfo(city){
    const forecasts = await fetchData('forecast', city)
    const time = '12:00:00'
    const today = new Date().toISOString().split('T')[0]

    forecastData.innerHTML = ''
    forecasts.list.forEach(forecastWeather => {
        if(forecastWeather.dt_txt.includes(time)&& !forecastWeather.dt_txt.includes(today))
            {
                updateForecastItems(forecastWeather)
            }
    })
}

function updateForecastItems(Data){
    const{
        dt_txt: date,
        weather: [{id}],
        main: {temp}
    } = Data
    const dateTaken = new Date(date)
    const dateOption = {
        day: '2-digit',
        month: 'short',
        weekday: 'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-GB',dateOption)


    const forecastItems = `
        <div class="previous">
            <div class="date1">${dateResult}</div>
            <img src="assets/weather/${getIcon(id)}" alt="prev-img" class="prev-img">
            <div class="prev-state">${Math.round(temp)} °C</div>
        </div>
    `
    forecastData.insertAdjacentHTML('beforeend', forecastItems)
}

function showDisplaySection(section){
    [notFound, searchCity, info]
        .forEach(section => section.style.display = 'none')

        section.style.display = ''
    }