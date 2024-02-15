let timerInterval;
let count = 0;
let seconds = 0, minutes = 0, hours = 0;
let clickTimes = []; // Array to store date objects and formatted times of button clicks

document.getElementById('startBtn').addEventListener('click', startTimerEvent);

document.getElementById('countBtn').addEventListener('click', function() {
    const currentTime = new Date(); // Capture the current time
    const formattedTime = currentTime.toLocaleTimeString(); // Format time to a readable format
    document.getElementById('clickCounter').innerText = ++count;
    clickTimes.push({date: currentTime, formattedTime: formattedTime}); // Store the click time with full date object
    displayClickTimes();

    // Reset and restart the timer
    clearInterval(timerInterval);
    seconds = minutes = hours = 0;
    document.getElementById('timer').innerText = "00:00:00";
    timerInterval = setInterval(startTimer, 1000);
});

document.getElementById('resetBtn').addEventListener('click', resetTimer);

document.getElementById('saveDataBtn').addEventListener('click', saveData);

document.getElementById('countIntervalBtn').addEventListener('click', function() {
    const startHour = parseInt(document.getElementById('startHour').value, 10);
    const endHour = parseInt(document.getElementById('endHour').value, 10);
    const count = countClicksInInterval(startHour, endHour);
    document.getElementById('clicksInInterval').innerText = count;
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
    document.getElementById('clicksInInterval').innerText = '0';
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

function countClicksInInterval(startHour, endHour) {
    return clickTimes.filter(click => {
        const hour = click.date.getHours();
        return hour >= startHour && hour < endHour;
    }).length;
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
    document.body.appendChild(a); // Temporarily add the link to the document
    a.click(); // Trigger the download
    document.body.removeChild(a); // Clean up
    URL.revokeObjectURL(url); // Release the object URL
}
