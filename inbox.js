const data = JSON.parse(sessionStorage.getItem('result'));
console.log(data);

let inSumApril = null;
let inSumMay = null;
let inSumJune = null;
let outSumApril = null;
let outSumMay = null;
let outSumJune = null;
const months = Object.keys(data);

for (let i in data) {
    for (let j in data[i]) {
        if (data[i][j].TYPE === 'Включение' && data[i][j].STATUS === 'Заключен') {
            if (i === 'april') {
                inSumApril = data.april[j]["Абонки по договору"] + inSumApril;
            } else if (i === 'may') {
                inSumMay = data.may[j]["Абонки по договору"] + inSumMay;
            } else if (i === 'june') {
                inSumJune = data.june[j]["Абонки по договору"] + inSumJune;
            }
        } else if (data[i][j].TYPE === 'Отключение договора' && data[i][j].STATUS === 'Расторгнут') {
            if (i === 'april') {
                outSumApril = data.april[j]["Абонки по договору"] + outSumApril;
            } else if (i === 'may') {
                outSumMay = data.may[j]["Абонки по договору"] + outSumMay;
            } else if (i === 'june') {
                outSumJune = data.june[j]["Абонки по договору"] + outSumJune;
            }
        }
    }
}

var options = {
    series: [{
        name: 'Месячная динамика',
        data: [inSumApril.toFixed(2), inSumMay.toFixed(2), inSumJune.toFixed(2)]
    }],
    chart: {
        height: 350,
        width: 500,
        type: 'bar',
    },
    plotOptions: {
        bar: {
            borderRadius: 10,
            dataLabels: {
                position: 'bottom', // top, center, bottom
            },
            distributed: true
        }
    },
    xaxis: {
        categories: months,
        position: 'top',
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        },
        tooltip: {
            enabled: true,
        }
    },
    yaxis: {
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false,
        },
        labels: {
            formatter: function (val) {
                return val.toFixed(2) + " р.";
            }
        }

    },
    title: {
        floating: true,
        offsetY: 330,
        align: 'center',
        style: {
            color: '#444'
        }
    }
};

const chart = new ApexCharts(document.getElementById("inboxChart"), options);
chart.render();


var optionsOut = {
    series: [{
        name: 'Месячная динамика',
        data: [outSumApril.toFixed(2), outSumMay.toFixed(2), outSumJune.toFixed(2)]
    }],
    chart: {
        height: 350,
        width: 500,
        type: 'bar',
    },
    plotOptions: {
        bar: {
            borderRadius: 10,
            dataLabels: {
                position: 'bottom', // top, center, bottom
            },
            distributed: true
        }
    },
    xaxis: {
        categories: months,
        position: 'top',
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        },
        tooltip: {
            enabled: true,
        }
    },
    yaxis: {
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false,
        },
        labels: {
            formatter: function (val) {
                return val.toFixed(2) + " р.";
            }
        }

    },
    title: {
        floating: true,
        offsetY: 330,
        align: 'center',
        style: {
            color: '#444'
        }
    }
};

const chartOutbox = new ApexCharts(document.getElementById("outboxChart"), optionsOut);
chartOutbox.render();


const inSum = inSumApril + inSumMay + inSumJune;
const outSum = Math.abs(outSumApril) + Math.abs(outSumMay) + Math.abs(outSumJune);
const sumAll = inSum + outSum;
const o = inSum * 100 / sumAll;
const d = outSum * 100 / sumAll;

var optionsPie = {
    series: [o, d],
    chart: {
        width: 380,
        type: 'pie',
    },
    labels: ['Включение', 'Отключение'],
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 200
            },
            legend: {
                position: 'bottom'
            }
        }
    }]
};

var chartPie = new ApexCharts(document.getElementById("pie"), optionsPie);
chartPie.render();


