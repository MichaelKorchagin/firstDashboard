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
};
let summsRating = [];
for (let l = 0; l < arrRating.length; l++) {
    summsRating.push(arrRating[l][1]);
};
let summsAntiRating = [];
for (let l = 0; l < arrAntiRating.length; l++) {
    summsAntiRating.push(arrAntiRating[l][1]);
};
let sellers = [];
for (let l = 0; l < arr.length; l++) {
    sellers.push(arr[l][0]);
};
let sellersRating = [];
for (let l = 0; l < arrRating.length; l++) {
    sellersRating.push(arrRating[l][0]);
};
let sellersAntiRating = [];
for (let l = 0; l < arrAntiRating.length; l++) {
    sellersAntiRating.push(arrAntiRating[l][0]);
};
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
            fontSize:  '24px',
            fontWeight:  'bolder'
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
    }};

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
            fontSize:  '24px',
            fontWeight:  'bolder'
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
    }};

var antiRatingChart = new ApexCharts(document.getElementById("antiRating"), antiRatingOpt);
antiRatingChart.render();