let bookingCanvas = document.getElementById("bookingContainer");
let bookingHtml = ``;
let seatRowName = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
let monthName = ['none', 'januar', 'februar','marts','april','maj','juni','juli','august','september','oktober','november','december',];
let seatRow = 0;
let seatCol = 1;
let stageRow;
let stageCol;
let stagePath;
let bookedSeats = [];
let curSeat;
let userBookedSeats = [];
let curBookedSeats = [];
let eventPrice;
let eventId = httpGet('event'); 

fetch(`http://localhost:3000/event?id=${eventId}`)
.then(function(response) {
    return response.json();
})
.then(function(bookedSeats) {
    let time = bookedSeats[0].time;
    let date = bookedSeats[0].date;
    time.toString();
    date.toString();
    let hour = time.substring(0,2);
    let minute = time.substring(2,4);
    let day = date.substring(0,2);
    let month = date.substring(2,4);
    let year = date.substring(4,8);
    eventPrice = bookedSeats[0].price;
    document.getElementById("bookingTitle").innerHTML = bookedSeats[0].title;
    document.getElementById("bookingDate").innerHTML = `${dateTimeDigit(day)} ${monthName[dateTimeDigit(month)]} ${year} kl. ${hour}:${minute}`;
    document.getElementById("bookingPrice").innerHTML = `Pris ${eventPrice} DKK stk.`;
    if(bookedSeats[0].id != eventId) {
        location.reload();
    }
});

fetch('http://localhost:3000/stage')
.then(function(response) {
    return response.json();
})
.then(function(stageData) {
    stageRow = stageData[0].rows;
    stageCol = stageData[0].columns;
    stagePath = stageData[0].path;
    fetch(`http://localhost:3000/bookedSeats?id=${eventId}`)
    .then(function(response) {
        return response.json();
    })
    .then(function(bookedSeats) {
        bookedSeats.forEach(element => {
            bookedSeats.push(element.seat);
        });
        bookingHtml += `<span class="stage">Lærred</span>`;
        while (stageRow > 0) {
            let tmpStageCol = stageCol;
            if(seatRow == stagePath) {
                bookingHtml += `<span class="stagePath"></span>`;
            }
            bookingHtml += `<span class="bookRow"><span class="seatRow">${seatRowName[seatRow]}</span>`;
            while (tmpStageCol > 0) {
                if(seatCol > stageCol)
                    seatCol = 1;
                curSeat = seatRowName[seatRow]+seatCol;
                curSeat.toString();
                if(bookedSeats.indexOf(curSeat) != -1) {
                    bookingHtml += `<span class="bookSeat seatTaken"></span>`;
                } else {
                    bookingHtml += `<span class="bookSeat seatAvaible" id="${seatRowName[seatRow]}${seatCol}" onclick="bookSeat('${seatRowName[seatRow]}${seatCol}')"></span>`;
                }
                tmpStageCol--;
                seatCol++;
            }
            bookingHtml += `</span>`;
            stageRow--;
            seatRow++;
        }
        bookingCanvas.innerHTML = bookingHtml;
        let canvasWidth = seatCol*43-30;
        bookingCanvas.style.width = `${canvasWidth}px`;
    });
});

//////// post reservation

document.querySelector('#bookingSubmit').addEventListener('click', (event) => {
    let bookingName = document.querySelector('#userFullname').value;
    let bookingmail = document.querySelector('#userEmail').value;
    let bookingPhone = document.querySelector('#userPhone').value;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let init = {
        method: 'POST',
        headers: headers,
        body: `{"name":"${bookingName}","mail":"${bookingmail}","phone":"${bookingPhone}","seats":"${curBookedSeats}"}`,
        cache: 'no-cache',
        mode: 'cors'
    };
    let request = new Request('http://localhost:3000/booking', init);

    if(bookingName.length > 5) {
        if(bookingName.length > 5) {
            if(bookingPhone.length > 5 && isNaN(bookingPhone) == false) {
                if(curBookedSeats.length == 0) {
                    alert('Ingen sæder reserveret.');
                } else {
                    fetch(request)
                    .then(response => {
                        return response.json();
                    })
                    .then((data) => { 
                        window.location.replace(`bookingcomplete?token=${data.token}`);
                    });
                }
            } else {
                alert('Dit mobil nummer er ikke korrekt.');
            } 
        } else {
            alert('Din e-mail er for kort.');
        } 
    } else {
        alert('Dit navn er for kort.');
    }
});

/////// navigation

fetch('http://localhost:3000/events')
.then(function(response) {
    return response.json();
})
.then(function(bookedSeats) {
    let eventCounter = 0;
    bookedSeats.forEach(element => {
        if(eventCounter < 5)
        document.getElementById("navEventDrop").innerHTML += `<a class="dropdown-item" href="booking?event=${element.id}">${element.title} </a>`;
        eventCounter++;
    });
});

///////

function dateTimeDigit(dateTime) {
    dateTime = dateTime.toString();
    if(dateTime.startsWith('0')) {
        return dateTime.substring(1,2);
    } else {
        return dateTime;
    }
}

function bookSeat(seat) {
    let clickedElement = document.getElementById(seat);
    if(curBookedSeats.indexOf(seat) != -1) {
        // remove class from seat
        clickedElement.classList.remove('seatBooked');
        curBookedSeats.splice(curBookedSeats.indexOf(seat), 1);
        updateSeats();
    } else {
        // add class to seat
        clickedElement.classList.add('seatBooked');
        curBookedSeats.push(seat);
        updateSeats();
    }
    function updateSeats() {
        let numSeats = curBookedSeats.length;
        let seatElement = document.getElementById("bookingSeats");
        let priceElement = document.getElementById("bookingSeatPrice");
        if(numSeats == 0) {
            seatElement.innerHTML = `Ingen sæder valgt.`;
            priceElement.innerHTML = `Samlet pris 0 DKK`;
        } else {
            if(numSeats > 1) {
                seatElement.innerHTML = `${numSeats} sæder valgt.<span id="bookingSeatsId">(${curBookedSeats.toString()})</span>`;
            } else {
                seatElement.innerHTML = `${numSeats} sæde valgt.<span id="bookingSeatsId">(${curBookedSeats.toString()})</span>`;
            }
            priceElement.innerHTML = `Samlet pris ${eventPrice*numSeats} DKK`;
        }
    }
}

function httpGet(id){
    var a = new RegExp(id+"=([^&#=]*)");
    return decodeURIComponent(a.exec(window.location.search)[1]);
}