let inWeeksSumArr = [];
let outWeeksSumArr = [];
let weeksArr = [];
let week = null;
for (let m in data) {
    for (let w in data[m]) {
        if (data[m][w].hasOwnProperty('WEEK')) {
            week = data[m][w].WEEK;
            // weeksArr.findIndex(findWeek);
            // function findWeek(week) {
            //     return week ===
            // }
            if (!weeksArr.includes(week)) {
                if (data[m][w].TYPE === 'Включение' && data[m][w].STATUS === 'Заключен') {
                    weeksArr.push(data[m][w].WEEK);
                    inWeeksSumArr.push(data[m][w]['Абонки по договору']);
                } else if (data[m][w].TYPE === 'Отключение договора' && data[m][w].STATUS === 'Расторгнут') {
                    weeksArr.push(data[m][w].WEEK);
                    outWeeksSumArr.push(data[m][w]['Абонки по договору']);
                }
            } else {
                const curIndex = weeksArr.indexOf(week);
                if (data[m][w].TYPE === 'Включение' && data[m][w].STATUS === 'Заключен') {
                    if (!inWeeksSumArr[curIndex]) {
                        inWeeksSumArr.push(data[m][w]['Абонки по договору']);
                    } else {
                        inWeeksSumArr[curIndex] = inWeeksSumArr[curIndex] + data[m][w]['Абонки по договору'];
                    }
                } else if (data[m][w].TYPE === 'Отключение договора' && data[m][w].STATUS === 'Расторгнут') {
                    if (!outWeeksSumArr[curIndex]) {
                        outWeeksSumArr.push(Math.abs(data[m][w]['Абонки по договору']));
                    } else {
                        outWeeksSumArr[curIndex] = outWeeksSumArr[curIndex] + Math.abs(data[m][w]['Абонки по договору']);
                    }
                }
            }
        }
    }
}

let weekIn = null;
let weekOut = null;
let weekSum = null;
let weekInPie = null;
let weekOutPie = null;
for (let week in weeksArr) {
    const newWeekPieItem = document.createElement('div');
    newWeekPieItem.id = `${week}weekPieItem`;
    newWeekPieItem.style.display = 'none';

    weekIn = inWeeksSumArr[week];
    weekOut = outWeeksSumArr[week];
    weekSum = weekOut + weekIn;
    weekInPie = weekIn * 100 / weekSum;
    weekOutPie = weekOut * 100 / weekSum;
    var weekOptionsPie = {
        series: [weekInPie, weekOutPie],
        chart: {
            width: 380,
            type: 'pie',
        },
        labels: ['Включение', 'Отключение'],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };
    document.getElementById('weekPieWrapper').append(newWeekPieItem);
    var weekChartPie = new ApexCharts(document.getElementById(`${week}weekPieItem`), weekOptionsPie);
    weekChartPie.render();
}
for (let week in weeksArr) {
    const newWeekButton = document.createElement('button');
    const weekIndex = weeksArr.indexOf(weeksArr[week]);
    newWeekButton.id = `${weekIndex}week`;
    newWeekButton.className = 'weekButton';
    newWeekButton.innerHTML = weeksArr[week];
    document.getElementById('buttonsPieWrapper').append(newWeekButton);
}
const newWeekButtonClose = document.createElement('button');
newWeekButtonClose.id = 'newWeekButtonClose';
newWeekButtonClose.className = 'weekButtonClose';
newWeekButtonClose.setAttribute('onClick', 'unshowAll()');
newWeekButtonClose.innerHTML = 'Закрыть все';
document.getElementById('buttonsPieWrapper').append(newWeekButtonClose);

function unshowAll() {
    const allPiesItems = document.getElementById('weekPieWrapper').children;
    for (let p = 0; p < allPiesItems.length; p++) {
        allPiesItems[p].style.display = 'none';
        document.getElementById(`${p}week`).style.backgroundColor = '#00C0FF';
    }
}

const weekButtons = document.querySelectorAll('.weekButton');
for (let h = 0; h < weekButtons.length; h++) {
    (function (index) {
        weekButtons[index].addEventListener("click", function () {
            document.getElementById(`${index}week`).style.backgroundColor = '#008EFF';
            showNewGraph(index);
        });
    })(h);
}

function showNewGraph(i) {
    const itemPie = document.getElementById(`${i}weekPieItem`);
    if (itemPie.style.display === 'none') {
        itemPie.style.display = 'block';
    } else if (itemPie.style.display === 'block') {
        document.getElementById(`${i}week`).style.backgroundColor = '#00C0FF';
        itemPie.style.display = 'none';
    }
}


