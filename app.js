"use strict";
//Start Page:
const signUpBtn = document.getElementById("signUpBtn");
const logInBtn = document.getElementById("logInButton");
const mainButtons = document.querySelector(".buttons");

const signUpPage = document.querySelector(".signUpPage");
const startPage = document.querySelector(".startPage");
const logInPage = document.querySelector(".logInPage");

function NewUser(firstName, lastName, email, password) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.email = email;
  this.password = password;
}

signUpBtn.addEventListener("click", (e) => {
  startPage.style.display = "none";
  signUpPage.style.display = "block";
});

logInBtn.addEventListener("click", (e) => {
  startPage.style.display = "none";
  logInPage.style.display = "block";
});

//Sign Up Page:
const signUpForm = document.getElementById("signUpForm");
const terms = document.querySelector(".terms");
const dashBoard = document.querySelector(".dashBoard");

signUpForm.addEventListener("submit", saveUserData);
let strUser;
function saveUserData(e) {
  e.preventDefault();
  const firstName = signUpForm.querySelector("#firstName").value;
  const lastName = signUpForm.querySelector("#lastName").value;
  const email = signUpForm.querySelector("#email").value;
  const password = signUpForm.querySelector("#password").value;
  terms.style.display = "block";
  const newUser = new NewUser(firstName, lastName, email, password);
  const data = JSON.parse(localStorage.getItem("users"));
  const arrOfUser = [];
  if (data == null) {
    arrOfUser.push(newUser);
    localStorage.setItem("users", JSON.stringify(arrOfUser));
    console.log(arrOfUser);
  } else {
    data.push(newUser);
    localStorage.setItem("users", JSON.stringify(data));
  }
}

terms.addEventListener("click", (e) => {
  signUpPage.style.display = "none";
  dashBoard.style.display = "block";
});
//Log in Page

const logInForm = document.getElementById("logInForm");
let currentUserEmail;
let currentUserPassword;
logInForm.addEventListener("submit", logIn);

function logIn(e) {
  e.preventDefault();
  const email = logInForm.querySelector("#logInEmailemail").value;
  const password = logInForm.querySelector("#logInPassword").value;
  currentUserEmail = email;
  currentUserPassword = password;
  const arrOfUser = JSON.parse(localStorage.getItem("users"));

  arrOfUser.forEach((user) => {
    if (user.email === email && user.password === password) {
      logInPage.style.display = "none";
      dashBoard.style.display = "block";
      mainButtons.style.display = "block";
    }
  });

  const alertMessage = document.createElement("p");
  alertMessage.textContent = "This email or password is not correct try again!";
  logInForm.append(alertMessage);
  logInForm.reset();

  const focus = logInForm.querySelector("#logInEmailemail");
  focus.addEventListener("focus", () => {
    alertMessage.textContent = "";
  });

  //Dashboard page:
  const dashBoardForm = document.getElementById("dashBoardForm");
  let listNumber = 1;
  const storedLists = JSON.parse(localStorage.getItem("lists"));
  let lists = [];
  storedLists.forEach((list) => {
    if (list.currentUser === currentUserEmail) {
      lists.push(list.newListName);
    }
  });
  lists.forEach((listName) => {
    const div = document.createElement("div");
    div.innerHTML = `
    <br>
    <input type="radio" id="${listNumber}" name="myList">
    <label for="${listNumber}">${listName}</label>
    <br>
    `;
    dashBoardForm.appendChild(div);
    listNumber++;
  });
  //To-do-list Page
  const toDoListPage = document.querySelector(".toDoList");
  const userAllList = dashBoardForm.querySelectorAll("input");
  const ul = toDoListPage.querySelector("#toDoList");
  let goal ='';
  let mainGoal;

  userAllList.forEach((input) => {
    input.addEventListener("click", (e) => {

      dashBoard.style.display = "none";
      toDoListPage.style.display = "block";
      startPage.style.display='none';
      mainButtons.style.display='block';

       goal = e.target.nextElementSibling.innerText;
      storedLists.forEach(list=>{
        if(list.newListName===goal){
           mainGoal = list;
           console.log(mainGoal);
        }
      })

      const arrOfItems= mainGoal.newListItems;
      console.log(arrOfItems);
      arrOfItems.forEach(item=>{
        const li = document.createElement("li");
        li.innerText = item;
        li.classList.add("items");
        ul.appendChild(li);
      })
    });
  });
  const toDoListForm = toDoListPage.querySelector('#toDoListForm');

  toDoListForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const store = JSON.parse(localStorage.getItem('lists'));
    localStorage.removeItem("'lists");
    const itemInput = toDoListForm.querySelector('#newItem').value;
    const li = document.createElement("li");
    li.innerText=itemInput;
    ul.appendChild(li);
    store.forEach(list=>{
      if(currentUserEmail === list.currentUser && list.newListName === goal){
        list.newListItems.push(li.innerText);
      }
    })
    localStorage.setItem('lists', JSON.stringify(store));
    toDoListForm.reset();
  })

  //Account Settings page

  const arrOfUsers = JSON.parse(localStorage.getItem("users"));
  let currentUser;
  arrOfUsers.forEach((user) => {
    if (user.email === currentUserEmail) {
      currentUser = user;
    }
  });
  const firstName = document.getElementById("changeFirstName");
  firstName.value = currentUser.firstName;
  const lastName = document.getElementById("changeLastName");
  lastName.value = currentUser.lastName;
  const editEmail = document.getElementById("changeEmail");
  editEmail.value = currentUser.email;
  const editPassword = document.getElementById("changePassword");
  editPassword.value = currentUser.password;

  const editBtn = document.getElementById("editBtn");
  editBtn.addEventListener("click", (e) => {
    e.preventDefault();
    arrOfUsers.forEach((user) => {
      if (user.email === currentUserEmail) {
        arrOfUsers.splice(arrOfUsers.indexOf(user), 1);
        const newUser = new NewUser(
          firstName.value,
          lastName.value,
          editEmail.value,
          editPassword.value
        );
        arrOfUsers.push(newUser);
      }
    });
    localStorage.clear();
    localStorage.setItem("users", JSON.stringify(arrOfUsers));
  });
}

