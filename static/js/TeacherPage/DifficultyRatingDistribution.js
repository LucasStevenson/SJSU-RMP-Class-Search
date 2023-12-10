function map_class_to_difficultyRating(reviews_data) {
    // return a dict that maps a class to how difficult people found it (out of 5)
    let class_to_difficultyTuple = {}; // {class: [difficultyRatingSum, numReviews]}
    for (let [course_code, date, quality, difficulty, grade, helpfulRating, isOnlineClass] of reviews_data) {
        if (!(course_code in class_to_difficultyTuple)) {
            class_to_difficultyTuple[course_code] = [difficulty, 1];
            continue;
        }
        class_to_difficultyTuple[course_code][0] += difficulty;
        class_to_difficultyTuple[course_code][1]++;
    }
    let class_to_avgDifficulty = {};
    for (let [class_code, [difficulty, numReviews]] of Object.entries(class_to_difficultyTuple)) {
        let avgDifficulty = Math.round((difficulty/numReviews)*10)/10;
        class_to_avgDifficulty[`${class_code} (${numReviews})`] = avgDifficulty;
    }
    return class_to_avgDifficulty;
}

function plotDifficultyChart(reviews_data) {
    let class_to_avgDifficulty = map_class_to_difficultyRating(reviews_data);
    let course_codes = Object.keys(class_to_avgDifficulty);
    let avgDifficulties = Object.values(class_to_avgDifficulty);

    // Create a bar chart
    let diffCtx = document.getElementById('avgDifficulties');
    new Chart(diffCtx, {
        type: 'bar',
        data: {
            labels: course_codes,
            datasets: [{
                label: 'Grades',
                data: avgDifficulties,
                backgroundColor: [
                    'rgba(229, 168, 35, 0.4)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: top
                },
                title: {
                    display: true,
                    text: "Average difficulty per class",
                    font: { size: 18 }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Course Code (Number of Reviews)',
                        font: { size: 14, weight: "bold" }
                    },
                    type: 'category',
                    position: 'bottom'
                },
                y: {
                    title: {
                        display: true,
                        text: 'Average Difficulty',
                        font: { size: 14, weight: "bold" }
                    },
                    max: 5,
                    min: 0,
                    ticks: {
                        stepSize: 1,
                        autoSkip: false
                    }
                }
            }
        }
    });
}