var weekOptionsOut = {
    chart: {
        height: 500,
        width: 900,
        type: "line",
        stacked: false
    },
    dataLabels: {
        enabled: false
    },
    colors: ["#4a8300", "#FF1654"],
    series: [
        {
            name: "Включения",
            data: inWeeksSumArr
        },
        {
            name: "Отключения",
            data: outWeeksSumArr
        }
    ],
    stroke: {
        width: [4, 4]
    },
    plotOptions: {
        bar: {
            columnWidth: "20%"
        }
    },
    xaxis: {
        categories: weeksArr
    },
    yaxis: [
        {
            labels: {
                formatter: function (val) {
                    return val.toFixed(2) + " р.";
                }
            }
        }
    ],
    legend: {
        horizontalAlign: "left",
        offsetX: 40
    }
};

const weekChartOutbox = new ApexCharts(document.getElementById("weekInboxChart"), weekOptionsOut);
weekChartOutbox.render();


// rating/anti-rating
let rating = {};
let antiRating = {};
let saleObj = {};

for (let m in data) {
    for (let w in data[m]) {
        if (data[m][w].hasOwnProperty('SALES')) {
            const sellerIndex = data[m][w].SALES;
            if (saleObj[sellerIndex] === undefined) {
                saleObj[sellerIndex] = data[m][w]["Абонки по договору"];
            } else {
                saleObj[sellerIndex] = saleObj[sellerIndex] + data[m][w]["Абонки по договору"];
            }

            if (data[m][w].TYPE === 'Включение') {
                if (rating[sellerIndex] === undefined) {
                    rating[sellerIndex] = data[m][w]["Абонки по договору"];
                } else {
                    rating[sellerIndex] = rating[sellerIndex] + data[m][w]["Абонки по договору"];
                }
            } else if (data[m][w].TYPE === 'Отключение договора' ||
                data[m][w].TYPE === 'Отключение услуги' ||
                data[m][w].TYPE === 'Отключение договора') {
                if (antiRating[sellerIndex] === undefined) {
                    antiRating[sellerIndex] = data[m][w]["Абонки по договору"];
                } else {
                    antiRating[sellerIndex] = antiRating[sellerIndex] - Math.abs(data[m][w]["Абонки по договору"]);
                }
            }
        }
    }
}

const arr = Object.entries(saleObj).sort(
    function (a, b) {
        return a[1] - b[1]
    }
);
const arrRating = Object.entries(rating).sort(
    function (a, b) {
        return a[1] > b[1] ? -1 : 1
    }
);
const arrAntiRating = Object.entries(antiRating).sort(
    function (a, b) {
        return a[1] - b[1]
    }
);
let summs = [];
for (let l = 0; l < arr.length; l++) {
    summs.push(arr[l][1]);
}

let summsRating = [];
for (let l = 0; l < arrRating.length; l++) {
    summsRating.push(arrRating[l][1]);
}

let summsAntiRating = [];
for (let l = 0; l < arrAntiRating.length; l++) {
    summsAntiRating.push(arrAntiRating[l][1]);
}

let sellers = [];
for (let l = 0; l < arr.length; l++) {
    sellers.push(arr[l][0]);
}

let sellersRating = [];
for (let l = 0; l < arrRating.length; l++) {
    sellersRating.push(arrRating[l][0]);
}

let sellersAntiRating = [];
for (let l = 0; l < arrAntiRating.length; l++) {
    sellersAntiRating.push(arrAntiRating[l][0]);
}

const arrObj = [];
for (let pair = 0; pair < arr.length; pair++) {
    let onePair = {};
    onePair[arr[pair][0]] = arr[pair][1];
    arrObj.push(onePair);
}

// for (let s = 0; s < arrObj.length; s++) {
//     for (let prop in arrObj[s]) {
//         const newString = document.createElement('div');
//         newString.className = 'newString';
//         const nameString = document.createElement('span');
//         nameString.innerHTML = prop;
//         const sumString = document.createElement('span');
//         sumString.innerHTML = arrObj[s][prop].toFixed(2);
//         newString.append(nameString);
//         newString.append(sumString);
//         document.getElementById('tableAll').append(newString);
//     }
// }

