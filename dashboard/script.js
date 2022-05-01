
let news = [];
let weather = [];
let newsDetails = [];
let start = 0;
let end = 10;
let scrollEnd = false;
let cityInput = 'Berlin';
let openedDetailView = false;

/**
 * This function is called first when the page loads and starts the functions initNews and initWeather
 * 
 * 
 */
function init() {
    initNews();
    initWeather();
    openedDetailView = false;
}

/**
 * This function is called first when the detail view is opened and starts the functions initNewsDetail and init Weather
 * 
 * 
 */
function initDetailView(){
    initNewsDetail();
    initWeather();
    openedDetailView = true;
}

/**
 * This function loads the news from the Heise-API and push them into the news Array
 * 
 * 
 */
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
}
 
/**
 * This function adds the informations from the news Array in the HTML document
 * 
 * 
 */
function renderNews(){

    for (let i = start; i < end; i++) {
        const element = news[i];
        getSortedDate(element);
        document.getElementById('news').innerHTML += /*html*/`

        <div class="news-element" onclick="openDetailView(${element['id']})">
            <img class="news-element-image" src="${element['image']['src']}"  alt="${element['image']['alt']}">
            <div class="news-element-footer">
                <h3 class="news-element-date">${date}</h3>
                <h2 class="headline news-element-headline">${element['title']}</h2>
                <p class="paragraph news-element-paragraph">${element['synopsis']}</p>
            </div>
        </div>
        `;
    }
    scrollEnd = false;
}

/**
 * This function sorts the delivered date stamp
 * 
 * @param {array} element - This is the message where the date needs to be sorted
 * @returns 
 */
function getSortedDate(element){
    let separateDate = element['meta']['pubDate'].split('T');
    let unsortedDate = separateDate[0].split('-');
    return date = unsortedDate[2] + '.' + unsortedDate[1] + '.' + unsortedDate[0];
}

/**
 * This function loads the weather informations from the weatherAPI and push them into the weather Array
 * 
 * @param {string} city - This is the city from which the information is loaded
 */
async function initWeather(city){
    if(city){
        cityInput = city;
    }
    let apiKey = '9f2b47ee5924424199d215943222604';
    let url = (`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityInput}&lang=de`);
    let response = await fetch(url);
    weather = await response.json();
    renderWeather();
}

/**
 * This function adds the weather informations in the HTML document
 * 
 * 
 */
function renderWeather(){
    const temps = document.getElementsByClassName('temp');
    for (const temp of temps) {
        temp.innerHTML = weather['current']['temp_c'];
    }
    const citys = document.getElementsByClassName('city');
    for (const city of citys) {
        city.innerHTML = weather['location']['name'];
    }
    const conditions = document.getElementsByClassName('condition');
    for (const condition of conditions) {
        condition.innerHTML = weather['current']['condition']['text'];
    }
}

/**
 * This function is called when the visitor searches for the weather of a particular city
 * 
 * 
 */
function changeCity(type){
    if(type == 'desktop'){
        let selectedCity = document.getElementById('selectedCity');
        initWeather(selectedCity.value);
        selectedCity.value = '';
    }
    if(type == 'mobile'){
        let selectedCity = document.getElementById('selectedCityMobile');
        initWeather(selectedCity.value);
        selectedCity.value = '';
    }    
}

/**
 * This function is called when the visitor clicks on a news element from the startpage
 * 
 * @param {number} id - This is the id from which news the detail view is opened
 */
function openDetailView(id) {
    localStorage.setItem("id", id);
    window.open('news-detail.html',"_self");
}

/**
 * This function loads the detailed news from the heise API with the saved id in the local storage
 * 
 * 
 */
async function initNewsDetail(){
    let id = localStorage.getItem("id");
    const url = `https://www.heise.de/extras/frontend/news/${id}`;
    const options = {
        headers: {
            'X-Heise-Token': 'zcJulkgE',
        }
    };
    let response = await fetch(url, options);
    newsDetails = await response.json();
    renderNewsDetail();
}

/**
 * This function adds the news informations in the HTML document
 * 
 * 
 */
function renderNewsDetail(){
    getSortedDate(newsDetails);
    document.getElementById('detail-view').innerHTML = /*html*/`
        <h2 class="detail-view-title">${newsDetails['title']}</h2>
        <p class="detail-view-infos">
            <span>von: <span>${newsDetails['meta']['author']}</span></span>
            <span>${date}</span>
        </p>
        <p class="detail-view-synopsis"> 
            ${newsDetails['synopsis']}
        </p>
        <img class="detail-view-image" src="${newsDetails['image']['src']}" alt="${newsDetails['image']['alt']}">
        <p class="detail-view-content">${newsDetails['content']}</p>
    `;
}

/**
 * This function opens the startpage
 * 
 * 
 */
function openStartpage() {
    window.open('index.html',"_self");
}

/**
 * This function opens the menu of the mobile version
 * 
 * 
 */
function openMobileMenu(){
    document.getElementById('weather').classList.add('d-none');
    document.getElementById('mobile-menu').classList.remove('d-none');
    
}

/**
 * This function closes the menu of the mobile Version
 * 
 * 
 */
function closeMobileMenu(){
    document.getElementById('weather').classList.remove('d-none');
    document.getElementById('mobile-menu').classList.add('d-none');
}

/**
 * This function is called by clicking on a link from the navigation and set the border at top and bottom
 * 
 * @param {object} clickedElement - This is the element that gets the border at the top and bottom
 */
function activateLink(clickedElement){
    const links = document.getElementsByClassName('navbar-link');
    for (const link of links) {
        link.classList.remove('link-active');
    }
    clickedElement.classList.add('link-active');
}

/**
 * This function is called when the user scroll to bottom and load more news
 * 
 * 
 */
window.onscroll = function() {
    if ((window.innerHeight + window.scrollY + 400) >= document.body.offsetHeight && !scrollEnd) {
        scrollEnd = true;
        if(end < 100 && !openedDetailView){
            start = start + 10;
            end = end + 10;
            renderNews();
        }  
    }
};

/**
 * This function is used to load html templates in a document
 * 
 * @returns
 */
function includeHTML() {
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain atrribute:*/
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
            /* Make an HTTP request using the attribute value as the file name: */
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        elmnt.innerHTML = this.responseText;
                    }
                    if (this.status === 404) {
                        elmnt.innerHTML = "Page not found.";
                    }
                    /* Remove the attribute, and call this function once more: */
                    elmnt.removeAttribute("w3-include-html");
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            /* Exit the function: */
            return;
        }
    }
}