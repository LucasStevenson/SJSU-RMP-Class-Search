function updateTable(trie_results, courseCode_to_classData, teachers_map) {
    let tableBody = document.getElementById("table-body");

    // clear all the data that is currently inside the table body
    tableBody.innerHTML = '';

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
        if (classData[8] in teachers_map) {
            data += `<a href="https://ratemyprofessors.com/professor/${teachers_map[classData[8]]}" target="_blank">${classData[8]}</a>`;
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