var ratingOpt = {
    series: [{
        name: 'Общая сумма включений продавца',
        data: summsRating
    }],
    chart: {
        type: 'bar',
        height: 1000,
        width: 1400,
        stacked: true,
    },
    dataLabels: {
        enabled: false
    },
    plotOptions: {
        bar: {
            horizontal: true,
            dataLabels: {
                position: 'bottom',
                tooltip: {
                    formatter: function (val) {
                        return val.toFixed(2) + " р."
                    }
                },
                total: {
                    enabled: true,
                    offsetX: 30,
                    offsetY: 8,
                    formatter: function (val) {
                        return val.toFixed(2)
                    }

                }
            }
        },
    },
    stroke: {
        width: 1,
        colors: ['#fff']
    },
    title: {
        text: 'Рейтинг продавцов',
        style: {
            fontSize: '24px',
            fontWeight: 'bolder'
        },
    },
    xaxis: {
        categories: sellersRating,
        labels: {
            formatter: function (val) {
                return val + " р."
            }
        }
    },
    yaxis: {
        title: {
            text: undefined
        },
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return val.toFixed(2) + " р."
            }
        }
    },
    fill: {
        opacity: 1
    },
    legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40
    }
};

var ratingChart = new ApexCharts(document.getElementById("rating"), ratingOpt);
ratingChart.render();

var antiRatingOpt = {
    series: [{
        name: 'Общая сумма отключений продавца',
        data: summsAntiRating
    }],
    chart: {
        type: 'bar',
        height: 2000,
        width: 1400,
        stacked: true,
    },
    dataLabels: {
        enabled: false
    },
    plotOptions: {
        bar: {
            horizontal: true,
            dataLabels: {
                position: 'bottom',
                tooltip: {
                    formatter: function (val) {
                        return val.toFixed(2) + " р."
                    }
                },
                total: {
                    enabled: true,
                    offsetX: 3,
                    offsetY: 8,
                    formatter: function (val) {
                        return val.toFixed(0)
                    }

                }
            }
        },
    },
    stroke: {
        width: 1,
        colors: ['#fff']
    },
    title: {
        text: 'Антирейтинг продавцов',
        style: {
            fontSize: '24px',
            fontWeight: 'bolder'
        },
    },
    xaxis: {
        categories: sellersAntiRating,
        labels: {
            formatter: function (val) {
                return val + " р."
            }
        }
    },
    yaxis: {
        title: {
            text: undefined
        },
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return val.toFixed(2) + " р."
            }
        }
    },
    fill: {
        opacity: 1
    },
    legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40
    }
};

var antiRatingChart = new ApexCharts(document.getElementById("antiRating"), antiRatingOpt);
antiRatingChart.render();


// services
// let allServices = {};
let inAllServices = {};
let outAllServices = {};
let oneService = {};
let count = 0;
let inInternet = {};
let outInternet = {};

function selectionSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        let min = i;
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j][1].sum < arr[min][1].sum) {
                min = j;
            }
        }
        const t = arr[min];
        arr[min] = arr[i];
        arr[i] = t;
    }
    return arr;
}

function selectionSortSpeed(arr) {
    for (let i = 0; i < arr.length; i++) {
        let min = i;
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j][1].speed < arr[min][1].speed) {
                min = j;
            }
        }
        const t = arr[min];
        arr[min] = arr[i];
        arr[i] = t;
    }
    return arr;
}

function findService(serviceObj, _curService) {
    let hasProp = [];
    for (let o in serviceObj) {
        if (serviceObj[o].service === _curService) {
            hasProp.push(o);
        }
    }
    return hasProp;
}

function findSpeed(serviceObj, _speed) {
    let hasProp = [];
    for (let o in serviceObj) {
        if (serviceObj[o].speed === _speed) {
            hasProp.push(o);
        }
    }
    return hasProp;
}

