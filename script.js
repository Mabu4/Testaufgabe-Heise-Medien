

let news = [];
let weather = [];
let start = 0;
let end = 10;
let scrollEnd = false;
let cityInput = 'Berlin';


function init() {
    initNews();
    initWeather();
}


async function initNews(){
    const url = 'https://www.heise.de/extras/frontend/news/';
    const options = {
        headers: {
            'X-Heise-Token': 'zcJulkgE',
        }
    };
    let response = await fetch(url, options);
    news = await response.json();
    renderNews();
    console.log('news: ', news);
}


function renderNews(){

    for (let i = start; i < end; i++) {
        const element = news[i];
        document.getElementById('news').innerHTML += /*html*/`

        <div class="news-element" onclick="openDetailView(${element['id']})">
            <img class="news-element-image" src="${element['image']['src']}"  alt="${element['image']['alt']}">
            <div class="news-element-footer">
                <h3 class="news-element-date">${element['meta']['pubDate']}</h3>
                <h2 class="headline news-element-headline">${element['title']}</h2>
                <p class="paragraph news-element-paragraph">${element['synopsis']}</p>
            </div>
        </div>
        `;
    }
    scrollEnd = false;
}

async function initWeather(city){
    if(city){
        cityInput = city;
    }
    let apiKey = '9f2b47ee5924424199d215943222604';
    let url = (`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityInput}&lang=de`);
    let response = await fetch(url);
    weather = await response.json();
    console.log('Wetter: ', weather);
    renderWeather();
}

function renderWeather(){
    const temps = document.getElementsByClassName('temp');
    for (const temp of temps) {
        temp.innerHTML = weather['current']['temp_c'];
    }
    document.getElementById('city').innerHTML = weather['location']['name'];
    document.getElementById('condition').innerHTML = weather['current']['condition']['text'];
}


function changeCity(){
    let selectedCity = document.getElementById('selectedCity');
    initWeather(selectedCity.value);
    selectedCity.value = '';
}


function openDetailView(id) {
    console.log(id);
}


function activateLink(clickedElement){
    const links = document.getElementsByClassName('navbar-link');
    for (const link of links) {
        link.classList.remove('link-active');
    }
    clickedElement.classList.add('link-active');
}


window.onscroll = function(ev) {
    if ((window.innerHeight + window.scrollY + 400) >= document.body.offsetHeight && !scrollEnd) {
        scrollEnd = true;
        console.log('unten');
        if(end < 100){
            start = start + 10;
            end = end + 10;
            renderNews();
        }  
    }
};