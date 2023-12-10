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

function showSampleReviews(reviews_data) {
    // show the 3 most recent negative reviews (quality < 4)
    let negative_reviews = reviews_data.filter(x => x[2] < 4).sort((a,b) => b[1] - a[1]).slice(0, 3);
    // show the 3 most recent positive reviews (quality >= 4) 
    let positive_reviews = reviews_data.filter(x => x[2] >= 4).sort((a,b) => b[1] - a[1]).slice(0, 3);

    // display all the lowest reviews
    for (let x of negative_reviews) {
        displayReview(x, "negative");
    }

    // display all the highest reviews
    for (let x of positive_reviews) {
        displayReview(x, "positive");
    }
    // adjust heights of adjacent reviews so that they match
    adjustAdjReviewHeights(negative_reviews, positive_reviews);
}

// below is the logic to make sure that the positive and negative reviews next to one another are the same height
// Ex.  PositiveReviews         NegativeReviews
//      PR1                     NR1
//      PR2                     NR2
//      PR3                     NR3
// the code makes sure that PRn (positive review n) and NRn (negative review n) are the same height, regardless of the amount of text in each of them
function getElementHeight(element) {
    let computedStyle = window.getComputedStyle(element);
    let heightExcludingPaddingAndBorder = element.offsetHeight - parseFloat(computedStyle.paddingTop) - parseFloat(computedStyle.paddingBottom) - parseFloat(computedStyle.borderTopWidth) - parseFloat(computedStyle.borderBottomWidth);
    return heightExcludingPaddingAndBorder;
}

function adjustAdjReviewHeights(negative_reviews, positive_reviews) {
    let shorterDiv = negative_reviews.length < positive_reviews.length ? document.querySelector(".negative-review") : document.querySelector(".positive-review");
    let longerDiv = negative_reviews.length < positive_reviews.length ? document.querySelector(".positive-review") : document.querySelector(".negative-review");

    let shorterChildren = shorterDiv.querySelectorAll(".professor-card");
    let longerChildren  = longerDiv.querySelectorAll(".professor-card");

    for (let i = 0; i < shorterChildren.length; i++) {
        let [shorterReview, longerReview] = [shorterChildren[i], longerChildren[i]];
        let biggerHeight = Math.max(getElementHeight(shorterReview), getElementHeight(longerReview));
        shorterReview.setAttribute("style", `height: ${biggerHeight}px`);
        longerReview.setAttribute("style", `height: ${biggerHeight}px`);
    }
}
