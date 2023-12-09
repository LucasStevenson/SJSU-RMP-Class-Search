const searchBar = document.querySelector(".text-input");
let trie;
let courseCode_to_classData = {};
let teacherName_to_legacyID;

(async () => {
    // fetch all the class data from the backend
    let classData = await fetch("/api/data/all_classes");
    let all_classes = await classData.json();
    // fetch the dict that maps teacher names to their legacyID
    let data = await fetch("/api/data/teacherName_to_legacyID");
    teacherName_to_legacyID = await data.json() // ex. { "Bob Smith": 123456, ... }

    for (let classData of all_classes) {
        courseCode_to_classData[classData[0].toLowerCase()] = classData;
    }

    all_classes = all_classes.map(x => x[0]); // only want to search via course codes. Ex. CS 152
    trie = new Trie();
    // insert data into the trie
    all_classes.forEach(classTitle => trie.insert(classTitle)); 

    // show page 1 data on initial page load
    showPageData(1);

    // Event listener for searchbar input change
    searchBar.addEventListener("input", function (e) {
        showPageData(1);
    });
})();

function _addColorToTable() {
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

function _updateTableData(trie_results) {
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

function _setPageNumber(pageNum, table_results) {
    page = pageNum;
    document.querySelector(".active").innerText = page;
    // hide or show the `prev` button depending on if we're on first page or not
    document.querySelector(".prev").style.display = page === 1 ? "none" : "block";
    // hide or show the `next` button depending on if we're on the last page or not
    document.querySelector(".next").style.display = table_results.slice(page*RESULTS_PER_PAGE).length < 1 ? "none" : "block";
}

function _getMatchingClassesFromSearchbar() {
    let searchText = searchBar.value.trim().toLowerCase();
    let results = trie.search(searchText);
    return results;
}

function showPageData(pageNum) {
    let table_results = _getMatchingClassesFromSearchbar();
    _setPageNumber(pageNum, table_results);
    _updateTableData(table_results);
    _addColorToTable();
    // hide the pagination bar if there is less than 1 page of results, otherwise show it
    document.querySelector(".pagination-container").style.display = table_results.length <= RESULTS_PER_PAGE ? "none" : "block";
}
