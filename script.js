let btn = document.getElementById("btn");
let backBtn = document.getElementById("back_btn");
let inps = document.getElementsByClassName("inps");
let prayersDiv = document.getElementById("prayers_div");

let dateArr = [];

btn.addEventListener("click", function () {
    processInput();
});

backBtn.addEventListener("click", function () {
    resetPage();
});

document.querySelectorAll('.inps').forEach(input => {
    input.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            processInput();
        }
    });
});

function processInput() {
    let inpsArr = Array.from(inps);
    dateArr = []; // Reset dateArr to avoid accumulation of previous inputs

    for (let i = 0; i < inpsArr.length; i++) {
        if (i == 0) {
            if (inpsArr[i].value > 31 || inpsArr[i].value < 1) {
                alert("Invalid day!!");
                return;
            } else {
                dateArr.push(inpsArr[i].value);
            }
        } else if (i == 1) {
            if (inpsArr[i].value > 12 || inpsArr[i].value < 1) {
                alert("Invalid month!!");
                return;
            } else {
                dateArr.push(inpsArr[i].value);
            }
        } else if (i == 2) {
            if (inpsArr[i].value > 2030 || inpsArr[i].value < 1970) {
                alert("Invalid year!!");
                return;
            } else {
                dateArr.push(inpsArr[i].value);
            }
        }
    }

    let prayersTime = document.getElementsByClassName("prayerTime");
    function get(day, month, year) {
        let req = new XMLHttpRequest();
        req.open("GET", `http://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=Cairo&country=Egypt`);
        req.send();
        req.responseType = "json";
        req.onload = function () {
            for (let i = 0; i < req.response.data.length; i++) {
                let apiDay = Number(req.response.data[i].date.gregorian.day);
                if (day == apiDay) {
                    let prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
                    for (let k = 0; k < prayers.length; k++) {
                        prayersTime[k].innerHTML = req.response.data[i].timings[prayers[k]];
                    }
                    btn.style.display = "none";
                    backBtn.style.display = "block";
                    inpsArr.forEach((inpArr) => {
                        inpArr.style.display = "none";
                    });
                    prayersDiv.style.visibility = "visible";
                }
            }
        };
    }

    get(dateArr[0], dateArr[1], dateArr[2]);
}

function resetPage() {
    let inpsArr = Array.from(inps);
    inpsArr.forEach((inpArr) => {
        inpArr.style.display = "block";
        inpArr.value = "";
    })
    prayersDiv.style.visibility = "hidden";
    btn.style.display = "block";
    backBtn.style.display = "none";
}
