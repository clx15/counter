let timerInterval;
let count = 0;
let seconds = 0, minutes = 0, hours = 0;
let clickTimes = []; // Array to store date objects and formatted times of button clicks
let clicksByHour = new Array(24).fill(0); // Array to track clicks by hour

document.getElementById('startBtn').addEventListener('click', startTimerEvent);

document.getElementById('countBtn').addEventListener('click', function() {
    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString();
    document.getElementById('clickCounter').innerText = ++count;
    clickTimes.push({date: currentTime, formattedTime: formattedTime}); // Store the click time with full date object
    displayClickTimes();

    const hour = currentTime.getHours();
    clicksByHour[hour]++; // Increment the click count for the current hour
    updateClicksByHourDisplay(); // Update clicks by hour display

    // Reset and restart the timer
    clearInterval(timerInterval);
    seconds = minutes = hours = 0;
    document.getElementById('timer').innerText = "00:00:00";
    timerInterval = setInterval(startTimer, 1000);
});

document.getElementById('resetBtn').addEventListener('click', function() {
    resetTimer();
    clicksByHour.fill(0); // Reset the clicksByHour array
    updateClicksByHourDisplay(); // Update the display
    displayClickTimes(); // Update click times display
});

document.getElementById('saveDataBtn').addEventListener('click', saveData);

// Ensure display areas are updated on page load
document.addEventListener('DOMContentLoaded', function() {
    updateClicksByHourDisplay(); // Initial display of clicks by hour
    displayClickTimes(); // Display click times initially
});

function startTimerEvent() {
    clearInterval(timerInterval);
    timerInterval = setInterval(startTimer, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    seconds = minutes = hours = count = 0;
    clickTimes = [];
    document.getElementById('timer').innerText = "00:00:00";
    document.getElementById('clickCounter').innerText = 0;
}

function startTimer() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
    document.getElementById('timer').innerText = 
        (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + 
        (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + 
        (seconds > 9 ? seconds : "0" + seconds);
}

function updateClicksByHourDisplay() {
    const baseContainer = document.getElementById('clickDataContainer');
    let container = document.getElementById('clicksByHour');
    if (!container) {
        container = document.createElement('div');
        container.id = 'clicksByHour';
        baseContainer.insertBefore(container, baseContainer.firstChild); // Insert at the beginning
    }
    container.innerHTML = '<h3>Tickets by Hour:</h3>';
    clicksByHour.forEach((count, hour) => {
        if (count > 0) {
            container.innerHTML += `<div>${hour}:00 - ${hour + 1}:00: ${count} tickets</div>`;
        }
    });
}

function displayClickTimes() {
    const baseContainer = document.getElementById('clickDataContainer');
    let container = document.getElementById('clickTimes');
    if (!container) {
        container = document.createElement('div');
        container.id = 'clickTimes';
        if (baseContainer.lastChild && baseContainer.lastChild.id === 'clicksByHour') {
            baseContainer.appendChild(container); // Ensures it comes after clicks by hour
        } else {
            baseContainer.insertBefore(container, null); // Insert at the end if for some reason clicks by hour isn't there
        }
    }
    let content = clickTimes.map(click => click.formattedTime).join('<br>');
    container.innerHTML = `<h3>Ticket times:</h3>${content}`;
}

function saveData() {
    const timerValue = document.getElementById('timer').innerText;
    const counterValue = document.getElementById('clickCounter').innerText;
    const clickTimesData = clickTimes.map(click => click.formattedTime).join('\n');
    const data = `Timer: ${timerValue}\nClick Counter: ${counterValue}\nClick Times:\n${clickTimesData}`;
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'counter_data.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
