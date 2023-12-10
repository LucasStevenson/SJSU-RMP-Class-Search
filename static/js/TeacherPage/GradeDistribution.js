let grade_int_to_letter = {
    4: "A",
    3.75: "A-",
    3.5: "B+",
    3.25: "B",
    3: "B",
    2.75: "B-",
    2.5: "C+",
    2.25: "C",
    2: "C-",
    1.75: "D+",
    1.5: "D",
    1: "D-",
    0.75: "F",
    0.5: "F",
};

function map_class_to_avgGrade(reviews_data) {
    let grade_to_GPA = {
        "A+": 4,
        "A": 4,
        "A-": 3.7,
        "B+": 3.3,
        "B": 3,
        "B-": 2.7,
        "C+": 2.3,
        "C": 2,
        "C-": 1.7,
        "D+": 1.3,
        "D": 1,
        "D-": 0.7,
        "F": 0,
        "Incomplete": 0,
        "Rather not say": 2
    };

    let class_to_gradeTuple = {}; // {"CS123": (sumOfGrades, numGrades)}
    for (let [course_code, date, quality, difficulty, grade, helpfulRating, isOnlineClass] of reviews_data) {
        if (!(grade in grade_to_GPA)) continue;
        let gpa = grade_to_GPA[grade];
        if (!(course_code in class_to_gradeTuple)) {
            class_to_gradeTuple[course_code] = [gpa, 1];
        } else {
            class_to_gradeTuple[course_code][0] += gpa;
            class_to_gradeTuple[course_code][1]++;
        }
    }
    let class_to_avgGrade = {};
    for (let [class_code, [summed_grades, numReviews]] of Object.entries(class_to_gradeTuple)) {
        let avgGrade = summed_grades / numReviews;
        class_to_avgGrade[`${class_code} (${numReviews})`] = Math.max(Math.round(avgGrade/0.25)*0.25, 0.5);
    }
    return class_to_avgGrade;
}

function plotGradesChart(reviews_data) {
    let class_to_avgGrade = map_class_to_avgGrade(reviews_data);
    console.log(class_to_avgGrade);
    let labels = Object.keys(class_to_avgGrade);
    let values = Object.values(class_to_avgGrade);

    // Create a bar chart
    let gradesCtx = document.getElementById('avgGrades');
    new Chart(gradesCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Grades',
                data: values,
                backgroundColor: [
                    // 'rgba(229, 168, 35, 0.4)',
                    'rgba(0, 86, 162, 0.4)',
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
                    text: "Average grades per class",
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
                        text: 'Average Grade',
                        font: { size: 14, weight: "bold" }
                    },
                    min: 0,
                    max: 4,
                    ticks: {
                        callback: function(value, index, ticks) {
                            return grade_int_to_letter[value];
                        }
                    }
                }
            }
        }
    });
}
