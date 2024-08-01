const APIKey = 'a731b271190d4380843234127243007';
const $cardsBox = document.getElementById('cards-box');
const $locationForm = document.getElementById('location-form');
const $locationInput = document.getElementById('location-form__input');
const $body = document.body;
let currentCard = null;

async function getWeatherData(location) {
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${APIKey}&q=${location}`)
    .then((res)=>{
        if (res.status < 200 || res.status >= 300){
            throw new Error(res.statusText);
        }
        return res;
    })
    .catch((error) => {
        if (error){
            if (error.message === 'Bad Request') {
                alert('Неверно введен город');
            } else{
                alert('Ошибка на стороне API');
            }
        }   
        return null;
    });
    if (response){
        const data = await response.json();
        return data;
    }
    return null;
}

function getBackground(isDay, condition) {
    const ligtRainConditions = ['Patchy rain possible', 'Patchy sleet possible', 'Patchy freezing drizzle possible', 'Patchy light drizzle', 'Light drizzle',
        'Patchy light rain', 'Light rain', 'Light freezing rain', 'Light sleet', 'Light rain shower', 'Light sleet showers'];
    const rainConditions = ['Heavy freezing drizzle', 'Freezing drizzle', 'Moderate rain at times', 'Moderate rain', 'Heavy rain at times', 'Heavy rain',
        'Moderate or heavy freezing rain', 'Moderate or heavy sleet', 'Moderate or heavy rain shower', 'Torrential rain shower', 'Moderate or heavy sleet showers'];
    const snowConditions = ['Blowing snow', 'Patchy snow possible', 'Blizzard', 'Patchy light snow', 'Light snow', 'Patchy moderate snow', 'Moderate snow',
        'Patchy heavy snow', 'Heavy snow', 'Ice pellets', 'Light snow showers', 'Moderate or heavy snow showers', 'Light showers of ice pellets',
        'Moderate or heavy showers of ice pellets'];
    const fogConditions = ['Mist', 'Fog', 'Freezing fog'];
    const thunderConditions = ['Patchy light rain with thunder', 'Thundery outbreaks possible', 'Moderate or heavy rain with thunder', 'Patchy light snow with thunder',
        'Moderate or heavy snow with thunder']

    if (isDay) {
        if (condition === 'Sunny') return 'url(img/bg/01d.jpeg)';
        if (condition === 'Partly cloudy') return 'url(img/bg/02d.jpeg)';
        if (condition === 'Cloudy') return 'url(img/bg/03d.jpeg)';
        if (condition === 'Overcast') return 'url(img/bg/04d.jpeg)';
        if (fogConditions.includes(condition)) return 'url(img/bg/15d.jpeg)';
        if (ligtRainConditions.includes(condition)) return 'url(img/bg/09d.jpeg)';
        if (thunderConditions.includes(condition)) return 'url(img/bg/11d.jpeg)';
        if (snowConditions.includes(condition)) return 'url(img/bg/13d.jpeg)';
        if (rainConditions.includes(condition)) return 'url(img/bg/10d.jpeg)';
    }
    else {
        if (condition === 'Clear') return 'url(img/bg/01n.jpeg)';
        if (condition === 'Partly cloudy') return 'url(img/bg/02n.jpeg)';
        if (condition === 'Cloudy') return 'url(img/bg/03n.jpeg)';
        if (condition === 'Overcast') return 'url(img/bg/04n.jpeg)';
        if (fogConditions.includes(condition)) return 'url(img/bg/15n.jpeg)';
        if (ligtRainConditions.includes(condition)) return 'url(img/bg/09n.jpeg)';
        if (thunderConditions.includes(condition)) return 'url(img/bg/11n.jpeg)';
        if (snowConditions.includes(condition)) return 'url(img/bg/13n.jpeg)';
        if (rainConditions.includes(condition)) return 'url(img/bg/10n.jpeg)';
    }
}

function onGlassCardClick(){
    const fullCard = document.querySelector('.current');
    fullCard.classList.remove('current');
    fullCard.classList.add('glass');
    this.classList.remove('glass');
    this.classList.add('current');
}

function getNewCard() {
    const $card = document.createElement('div');
    const $icon = document.createElement('div');
    const $title = document.createElement('h3');
    const $temp = document.createElement('span');
    const $desc = document.createElement('span');
    const $wind = document.createElement('span');
    const $humidity = document.createElement('span');
    $card.classList.add('card');
    $icon.classList.add('card__icon');
    $title.classList.add('card__title');
    $temp.classList.add('card-param-value', 'card-param-value_temp');
    $desc.classList.add('card__desc');
    $wind.classList.add('card-param-value', 'card-param-value_wind');
    $humidity.classList.add('card-param-value', 'card-param-value_humidity');
    $card.innerHTML =
        `
            <div class="card__inner">
                <div class="card__head">
                    <div class="card__head-left">
                        <div class="card__head-left-title">
                        </div>
                    </div>
                    <div class="card__head-right card-param">
                        <svg class="card-param__icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15,16a3,3,0,1,1-3-3A3,3,0,0,1,15,16ZM16,5v5.262a7,7,0,1,1-8,0V5a4,4,0,0,1,8,0Zm-1.5,
                            6.675a1,1,0,0,1-.5-.865V5a2,2,0,0,0-4,0v5.81a1,1,0,0,1-.5.865,5,5,0,1,0,5,0Z" />
                        </svg>
                        <span class="card-param__text">
                            <sup>o</sup>C
                        </span>
                    </div>
                </div>
                <div class="card__footer">
                    <div class="card__footer-left card-param">
                        <svg class="card-param__icon card-param-icon_footer" viewBox="0 0 800 800">
                            <path
                                d="M616.67,442h-550a31,31,0,1,0,0,62h550A85.67,85.67,0,1,1,531,589.67V573a31,31,0,0,0-62,0v16.67c0,
                            81.42,66.24,147.66,147.67,147.66s147.66-66.24,147.66-147.66S698.09,442,616.67,442Z" />
                            <path
                                d="M66.67,404h550c81.42,0,147.66-66.24,147.66-147.67A148.21,148.21,0,0,0,616.67,108.67C535.24,108.67,469,174.91,
                            469,256.33V273a31,31,0,0,0,62,0V256.33A85.52,85.52,0,1,1,616.67,342h-550a31,31,0,0,0,0,62Z" />
                            <path d="M66.67,304H310.33A120.67,120.67,0,1,0,189.67,183.33V196a31,31,0,0,0,62,0V183.33A58.67,58.67,0,1,1,310.33,
                            242H66.67a31,31,0,0,0,0,62Z" />
                        </svg>
                        <span class="card-param-text_footer first">
                            м/с
                        </span>
                    </div>
                    <div class="card__footer-right card-param">
                        <svg class="card-param__icon card-param-icon_footer" viewBox="0 0 800 800">
                            <path
                                d="M88.63,228.84c1.68.66,41.45,16.31,69.62,24.26a298.1,298.1,0,0,0,81.65,11.31c60.5,0,115.67-17.65,169.55-34.88,71.53-22.89,139.1-44.5,215.47-23,25.1,7.08,63.21,22.07,63.7,22.27a31,31,0,0,0,22.76-57.68c-1.68-.66-41.46-16.31-69.63-24.26-94.31-26.61-174.07-1.1-251.2,23.57-71.53,22.89-139.1,44.5-215.47,23-25.14-7.09-63.32-22.12-63.71-22.27a31,31,0,0,0-22.74,57.68Z" />
                            <path
                                d="M711.37,371.16c-1.68-.66-41.45-16.31-69.62-24.26-94.31-26.61-174.07-1.1-251.2,23.57-71.53,22.89-139.11,44.5-215.47,23-25.14-7.09-63.33-22.12-63.71-22.27a31,31,0,1,0-22.74,57.68c1.68.66,41.45,16.31,69.62,24.26a298.1,298.1,0,0,0,81.65,11.31c60.51,0,115.67-17.65,169.54-34.88,71.54-22.89,139.12-44.5,215.48-23,25.1,7.08,63.22,22.08,63.71,22.27a31,31,0,0,0,22.74-57.68Z" />
                            <path
                                d="M711.37,571.16c-1.68-.66-41.45-16.31-69.62-24.26-94.31-26.61-174.07-1.1-251.2,23.57-71.53,22.89-139.1,44.5-215.47,23-25.14-7.09-63.33-22.12-63.71-22.27a31,31,0,1,0-22.74,57.68c1.68.66,41.45,16.31,69.62,24.26a298.1,298.1,0,0,0,81.65,11.31c60.51,0,115.67-17.65,169.54-34.88,71.54-22.89,139.12-44.5,215.48-23,25.1,7.08,63.22,22.08,63.71,22.27a31,31,0,0,0,22.74-57.68Z" />
                        </svg>

                        <span class="card-param-text_footer second">
                            %
                        </span>
                    </div>
                </div>
            </div>                 
        `;

    $card.querySelector('.card__head-left').prepend($icon);
    $card.querySelector('.card__head-left-title').prepend($title);
    $card.querySelector('.card__head-left-title').append($desc);
    $card.querySelector('.card-param__text').prepend($temp);
    $card.querySelector('.first').prepend($wind);
    $card.querySelector('.second').prepend($humidity);

    return {
        $card,
        $title,
        $temp,
        $desc,
        $wind,
        $humidity,
        $icon
    };
}

$locationForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const newCard = getNewCard();
    const location = $locationInput.value.trim();
    $locationInput.value = '';
    $cardsBox.prepend(newCard.$card);

    setTimeout(async () => {
        newCard.$card.classList.add('loading');      
        const data = await getWeatherData(location);

        if (!data) {
            newCard.$card.remove();
            return;
        }
        
        newCard.$icon.style.backgroundImage = `url(https:${data.current.condition.icon})`;
        newCard.$title.textContent = data.location.name;
        newCard.$desc.textContent = data.current.condition.text;
        newCard.$temp.textContent = data.current.temp_c;
        newCard.$wind.textContent = Math.round(data.current.wind_kph * 0.277778 * 10) / 10;
        newCard.$humidity.textContent = data.current.humidity;

        setTimeout(() => {
            document.querySelector('.app__container').classList.add('app__container_top');
            $body.style.backgroundSize = 'cover';
            $body.style.backgroundImage = getBackground(data.current.is_day, data.current.condition.text);

            if (currentCard) {
                currentCard.$card.classList.add('glass');
                currentCard.$card.classList.remove('current');
            }

            currentCard = newCard
            newCard.$card.classList.remove('loading');
            newCard.$card.classList.add('full');
            newCard.$card.classList.add('current');
            newCard.$card.addEventListener('click', onGlassCardClick);
        }, 600)
    }, 30)
})
