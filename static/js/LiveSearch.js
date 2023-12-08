function addColorToTable() {
    let instruct_ratings = document.querySelectorAll(".instruct-rating");
    // logic to update the color of the instructor rating on the table depending on their rating
    for (let rating_tag of instruct_ratings) {
        if (isNaN(rating_tag.innerText)) continue;
        let rating = parseFloat(rating_tag.innerText);
        if (0 <= rating && rating < 3) {
            rating_tag.style.backgroundColor = "rgb(255, 156, 156)"; // red
        } else if (3 <= rating && rating < 3.7) {
            rating_tag.style.backgroundColor = "rgb(255, 241, 112)"; // yellow
        } else {
            rating_tag.style.backgroundColor = "rgb(127, 246, 195)"; // green
        }
    }
}

function updateTableData(trie_results, courseCode_to_classData, teacherName_to_legacyID) {
    let tableBody = document.getElementById("table-body");

    // clear all the data that is currently inside the table body
    tableBody.innerHTML = '';

    for (let i = (page-1)*RESULTS_PER_PAGE; i < Math.min(trie_results.length, RESULTS_PER_PAGE*page); i++) {
        let classData = courseCode_to_classData[trie_results[i]]; // the table row data
        let data = `
        <tr>
            <td class="class-section">${classData[0]}</td>
            <td class="class-number">${classData[1]}</td>
            <td class="mode-instruct">${classData[2]}</td>
            <td class="course-title">${classData[3]}</td>
            <td class="class-units">${classData[4]}</td>
            <td class="class-type">${classData[5]}</td>
            <td class="class-days">${classData[6]}</td>
            <td class="class-times">${classData[7]}</td>
            <td class="class-instruct">
        `
        if (classData[8] in teacherName_to_legacyID) {
            data += `<a href="https://ratemyprofessors.com/professor/${teacherName_to_legacyID[classData[8]]}" target="_blank">${classData[8]}</a>`;
        } else {
            data += `${classData[8]}`;
        }
        if (classData[9] !== "N/A") {
            data += `<td class="instruct-rating"><a href='/teacher/${classData[8]}'><b>${classData[9]}</b></a></td>`;
        } else {
            data += `<td class="instuct-rating"><b>${classData[9]}</b></td>`;
        }
        data += `
            <td class="class-location">${classData[10]}</td>
            <td class="class-dates">${classData[11]}</td>
            <td class="open-seats">${classData[12]}</td>
        </tr>
        `
        tableBody.innerHTML += data;
    }
}

addColorToTable();

let courseCode_to_classData = {};
for (let classData of all_classes) {
    courseCode_to_classData[classData[0].toLowerCase()] = classData;
}

all_classes = all_classes.map(x => x[0]); // only want to search via course codes. Ex. CS 152
const trie = new Trie();
// insert data into the trie
all_classes.forEach(classTitle => trie.insert(classTitle)); 

const searchBar = document.querySelector(".text-input");

// Event listener for keyup
searchBar.addEventListener("input", function (e) {
    setPageNumber(1);
    updateTable();
    let table_results = getMatchingClassesFromSearchbar();
    // hide the pagination bar if there is less than 1 page of results, otherwise show it
    document.querySelector(".pagination-container").style.display = table_results.length <= RESULTS_PER_PAGE ? "none" : "block";
});

function setPageNumber(pageNum) {
    page = pageNum;
    document.querySelector(".active").innerText = page;
    // hide or show the `prev` button depending on if we're on first page or not
    document.querySelector(".prev").style.display = page === 1 ? "none" : "block";
    // hide or show the `next` button depending on if we're on the last page or not
    let table_results = getMatchingClassesFromSearchbar();
    document.querySelector(".next").style.display = table_results.slice(page*RESULTS_PER_PAGE).length < 1 ? "none" : "block";
}

function getMatchingClassesFromSearchbar() {
    let searchText = searchBar.value.trim().toLowerCase();
    let results = trie.search(searchText);
    return results;
}

function updateTable() {
    let table_results = getMatchingClassesFromSearchbar();
    updateTableData(table_results, courseCode_to_classData, teacherName_to_legacyID);
    addColorToTable();
}

function showPageData(pageNum) {
    setPageNumber(pageNum);
    updateTable();
}
