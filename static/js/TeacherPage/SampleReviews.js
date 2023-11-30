function displayReview(review_arr, posOrNeg) {
    // review_arr (list): [course, date, quality, difficultyRating, grade, ...]
    // posOrNeg (string): "positive" | "negative"
    let reviewDiv = document.querySelector(`.${posOrNeg}-review`);

    reviewDiv.innerHTML += `
        <div class="professor-card">
            <p class="course-code">${review_arr[0]}</p>
            <p class="rating">Rating: ${review_arr[2]}</p>
            <p class="difficulty">Difficulty: ${review_arr[3]}</p>
            <p class="timestamp">Posted on: ${review_arr[1]}</p>
            <div class="comments">
                <p>${review_arr[9]}</p>
            </div>
            <div>
                <p>ThumbsUp: ${review_arr[7]}</p>
            </div>
            <div>
                <p>ThumbsDown: ${review_arr[8]}</p>
            </div>
        </div>
    `
}

let lowest = reviews_data.filter(x => x[2] < 4).sort((a,b) => b[7] - a[7]).slice(0, 3);
let highest = reviews_data.filter(x => x[2] >= 4).sort((a,b) => b[7] - a[7]).slice(0, 3);
console.log(lowest);
console.log(highest);

for (let x of lowest) {
    displayReview(x, "negative");
}

for (let x of highest) {
    displayReview(x, "positive");
}