// Buttons inside Dashboard:
const accountSettings = document.querySelector(".accountSettings");
const logOutBtn = document.getElementById("logOutBtn");

// to log out
  logOutBtn.addEventListener("click", (e) => {
    const toDoListPage = document.querySelector(".toDoList");

      dashBoard.style.display = "none";
      startPage.style.display = "block";
      mainButtons.style.display = "none";
      toDoListPage.style.display='none';
});

// to change account settings
const accountSettingsBtn = document.getElementById("accountSettingsBtn");
accountSettingsBtn.addEventListener("click", (e) => {
  dashBoard.style.display = "none";
  accountSettings.style.display = "block";
  mainButtons.style.display = "block";
});

const createListBtn = document.getElementById("newList");
const blankList = document.querySelector(".blankList");
createListBtn.addEventListener("click", goToBlankList);

function goToBlankList(e) {
  dashBoard.style.display = "none";
  blankList.style.display = "block";
  startPage.style.display = "none";

  // to log out
  logOutBtn.addEventListener("click", (e) => {
    blankList.style.display = "none";
    startPage.style.display = "block";
    mainButtons.style.display = "none";
  });

  // to change account settings
  const accountSettingsBtn = document.getElementById("accountSettingsBtn");
  accountSettingsBtn.addEventListener("click", (e) => {
    blankList.style.display = "none";
    accountSettings.style.display = "block";
    mainButtons.style.display = "block";
  });
}

function NewList(currentUser, newListName, newListItems) {
  this.currentUser = currentUser;
  this.newListName = newListName;
  this.newListItems = newListItems;
}

//blank list

const blankListFormName = document.getElementById("blankListFormName");
const blankListItemsForm = document.getElementById("blankListItemsForm");
const newToDoList = document.getElementById("toDoList");
let listNameInput;
let newList;

blankListFormName.addEventListener("submit", (e) => {
  e.preventDefault();
  listNameInput = document.getElementById("listName").value;
  const name = document.getElementById("newListName");

  const nameOfList = document.createElement("p");
  name.appendChild(nameOfList);
  nameOfList.innerText = listNameInput;
});

const arrOfListItems = [];
let allLists;
let li;

blankListItemsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  allLists = [];
  if (localStorage.getItem("lists") !== null) {
    const arrOfStoredLists = JSON.parse(localStorage.getItem("lists"));
    arrOfStoredLists.forEach((list) => {
      allLists.push(list);
    });
  }
  const listItem = document.getElementById("item").value;
  arrOfListItems.push(listItem);
  li = document.createElement("li");
  newToDoList.appendChild(li);
  li.classList.add("items");
  li.innerText = listItem;
  newList = new NewList(currentUserEmail, listNameInput, arrOfListItems);
  allLists.push(newList);
  blankListItemsForm.reset();
});

const saveBtn = document.getElementById("save");
saveBtn.addEventListener("click", (e) => {
  localStorage.setItem("lists", JSON.stringify(allLists));
  blankList.querySelector("p").remove();
  document.getElementById("listName").value = "";
  const allItems = document.querySelectorAll("li");
  allItems.forEach((item) => item.remove());
  blankList.style.display = "none";
  dashBoard.style.display = "block";
  const store = JSON.parse(localStorage.getItem('lists'))
  
  store.forEach(list=>{
    if(list.currentUser === currentUserEmail){
      const li = document.createElement('li');
      li.textContent=list.newListName;
      document.getElementById('toDoList').appendChild(li);
    }
  })
});
