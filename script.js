let timerInterval;
let startTime;
let count = 0;
let clickTimes = [];
let clicksByHour = new Array(24).fill(0);
let alertTriggered = false;
let lastSubmissionTime = null;

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

function addDefaultEntry() {
    
    let numberValue = 'No input'; 

    const currentTime = new Date();
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const seconds = currentTime.getSeconds().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    let timeSinceLastSubmission = 'START'; 
    if (lastSubmissionTime) {
        const difference = currentTime - lastSubmissionTime; 
        const differenceSeconds = Math.floor(difference / 1000);
        const differenceMinutes = Math.floor(differenceSeconds / 60);
        timeSinceLastSubmission = `${differenceMinutes} minutes ${differenceSeconds % 60} seconds`;
    }
    lastSubmissionTime = currentTime; 

    
    const table = document.getElementById('dataTable');
    const newRow = table.insertRow();
    newRow.innerHTML = `<td>${numberValue}</td><td>${formattedTime}</td><td>${timeSinceLastSubmission}</td>`;
}


document.getElementById('countBtn').addEventListener('click', function() {
    addDefaultEntry();
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

function getCurrentDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`; 
}



document.getElementById('saveDataBtn').addEventListener('click', function saveData() {
    const counterValue = document.getElementById('clickCounter').innerText;
    const clickTimesData = clickTimes.map(click => `<div> #${click.order}: ${click.formattedTime}</div>`).join('');

    
    const table = document.getElementById('dataTable');
    const tableHTML = table.outerHTML;

    
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Counter Data</title>
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
        }
    </style>
</head>
<body>
    <h2>Total tickets: ${counterValue}</h2>
    <h3>Submission timers</h3>
    ${clickTimesData}
    <h3>Details:</h3>
    ${tableHTML}
</body>
</html>
    `;

    const currentDate = getCurrentDateString(); 
    const fileName = `counter_data_${currentDate}.html`; 

    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});


function addEntry() {
    const numberInput = document.getElementById('numberInput'); 
    let numberValue = numberInput.value; 

    
    if (numberValue.trim() === '') {
        numberValue = 'No input'; 
    }

    const currentTime = new Date();
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const seconds = currentTime.getSeconds().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    let timeSinceLastSubmission = 'START'; 
    if (lastSubmissionTime) {
        const difference = currentTime - lastSubmissionTime; 
        const differenceSeconds = Math.floor(difference / 1000);
        const differenceMinutes = Math.floor(differenceSeconds / 60);
        timeSinceLastSubmission = `${differenceMinutes} minutes ${differenceSeconds % 60} seconds`;
    }
    lastSubmissionTime = currentTime; 

    
    const table = document.getElementById('dataTable');
    const newRow = table.insertRow();
    newRow.innerHTML = `<td>${numberValue}</td><td>${formattedTime}</td><td>${timeSinceLastSubmission}</td>`;

    
    numberInput.value = ''; 
}



document.getElementById('numberInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addEntry();
    }
});

document.getElementById('submitBtn').addEventListener('click', function() {
    
    addEntry(); 

    
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
    document.getElementById('timer').innerText = "00:00:00";
    alertTriggered = false; 
    startTime = new Date(); 
    timerInterval = setInterval(updateTimer, 1000); 
});

document.getElementById('resetTableBtn').addEventListener('click', function() {
    resetTable();
});

function resetTable() {
    const table = document.getElementById('dataTable');
    
    for (let i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}

