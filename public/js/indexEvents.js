let monthName = ['none', 'jan', 'feb','mar','apr','maj','jun','jul','aug','sep','okt','nov','dec',];

fetch('http://localhost:3000/events')
.then(function(response) {
    return response.json();
})
.then(function(eventData) {
    let eventCounterNav = 0;
    let eventCounter = 0;
    eventData.forEach(element => {
        if(eventCounterNav < 5)
        document.getElementById("navEventDrop").innerHTML += `<a class="dropdown-item" href="booking?event=${element.id}">${element.title} </a>`;
        eventCounterNav++;
    });

    eventData.forEach(element => {
        let date = element.date;
        date.toString();
        let day = date.substring(0,2);
        let month = date.substring(2,4);

        if(eventCounter < 5)
        eventCounter++;
        document.getElementById("calendarEvent").innerHTML += `
        <a class="eventMain" href="booking?event=${element.id}">
            <div class="eventDate">
                <span class="eventDay">${dateTimeDigit(day)}.</span>
                <span class="eventMon">${monthName[dateTimeDigit(month)]}</span>
            </div>
            <h2 class="eventArtist">${element.title}</h2>
        </a>`;
    });
});

fetch('http://localhost:3000/news')
.then(function(response) {
    return response.json();
})
.then(function(newsData) {
    let newsContent = '';
    let newsLong = false;
    newsData.forEach(element => {
        let newsDate = new Date(Number(element.unix));
        let curDate = new Date();

        

        if(element.content.length > 200) {
            newsContent = element.content.substring(0,200)+'...';
            newsLong = true;
        } else {
            newsContent = element.content;
            newsLong = false;
        }
        document.getElementById("newsContainer").innerHTML += `
        <li class="newsItem">
            <h2 class="newsTitle">${element.title}</h2>
            <p class="newsContent">${newsContent}</p>`;
        if(newsLong == true) {
            document.getElementById("newsContainer").innerHTML += `<a class="newsLink" href="#">Læs mere her</a>`; 
        }
        document.getElementById("newsContainer").innerHTML += `<span class="newsDate">${newsDate.getDate()}</span>`;
        document.getElementById("newsContainer").innerHTML += `</li>`;
    });
});

function dateTimeDigit(dateTime) {
    dateTime = dateTime.toString();
    if(dateTime.startsWith('0')) {
        return dateTime.substring(1,2);
    } else {
        return dateTime;
    }
}