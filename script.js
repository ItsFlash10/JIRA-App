let allFilters = document.querySelectorAll(".filter div");
let modalVisible = false;
let addBtn = document.querySelector(".add");
let body = document.querySelector("body");
let grid = document.querySelector(".grid");
let uid = new ShortUniqueId();
let colors = {
  pink: "#d595aa",
  blue: "#5ecdde",
  green: "#91e6c7",
  black: "black",
};
let colorClasses = ["pink", "blue", "green", "black"];

let deleteState = false;
let deleteBtn = document.querySelector(".delete");

//initialisation step
if (!localStorage.getItem("tasks")) {
  localStorage.setItem("tasks", JSON.stringify([]));
}

deleteBtn.addEventListener("click", function (e) {
  if (deleteState) {
    deleteState = false;
    e.currentTarget.classList.remove("delete-state");
  } else {
    deleteState = true;
    e.currentTarget.classList.add("delete-state");
  }
});

addBtn.addEventListener("click", function () {
  if (modalVisible) return;

  if (deleteBtn.classList.contains("delete-state")) {
    deleteState = false;
    deleteBtn.classList.remove("delete-state");
  }

  let modal = document.createElement("div");

  modal.classList.add("modal-container");
  modal.setAttribute("click-first", true);
  modal.innerHTML = ` <div class="writing-area" contenteditable>Enter Your Task</div>
      <div class="filter-area">
        <div class="modal-filter pink"></div>
        <div class="modal-filter blue"></div>
        <div class="modal-filter green"></div>
        <div class="modal-filter black active-modal-filter"></div>
      </div>`;

  let allModalFilters = modal.querySelectorAll(".modal-filter");

  for (let i = 0; i < allModalFilters.length; i++) {
    allModalFilters[i].addEventListener("click", function (e) {
      for (let j = 0; j < allModalFilters.length; j++) {
        allModalFilters[j].classList.remove("active-modal-filter");
      }
      e.currentTarget.classList.add("active-modal-filter");
    });
  }

  let wa = modal.querySelector(".writing-area");
  wa.addEventListener("click", function (e) {
    if (modal.getAttribute("click-first") == "true") {
      wa.innerHTML = "";
      modal.setAttribute("click-first", false);
    }
  });

  wa.addEventListener("keypress", function (e) {
    if (e.key == "Enter") {
      let task = e.currentTarget.innerText;
      let selectedModalFilter = document.querySelector(".active-modal-filter");
      let color = selectedModalFilter.classList[1];
      let ticket = document.createElement("div");
      let id = uid();
      ticket.classList.add("ticket");
      ticket.innerHTML = `<div class="ticket-color ${color}"></div>
          <div class="ticket-id">#${id}</div>
          <div class="ticket-box" contenteditable>
            ${task}
          </div>
          </div>`;

      saveTicketInLocalStorage(id, color, task);

      let ticketWritingArea = ticket.querySelector(".ticket-box");

      ticketWritingArea.addEventListener("input", ticketWritingAreaHandler);

      ticket.addEventListener("click", function (e) {
        if (deleteState) {
          let id = e.currentTarget
            .querySelector(".ticket-id")
            .innerText.split("#")[1];

          let tasksArr = JSON.parse(localStorage.getItem("tasks"));

          tasksArr = tasksArr.filter(function (el) {
            return el.id != id;
          });

          localStorage.setItem("tasks", JSON.stringify(tasksArr));

          e.currentTarget.remove();
        }
      });

      let ticketColorDiv = ticket.querySelector(".ticket-color");

      ticketColorDiv.addEventListener("click", ticketColorHandler);

      grid.appendChild(ticket);
      modal.remove();
      modalVisible = false;
    }
  });

  body.appendChild(modal);
  modalVisible = true;
});

for (let i = 0; i < allFilters.length; i++) {
  allFilters[i].addEventListener("click", function (e) {
    let color = e.currentTarget.classList[0].split("-")[0];
    grid.style.backgroundColor = colors[color];
  });
}

function saveTicketInLocalStorage(id, color, task) {
  let requiredObj = { id, color, task };
  let tasksArr = JSON.parse(localStorage.getItem("tasks"));
  tasksArr.push(requiredObj);
  localStorage.setItem("tasks", JSON.stringify(tasksArr));
}

function ticketColorHandler(e) {
  let id = e.currentTarget.parentElement
    .querySelector(".ticket-id")
    .innerText.split("#")[1];

  let tasksArr = JSON.parse(localStorage.getItem("tasks"));
  let reqIndex = -1;
  for (let i = 0; i < tasksArr.length; i++) {
    if (tasksArr[i].id == id) {
      reqIndex = i;
      break;
    }
  }

  let currColor = e.currentTarget.classList[1];
  let index = colorClasses.indexOf(currColor);
  index++;
  index = index % 4;
  e.currentTarget.classList.remove(currColor);
  e.currentTarget.classList.add(colorClasses[index]);
  tasksArr[reqIndex].color = colorClasses[index];
  localStorage.setItem("tasks", JSON.stringify(tasksArr));
}

function ticketWritingAreaHandler(e) {
  let id = e.currentTarget.parentElement
    .querySelector(".ticket-id")
    .innerText.split("#")[1];
  let tasksArr = JSON.parse(localStorage.getItem("tasks"));
  let reqIndex = -1;
  for (let i = 0; i < tasksArr.length; i++) {
    if (tasksArr[i].id == id) {
      reqIndex = i;
      break;
    }
  }

  tasksArr[reqIndex].task = e.currentTarget.innerText;
  localStorage.setItem("tasks", JSON.stringify(tasksArr));
}

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  for (let i = 0; i < tasks.length; i++) {
    let id = tasks[i].id;
    let color = tasks[i].color;
    let taskValue = tasks[i].task;

    let ticket = document.createElement("div");
    ticket.classList.add("ticket");
    ticket.innerHTML = `<div class="ticket-color ${color}"></div>
          <div class="ticket-id">#${id}</div>
          <div class="ticket-box" contenteditable>
            ${taskValue}
          </div>
          </div>`;

    let ticketWritingArea = ticket.querySelector(".ticket-box");
    ticketWritingArea.addEventListener("input", ticketWritingAreaHandler);

    let ticketColorDiv = ticket.querySelector(".ticket-color");
    ticketColorDiv.addEventListener("click", ticketColorHandler);

    ticket.addEventListener("click", function (e) {
      if (deleteState) {
        let id = e.currentTarget
          .querySelector(".ticket-id")
          .innerText.split("#")[1];

        let tasksArr = JSON.parse(localStorage.getItem("tasks"));

        tasksArr = tasksArr.filter(function (el) {
          return el.id != id;
        });

        localStorage.setItem("tasks", JSON.stringify(tasksArr));

        e.currentTarget.remove();
      }
    });

    grid.appendChild(ticket);
  }
}

loadTasks();
