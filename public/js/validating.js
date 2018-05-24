const curDate = new Date();

////////// validate //////////

function isEmail(email) {
    var expression = /\S+@\S+\.\S+/;
    return expression.test(email);
}

function isNumber(number) {
    if (!isNaN(number))
        return true;
    else
        return false;
}

////////// date //////////

function getWeekDay() {
    return curDate.getDay();
}

function getDate() {
    return curDate.getDate();
}

function getMonth() {
    return curDate.getMonth();
}

function getYear() {
    return curDate.getFullYear();
}

function createUnix(unix) {
    unix = unix.toString();
    return new Date(unix).valueOf();
} // YYYY-MM-DDTHH:MM:SSZ

////////// time //////////

function getMinutes() {
    return curDate.getMinutes();
}

function getHours() {
    return curDate.getHours();
}

function getSeconds() {
    return curDate.getSeconds();
}

////////// even number //////////

function isEven(number) { 
    if(number % 2 == 1)
        return false;
    else 
        return true;
}

function isOdd(number) { 
    if(number % 2 == 1)
        return true;
    else 
        return false;
}

////////// length //////////

function valueLength(value) { 
    value = value.toString();
    return value.length;
}

////////// two digits //////////

function twoDigit(value) {
    if(valueLength(value) == 1)
        return '0'+value;
    else
        return value;
}

////////// token //////////

function createToken() {
    return `${getMinutes()}${getYear()}`+Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 255)+`${getHours()}${getSeconds()}`;
}

////////// cookie //////////

function readCookie(cookieName) {
    let nameTmp = cookieName + "=";
    let ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameTmp) == 0) return c.substring(nameTmp.length,c.length);
    }
    return null;
}

function createCookie(cookieName, cookieValue, expireInDays) {
    let cookieDate = new Date();
    cookieDate.setTime(cookieDate.getTime() + (expireInDays*24*60*60*1000));
    let expires = "expires="+ cookieDate.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

function deleteCookie(cookieName) {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}