const url = "http://localhost:3000/course";


function addCourse() {
    var course = {
        c_id: document.getElementById("c_id").value,
        name: document.getElementById("c_name").value,
        d_id: document.getElementById("d_Id").value,
        duration: document.getElementById("duration").value
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(course)
    }).then(response => response.json())
      .then(() => {
        getAllCourses();
    })
    .catch(error => {
        console.log("Error adding course:", error);
    });
}

function deleteCourse(id) {
    console.log(id);
    fetch(url + "/" + id, {
        method: "DELETE"
    }).then(response => response.json())
      .then(() => {
        getAllCourses();
    })
    .catch(error => {
        console.log("Error deleting course:", error);
    });
}

function getAllCourses() {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayCourses(data);
        })
        .catch(error => {
            console.log("Error fetching courses:", error);
        });
}

function getCourse(c_id) {
    fetch(url + `?c_id=`+ c_id)
        .then(response => response.json())
        .then(course => {
            console.log(course);
            document.getElementById("id").value=course[0].id,
            document.getElementById("c_id").value = course[0].c_id;
            document.getElementById("c_name").value = course[0].name;
            document.getElementById("d_Id").value = course[0].d_id;
            document.getElementById("duration").value = course[0].duration;
            document.getElementById("btnSubmit").disabled = true;
            document.getElementById("btnupdate").disabled = false;
        })
        .catch(error => {
            console.log("Error fetching course:", error);
        });
}

function updateCourse() {
    var course = {
        id:document.getElementById("id").value,
        c_id: document.getElementById("c_id").value,
        name: document.getElementById("c_name").value,
        d_id: document.getElementById("d_Id").value,
        duration: document.getElementById("duration").value
    };

    fetch(url + "/"+course.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(course)
    }).then(response => response.json())
      .then(() => {
        getAllCourses();
    })
    .catch(error => {
        console.log("Error updating course:", error);
    });
}

function displayCourses(courses) {
    var tbody = document.getElementById("tbody");
    tbody.innerHTML = "";  // Clear the existing table rows

    courses.forEach(course => {
        var row = tbody.insertRow();

        row.insertCell(0).innerText = course.c_id;
        row.insertCell(1).innerText = course.name;
        row.insertCell(2).innerText = course.d_id;
        row.insertCell(3).innerText = course.duration;

        var deleteCell = row.insertCell(4);
        deleteCell.innerHTML = `<button class="btn btn-danger">Delete</button>`;
        deleteCell.addEventListener("click", function() {
            deleteCourse(course.id);
        });

        var editCell = row.insertCell(5);
        editCell.innerHTML = `<button class="btn btn-primary">Edit</button>`;
        editCell.addEventListener("click", function() {
            getCourse(course.c_id);
        });
    });
}

getAllCourses();  // Initialize the table on page load
