let timerInterval;
let startTime;
let count = 0;
let clickTimes = [];
let clicksByHour = new Array(24).fill(0);
let alertTriggered = false;

function startTimerEvent() {
    clearInterval(timerInterval);
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const now = new Date();
    const elapsedTime = now - startTime; 
    
    let seconds = Math.floor((elapsedTime / 1000) % 60);
    let minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    
    const formattedTime = [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0')
    ].join(':');
    
    document.getElementById('timer').innerText = formattedTime;

    
    if (minutes >= 5 && !alertTriggered) {
       /* alert("5 minutes have passed!");
        alertTriggered = true; */
        //disabled the alert 
    }
}

document.getElementById('startBtn').addEventListener('click', startTimerEvent);

document.getElementById('countBtn').addEventListener('click', function() {
    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString();
    document.getElementById('clickCounter').innerText = ++count;

    const orderNumber = clickTimes.length + 1;
    clickTimes.push({ order: orderNumber, date: currentTime, formattedTime: formattedTime });

    displayClickTimes();

    const hour = currentTime.getHours();
    clicksByHour[hour]++;
    updateClicksByHourDisplay();

    clearInterval(timerInterval);
    seconds = minutes = hours = 0; 
    document.getElementById('timer').innerText = "00:00:00";
    alertTriggered = false; 
    startTime = new Date(); 
    timerInterval = setInterval(updateTimer, 1000); 
});

document.getElementById('resetBtn').addEventListener('click', function() {
    resetTimer();
    clicksByHour.fill(0);
    updateClicksByHourDisplay();
    displayClickTimes();
});

function resetTimer() {
    clearInterval(timerInterval);
    count = 0;
    clickTimes = [];
    document.getElementById('timer').innerText = "00:00:00";
    document.getElementById('clickCounter').innerText = 0;
    startTime = undefined;
    alertTriggered = false; 
}

function displayClickTimes() {
    const baseContainer = document.getElementById('clickDataContainer');
    let container = document.getElementById('clickTimes');
    if (!container) {
        container = document.createElement('div');
        container.id = 'clickTimes';
        baseContainer.appendChild(container);
    }
    
    let content = '<h3>Submission times:</h3>';
    clickTimes.forEach((click) => {
        content += `<div>#${click.order}: ${click.formattedTime}</div>`;
    });
    container.innerHTML = content;
}

function updateClicksByHourDisplay() {
    const baseContainer = document.getElementById('clickDataContainer');
    let container = document.getElementById('clicksByHour');
    if (!container) {
        container = document.createElement('div');
        container.id = 'clicksByHour';
        baseContainer.insertBefore(container, baseContainer.firstChild);
    }
    container.innerHTML = '<h3>Tickets in interval:</h3>';
    clicksByHour.forEach((count, hour) => {
        if (count > 0) {
            container.innerHTML += `<div>${hour}:00 - ${hour + 1}:00: ${count} tickets</div>`;
        }
    });
}

document.getElementById('saveDataBtn').addEventListener('click', function saveData() {
    const timerValue = document.getElementById('timer').innerText;
    const counterValue = document.getElementById('clickCounter').innerText;
    const clickTimesData = clickTimes.map(click => `Order #${click.order}: ${click.formattedTime}`).join('\n');
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
});