let monthName = ['December', 'Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November'];
let curDate = new Date();
let month = curDate.getMonth()+1;
let year = 2018;
let date = new Date(year, month);
let monthDays = date.getUTCDate();

for (cDays = 1; cDays < monthDays+1; cDays++) { 
    console.log(cDays);
}
