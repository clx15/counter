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
});

document.getElementById('saveDataBtn').addEventListener('click', saveData);

document.addEventListener('DOMContentLoaded', function() {
    updateClicksByHourDisplay(); // Initial display of clicks by hour
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
    document.getElementById('clickTimes').innerHTML = '';
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
    let container = document.getElementById('clicksByHour');
    if (!container) {
        container = document.createElement('div');
        container.id = 'clicksByHour';
        document.getElementById('app').appendChild(container);
    }
    container.innerHTML = '<h3>Clicks by Hour:</h3>';
    let contentAdded = false; // Track if any content is added

    clicksByHour.forEach((count, hour) => {
        if (count > 0) {
            // Only display intervals with clicks
            let displayHour = hour < 10 ? `0${hour}` : hour; // Format hour for display
            let nextHour = (hour + 1) % 24;
            let displayNextHour = nextHour < 10 ? `0${nextHour}` : nextHour;
            container.innerHTML += `<div>${displayHour}:00 - ${displayNextHour}:00: ${count} clicks</div>`;
            contentAdded = true;
        }
    });

    if (!contentAdded) {
        container.innerHTML += '<div>No clicks recorded yet.</div>';
    }
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

function displayClickTimes() {
    let clickTimesDisplay = clickTimes.map(click => click.formattedTime).join('<br>');
    const clickTimesElement = document.getElementById('clickTimes');
    if (!clickTimesElement) {
        const newElement = document.createElement('div');
        newElement.id = 'clickTimes';
        document.getElementById('app').appendChild(newElement);
    }
    document.getElementById('clickTimes').innerHTML = '<h3>Click Times:</h3>' + clickTimesDisplay;
}
