let qualities = reviews_data.map(x => x[2]).reverse();
let dates = reviews_data.map(x => x[1].split(" ")[0]).reverse();

// Calculate the moving average
function calculateMovingAverage(data, windowSize) {
    let movingAverage = [];
    for (let i = 0; i < data.length; i++) {
        let startIdx = Math.max(i - windowSize + 1, 0);
        let endIdx = i + 1;
        let subset = data.slice(startIdx, endIdx);
        let avg = subset.reduce((acc, val) => acc + val, 0) / subset.length;
        movingAverage.push(avg);
    }
    return movingAverage;
}

// using window size 15. 
let smoothedData = calculateMovingAverage(qualities, 15);

// plot the data on a line graph
let progCtx = document.getElementById("progression");
new Chart(progCtx, {
    type: 'line',
    data: {
        labels: dates,
        datasets: [
        {
            label: 'Smoothed Ratings',
            data: smoothedData,
            borderColor: 'red',
            backgroundColor: 'transparent',
        }]
    },
    options: {
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: "Quality Ratings Over Time",
                font: { size: 18 }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date',
                    font: { size: 14, weight: "bold" }
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Quality',
                    font: { size: 14, weight: "bold" }
                },
                max: 5,
                min: 1,
                ticks: {
                    stepSize: 1,
                    autoSkip: false
                }
            }
        }
    }
});
