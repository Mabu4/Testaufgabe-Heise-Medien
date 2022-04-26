

let news = [];
let start = 0;
let end = 10;
let scrollEnd = false;
const url = 'https://www.heise.de/extras/frontend/news/';

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

async function init() {
    let response = await fetch(url, {
        headers: {
            'X-Heise-Token': 'zcJulkgE',
        }
    });
    news = await response.json();
    // renderTopNews();
    renderNews();
    console.log('news: ', news);
}


function renderNews(){

    for (let i = start; i < end; i++) {
        const element = news[i];
        document.getElementById('news').innerHTML += /*html*/`

        <div class="news-element" onclick="openDetailView(${element['id']})">
            <img class="news-element-image" src="${element['image']['src']}"  alt="${element['image']['alt']}">
            <h3 class="news-element-date">${element['meta']['pubDate']}</h3>
            <h2 class="headline news-element-headline">${element['title']}</h2>
            <p class="paragraph news-element-paragraph">${element['synopsis']}</p>
        </div>
        `;
    }
    scrollEnd = false;
}

function openDetailView() {

}