for (let m in data) {
    for (let w in data[m]) {
        if (data[m][w].hasOwnProperty('SERVICE') && data[m][w].hasOwnProperty('Абонки по договору')) {
            const curService = data[m][w].SERVICE;
            const curSum = data[m][w]['Абонки по договору'];
            const curSpeed = data[m][w].CHANNEL_SPEED_MB;
            oneService['sum'] = curSum;
            oneService['service'] = curService;
            oneService['speed'] = curSpeed;
            // if (Object.keys(allServices).length === 0) {
            //     allServices[count] = oneService;
            // } else {
            //     const resAll = findService(allServices, curService);
            //     if (resAll.length === 0) {
            //         allServices[count] = oneService;
            //     } else {
            //         allServices[resAll].sum += curSum;
            //     }
            // }
            if (data[m][w].TYPE === 'Включение') {
                if (Object.keys(inAllServices).length === 0) {
                    inAllServices[count] = oneService;
                } else {
                    const resIn = findService(inAllServices, curService);
                    if (resIn.length === 0) {
                        inAllServices[count] = oneService;
                    } else {
                        inAllServices[resIn].sum += curSum;
                    }
                }
                if (Object.keys(inInternet).length === 0 && data[m][w].SERVICE === 'Интернет') {
                    inInternet[count] = oneService;
                } else if (data[m][w].SERVICE === 'Интернет' && data[m][w].CHANNEL_SPEED_MB !== undefined) {
                    const resultInternet = findSpeed(inInternet, curSpeed);
                    if (resultInternet.length === 0) {
                        inInternet[count] = oneService;
                    } else {
                        inInternet[resultInternet].sum += curSum;
                    }
                }
            }
            if (data[m][w].TYPE === 'Отключение договора' ||
                data[m][w].TYPE === 'Отключение услуги' ||
                data[m][w].TYPE === 'Отключение договора') {
                if (Object.keys(outAllServices).length === 0) {
                    outAllServices[count] = oneService;
                } else {
                    const resOut = findService(outAllServices, curService);
                    if (resOut.length === 0) {
                        outAllServices[count] = oneService;
                    } else {
                        outAllServices[resOut].sum += curSum;
                    }
                }
                if (Object.keys(outInternet).length === 0 && data[m][w].SERVICE === 'Интернет') {
                    outInternet[count] = oneService;
                } else if (data[m][w].SERVICE === 'Интернет') {
                    const resultInternet = findSpeed(outInternet, curSpeed);
                    if (resultInternet.length === 0) {
                        outInternet[count] = oneService;
                    } else {
                        outInternet[resultInternet].sum += curSum;
                    }
                }
            }
            oneService = {};
            count++;
        }
    }
}

// const sortArrServices = selectionSort(Object.entries(allServices));
const sortInArrServices = selectionSort(Object.entries(inAllServices));
const sortOutArrServices = selectionSort(Object.entries(outAllServices));
const sortInInternet = selectionSort(Object.entries(inInternet));
const sortOutInternet = selectionSort(Object.entries(outInternet));
let inNameServices = [];
let inSumServices = [];
let outNameServices = [];
let outSumServices = [];
let inInternetSpeed = [];
let inSumInternet = [];
let outInternetSpeed = [];
let outSumInternet = [];
for (let i = sortInArrServices.length - 1; i >= 0; i--) {
    inSumServices.push(sortInArrServices[i][1].sum);
    inNameServices.push(sortInArrServices[i][1].service);
}
for (let i = 0; i < sortOutArrServices.length; i++) {
    outSumServices.push(sortOutArrServices[i][1].sum);
    outNameServices.push(sortOutArrServices[i][1].service);
}
for (let i = sortInInternet.length - 1; i >= 0; i--) {
    inSumInternet.push(sortInInternet[i][1].sum);
    inInternetSpeed.push(sortInInternet[i][1].speed);
}
for (let i = 0; i < sortOutInternet.length; i++) {
    outSumInternet.push(sortOutInternet[i][1].sum);
    outInternetSpeed.push(sortOutInternet[i][1].speed);
}



var serviceRatingOpt = {
    series: [{
        name: 'Общая сумма включений по услуге',
        data: inSumServices
    }],
    chart: {
        type: 'bar',
        height: 500,
        width: 700,
        stacked: true,
    },
    dataLabels: {
        enabled: false
    },
    plotOptions: {
        bar: {
            horizontal: true,
            dataLabels: {
                position: 'bottom',
                tooltip: {
                    formatter: function (val) {
                        return val.toFixed(2) + " р."
                    }
                },
                total: {
                    enabled: true,
                    offsetX: 30,
                    offsetY: 8,
                    formatter: function (val) {
                        return val.toFixed(2)
                    }

                }
            }
        },
    },
    stroke: {
        width: 1,
        colors: ['#fff']
    },
    title: {
        text: 'Рейтинг услуг',
        style: {
            fontSize: '24px',
            fontWeight: 'bolder'
        },
    },
    xaxis: {
        categories: inNameServices,
        labels: {
            formatter: function (val) {
                return val + " р."
            }
        }
    },
    yaxis: {
        title: {
            text: undefined
        },
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return val.toFixed(2) + " р."
            }
        }
    },
    fill: {
        opacity: 1
    },
    legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40
    }
};

var serviceRatingChart = new ApexCharts(document.getElementById("serviceRating"), serviceRatingOpt);
serviceRatingChart.render();

