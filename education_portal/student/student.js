"use strict";
const admin = 0;
const student = 1;
let loginUser = JSON.parse(sessionStorage.getItem("loginUser"));
let assignCourse = JSON.parse(localStorage.getItem("assignCourses"));
function checkLogin() {
  if (loginUser) {
    if (loginUser.type != student) {
      //redirect to login page
      location.href = "../index.html";
    } else {
      document.getElementById("loginUserName").innerText =
        "Welcome, " + loginUser.userName;
      getCourses();
    }
  } else {
    //redirect to login page
    location.href = "../index.html";
  }
}

function logout() {
  sessionStorage.removeItem("loginUser");
  location.reload();
}




function deleteAccount() {
  if (confirm("Are you sure you want to delete your account?")) {
      let users = JSON.parse(localStorage.getItem('users'));
      let loginUser = JSON.parse(sessionStorage.getItem("loginUser"));

      if (users && loginUser) {
          // Find the index of the logged-in user in the users array
          let index = users.findIndex(user => user.id === loginUser.id);
          
          if (index !== -1) {
              // Remove the user from the array
              users.splice(index, 1);
              // Update the localStorage
              localStorage.setItem('users', JSON.stringify(users));
          }

          // Clear the sessionStorage
          sessionStorage.removeItem('loginUser');
          // Redirect the user to the home page or login page
          window.location.href = '../index.html';
      } else {
          alert("User data not found.");
      }
  }
}


function getCourses() {
  let studentCourses = assignCourse.find(
    (ele) => ele.student.id == loginUser.id ?? ele
  );
  document.getElementById("viewCourses").innerHTML = "";
  if (studentCourses) {
    document.getElementById("viewCourses").innerHTML += `
        <div class="container">
            <div class="row" id="row">`
                studentCourses.courses.forEach((course) => {
                    document.getElementById("row").innerHTML +=
                        `<div class="col-4">
                            <div class="card">
                                <img src="${course.courseImage}" class="card-img-top"
                                alt="image" /><hr>
                                <div class="card-body">
                                <h5 class="card-title">${course.courseName}</h5>
                                <span>(${course.courseType})</span>
                                <p class="card-text">${course.courseDescription}</p>
                            </div>
                        </div>
                    </div>`;
                });
            ` </div>
        </div>`;
  }
}
