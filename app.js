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
    terms.addEventListener("click", (e) => {
      data.push(newUser);
      localStorage.setItem("users", JSON.stringify(data));
      signUpPage.style.display = "none";
      dashBoard.style.display = "block";
    });
  }
}

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
    <label for="${listNumber}" id='listNameText'>${listName}</label>
    <br>
    `;
    dashBoardForm.appendChild(div);
    listNumber++;
  });
  //To-do-list Page
  const toDoListPage = document.querySelector(".toDoList");
  const userAllList = dashBoardForm.querySelectorAll("input");
  const divsContainer = toDoListPage.querySelector("#toDoList");
  const toDoListForm = toDoListPage.querySelector("#toDoListForm");
  let goal = "";
  let mainGoal;
  const arr = [];
  
  function Done(currentUser, doneItem){
    this.currentUser = currentUser;
    this.doneItem = doneItem;
  }
  
  userAllList.forEach((input) => {
    input.addEventListener("click", (e) => {
      // localStorage.removeItem('doneItems');
      dashBoard.style.display = "none";
      toDoListPage.style.display = "block";
      startPage.style.display = "none";
      mainButtons.style.display = "block";

      goal = e.target.nextElementSibling.innerText;
      arr.push(goal);
      document.getElementById("head").innerText = goal;

      const liItems = divsContainer.querySelectorAll("div");
      liItems.forEach((div) => {
        divsContainer.removeChild(div);
      });
      storedLists.forEach((list) => {
        if (list.newListName === goal) {
          mainGoal = list;
        }
      });

      //2  Check off an item as "done", and uncheck it as well.
      const arrOfItems = mainGoal.newListItems;
      let id = 0;
      arrOfItems.forEach((item) => {
        id++;
        const div = document.createElement("div");
        div.innerHTML = `
        <br>
        <input type="checkbox" id="${id}" name="myList">
        <label for="${id}" id='listNameText'>${item}</label>
        <br>
        `;
        divsContainer.appendChild(div);

        // to show completed items of the list:
        const allListItems = toDoListPage.querySelectorAll('label');
        const allDoneItems = JSON.parse(localStorage.getItem('doneItems'));
        if(allDoneItems !== null){
          allListItems.forEach(item => {
           allDoneItems.forEach(done => {
             if(item.innerText === done.doneItem){
               item.classList.add('doneItems');
             }
           })
          })
        }
      });

      // checkbox
      const allInputs = divsContainer.querySelectorAll('input');
      allInputs.forEach(input => {
        input.addEventListener('click', (e) => {
          e.target.nextElementSibling.classList.toggle('doneItems');

          const done = new Done(currentUserEmail, e.target.nextElementSibling.innerText);
          const arrOfDoneItems = [];
          const arr = [];
          const storedDoneItems = JSON.parse(localStorage.getItem("doneItems"));
          if(storedDoneItems){
            storedDoneItems.forEach(doone =>{
              arr.push(doone.doneItem)
            })
          }
          if(storedDoneItems == null){
            arrOfDoneItems.push(done);
            localStorage.setItem('doneItems', JSON.stringify(arrOfDoneItems));
          }else if(!arr.includes(done.doneItem)){
            storedDoneItems.push(done);
            localStorage.removeItem("doneItems");
            localStorage.setItem('doneItems', JSON.stringify(storedDoneItems));
        }
      })
    })
    const storedDoneItems = JSON.parse(localStorage.getItem("doneItems"));
    allInputs.forEach(deletedInput =>{
      deletedInput.addEventListener('click', (event) => {
        if(storedDoneItems){
          storedDoneItems.forEach(unCompleted => {
           if(unCompleted.doneItem === event.target.nextElementSibling.innerText){
              storedDoneItems.splice(storedDoneItems.indexOf(unCompleted), 1);
              localStorage.removeItem('doneItems');
              localStorage.setItem('doneItems', JSON.stringify(storedDoneItems));
           }
          })
        }
      })
    })
  });
});

  // add new item:
  let id = 1;
  toDoListForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const store = JSON.parse(localStorage.getItem("lists"));
    localStorage.removeItem("'lists");
    const itemInput = toDoListForm.querySelector("#newItem").value;
    const div = document.createElement("div");
    div.innerHTML = `
    <br>
    <input type="checkbox" id="${id}" name="myList">
    <label for="${id}" id='listNameText'>${itemInput}</label>
    <br>
    `;
    divsContainer.appendChild(div);
    const label = div.querySelector('label');
    store.forEach((list) => {
      if (currentUserEmail === list.currentUser && list.newListName === goal) {
        list.newListItems.push(label.innerText);
      }
    });
    localStorage.setItem("lists", JSON.stringify(store));
    toDoListForm.reset();
    id++;
  });

  // 1- rename the list.
  const editListName = document.getElementById("editName");
  const changeNameForm = document.getElementById("changeNameForm");
  const header = document.getElementById("head");
  const div = document.getElementById("changeName");
  let goallist;
  let replacedName;
  editListName.addEventListener("click", (e) => {
    div.style.display = "none";
    changeNameForm.style.display = "block";
  });

  changeNameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    replacedName = document.getElementById("replaceName").value;
    header.innerText = replacedName;
    changeNameForm.style.display = "none";
    div.style.display = "block";
    storedLists.forEach((list) => {
      if (list.currentUser === currentUserEmail && list.newListName === goal) {
        goallist = list;
        goallist.newListName = replacedName;
        localStorage.removeItem("lists");
        localStorage.setItem("lists", JSON.stringify(storedLists));
        document.getElementById("listNameText").innerText = replacedName;
      }
    });
  });
  const backBtn = document.getElementById("back");
  backBtn.addEventListener("click", (e) => {
    toDoListPage.style.display = "none";
    dashBoard.style.display = "block";
    mainButtons.style.display = "block";
    // goallist.newListName = replacedName;
    document.getElementById("head").innerText = "";
  });

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
  toDoListPage.style.display = "none";
  accountSettings.style.display = 'none';

});

// to change account settings
const accountSettingsBtn = document.getElementById("accountSettingsBtn");
const toDoListPage = document.querySelector(".toDoList");

accountSettingsBtn.addEventListener("click", (e) => {
  dashBoard.style.display = "none";
  accountSettings.style.display = "block";
  mainButtons.style.display = "block";
  toDoListPage.style.display = "none";
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
    accountSettings.style.display = 'none';
  });

  // to change account settings
  const accountSettingsBtn = document.getElementById("accountSettingsBtn");
  accountSettingsBtn.addEventListener("click", (e) => {
    blankList.style.display = "none";
    accountSettings.style.display = "block";
    mainButtons.style.display = "block";
    toDoListPage.style.display = 'none';

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
  const store = JSON.parse(localStorage.getItem("lists"));
  const dashForm = document.getElementById('dashBoardForm');
  let i = 20;
  store.forEach(list => {
    if(list.currentUser === currentUserEmail){
      const div = document.createElement("div");
      div.innerHTML = `
    <input type= 'radio' value= '${list.newListName}' id = ${i}> 
    <label>${list.newListName}</label>
    `; 
    i++;
    dashForm.appendChild(div);
    }
  })
});