var serviceAntiRatingOpt = {
    series: [{
        name: 'Общая сумма отключений по услуге',
        data: outSumServices
    }],
    chart: {
        type: 'bar',
        height: 500,
        width: 700,
        stacked: true,
    },
    dataLabels: {
        enabled: false
    },
    plotOptions: {
        bar: {
            horizontal: true,
            dataLabels: {
                position: 'bottom',
                tooltip: {
                    formatter: function (val) {
                        return val.toFixed(2) + " р."
                    }
                },
                total: {
                    enabled: true,
                    offsetX: 3,
                    offsetY: 8,
                    formatter: function (val) {
                        return val.toFixed(0)
                    }

                }
            }
        },
    },
    stroke: {
        width: 1,
        colors: ['#fff']
    },
    title: {
        text: 'Антирейтинг услуг',
        style: {
            fontSize: '24px',
            fontWeight: 'bolder'
        },
    },
    xaxis: {
        categories: outNameServices,
        labels: {
            formatter: function (val) {
                return val + " р."
            }
        }
    },
    yaxis: {
        title: {
            text: undefined
        },
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return val.toFixed(2) + " р."
            }
        }
    },
    fill: {
        opacity: 1
    },
    legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40
    }
};

var serviceAntiRatingChart = new ApexCharts(document.getElementById("serviceAntiRating"), serviceAntiRatingOpt);
serviceAntiRatingChart.render();


var internetRatingOpt = {
    series: [{
        name: 'Общая сумма включений по интернету',
        data: inSumInternet
    }],
    chart: {
        type: 'bar',
        height: 500,
        width: 700,
        stacked: true,
    },
    dataLabels: {
        enabled: false
    },
    plotOptions: {
        bar: {
            horizontal: true,
            dataLabels: {
                position: 'bottom',
                tooltip: {
                    formatter: function (val) {
                        return val.toFixed(2) + " р."
                    }
                },
                total: {
                    enabled: true,
                    offsetX: 30,
                    offsetY: 8,
                    formatter: function (val) {
                        return val.toFixed(2)
                    }

                }
            }
        },
    },
    stroke: {
        width: 1,
        colors: ['#fff']
    },
    title: {
        text: 'Рейтинг услуг',
        style: {
            fontSize: '24px',
            fontWeight: 'bolder'
        },
    },
    xaxis: {
        categories: inInternetSpeed,
        labels: {
            formatter: function (val) {
                return val + " р."
            }
        }
    },
    yaxis: {
        title: {
            text: undefined
        },
        labels: {
            formatter: function (val) {
                return val.toFixed(0) + ' мб/с';
            }
        }
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return val.toFixed(2) + " р."
            }
        }
    },
    fill: {
        opacity: 1
    },
    legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40
    }
};

var internetRatingChart = new ApexCharts(document.getElementById("internetRating"), internetRatingOpt);
internetRatingChart.render();

var internetAntiRatingOpt = {
    series: [{
        name: 'Общая сумма отключений по интернету',
        data: outSumInternet
    }],
    chart: {
        type: 'bar',
        height: 500,
        width: 680,
        stacked: true,
    },
    dataLabels: {
        enabled: false
    },
    plotOptions: {
        bar: {
            horizontal: true,
            dataLabels: {
                position: 'bottom',
                tooltip: {
                    formatter: function (val) {
                        return val.toFixed(2) + " р."
                    }
                },
                total: {
                    enabled: true,
                    offsetX: 3,
                    offsetY: 8,
                    formatter: function (val) {
                        return val.toFixed(0)
                    }

                }
            }
        },
    },
    stroke: {
        width: 1,
        colors: ['#fff']
    },
    title: {
        text: 'Антирейтинг по интернету',
        style: {
            fontSize: '24px',
            fontWeight: 'bolder'
        },
    },
    xaxis: {
        categories: outInternetSpeed,
        labels: {
            formatter: function (val) {
                return val + " р."
            }
        }
    },
    yaxis: {
        title: {
            text: undefined
        },
        labels: {
            formatter: function (val) {
                return val.toFixed(0) + ' мб/с';
            }
        }
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return val.toFixed(2) + " р."
            }
        }
    },
    fill: {
        opacity: 1
    },
    legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40
    }
};

var internetAntiRatingChart = new ApexCharts(document.getElementById("internetAntiRating"), internetAntiRatingOpt);
internetAntiRatingChart.render();