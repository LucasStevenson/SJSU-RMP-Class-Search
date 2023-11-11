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

function updateTable(trie_results, courseCode_to_classData, teacherName_to_legacyID) {
    let tableBody = document.getElementById("table-body");

    // clear all the data that is currently inside the table body
    tableBody.innerHTML = '';

    // for (let i = (page-1)*20; i < Math.min(trie_results.length, i+20); i++) {
    for (let i = 0; i < Math.min(trie_results.length, 20); i++) {
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
        data += `
            <td class="instruct-rating"><b>${classData[9]}</b></td>
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
searchBar.addEventListener("keyup", function () {
    let searchText = searchBar.value.trim().toLowerCase();
    let results = trie.search(searchText);
    console.log(searchText);
    console.log(results);
    updateTable(results, courseCode_to_classData, teacherName_to_legacyID);
    addColorToTable();
});
