// const uniqid = require("uniqid");
let flag = false;
let modal_cont = document.querySelector(".modal-cont");
let add_button = document.querySelector(".add-btn");
let main_cont = document.querySelector(".main-cont");
let text_area_cont = document.querySelector(".text-area");
let color_array = ["lightpink", "lightblue", "lightgreen", "lightgray"];
let modal_priority_color = color_array[color_array.length - 1];
let selet_all_color = document.querySelectorAll(".color-priority");
let removal = false;
let remove_button = document.querySelector(".remove-btn");
let lockclass = "fa-lock";
let unlockclass = "fa-unlock";
let all_tool_box_cont = document.querySelectorAll(".button");

let ticket_arr = [];
// get item
if (localStorage.getItem("jira_tickets")) {
  ticket_arr = JSON.parse(localStorage.getItem("jira_tickets"));
  ticket_arr.forEach((ticket) => {
    create_ticket(ticket.color, ticket.text_area, ticket.ticket_id);
  });
}
// localStorage.clear();

// colorpriority of modal container
selet_all_color.forEach((colorEle, idx) => {
  colorEle.addEventListener("click", (e) => {
    selet_all_color.forEach((colorElee) => {
      colorElee.classList.remove("active");
    });
    colorEle.classList.add("active");
    modal_priority_color = colorEle.classList[1];
    // modal_priority_color globally declared hai to yaha se color change karayenge
  });
});

// add button
add_button.addEventListener("click", (e) => {
  flag = !flag;
  removal = false;
  if (flag) {
    modal_cont.style.display = "flex";
  } else {
    modal_cont.style.display = "none";
  }
});

// shift key game
document.addEventListener("keydown", (e) => {
  let key = e.key;
  if (e.shiftKey && flag) {
    // Check for Shift key only when  modal is open
    create_ticket(
      modal_priority_color,
      text_area_cont.value,
      Math.floor(Math.random() * 10000000)
    );
    modal_cont.style.display = "none";
    flag = false;
    text_area_cont.value = "";
  }
});

// creating process
function create_ticket(modal_priority_color, text_area_value, ticket_id_value) {
  let ticket_cont = document.createElement("div");
  ticket_cont.setAttribute("class", "ticket-cont");
  ticket_cont.innerHTML = `
  <div class=" color-stored ${modal_priority_color}"></div>
    <div class="id-stored">${ticket_id_value}</div>
    <div class="task-stored">${text_area_value}</div>
    <div class="lock"><i class="fa-solid fa-lock"></i></div>`;
  main_cont.appendChild(ticket_cont);
  const existingTicket = ticket_arr.find(
    (ticket) =>
      ticket.ticket_id === ticket_id_value &&
      ticket.color === modal_priority_color
  );
  if (!existingTicket) {
    ticket_arr.push({
      color: modal_priority_color,
      text_area: text_area_value,
      ticket_id: ticket_id_value,
    });
    localStorage.setItem("jira_tickets", JSON.stringify(ticket_arr));
  }
  // jab ek ticket create hogi tabhi to lock and color ki baat aayegi
  // isliye yaha se call kerna hoga
  // handle_lock and handle_color ko
  handle_lock(ticket_cont, ticket_id_value);
  handle_color(ticket_cont, ticket_id_value);
}

function handle_lock(ticket, ticket_id_value) {
  let ticket_lock_ele = ticket.querySelector(".lock");
  let ticket_lock = ticket_lock_ele.children[0];
  let content_editable_task_area = ticket.querySelector(".task-stored");
  ticket_lock.addEventListener("click", (e) => {
    let index_to_set_color = search_ticket(ticket);
    if (ticket_lock.classList.contains(lockclass)) {
      ticket_lock.classList.remove(lockclass);
      ticket_lock.classList.add(unlockclass);
      content_editable_task_area.setAttribute("contenteditable", "true");
    } else {
      // unlock karne ke baad lock kerna hi save hone ki guarantee hogi
      ticket_lock.classList.add(lockclass);
      ticket_lock.classList.remove(unlockclass);
      content_editable_task_area.setAttribute("contenteditable", "false");
      ticket_arr[index_to_set_color] = {
        color: ticket.children[0].classList[1],
        text_area: ticket.children[2].textContent,
        ticket_id: +ticket.children[1].textContent, //+ isliye taki integer ban jaye
      };
      localStorage.setItem("jira_tickets", JSON.stringify(ticket_arr));
      // console.log(JSON.parse(localStorage.getItem("jira_tickets")));
    }
  });
}

// handle color
function handle_color(current_color_ticket, ticket_id_value) {
  let color_div = current_color_ticket.querySelector(".color-stored");
  color_div.addEventListener("click", (e) => {
    // pata hai jo class add hogi yo last me hogi isliye
    // color_div.classList[0]; ki jagah color_div.classList[1]; yeh likho
    let index_to_set_color = search_ticket(current_color_ticket);
    let current_color = color_div.classList[1];
    color_div.classList.remove(current_color);
    let index = color_array.indexOf(current_color);
    color_div.classList.add(color_array[(index + 1) % 4]);
    let new_color = color_array[(index + 1) % 4];
    let new_id = +current_color_ticket.children[1].textContent;
    let new_text_area = current_color_ticket.children[2].textContent;
    ticket_arr[index_to_set_color] = {
      color: new_color,
      text_area: new_text_area,
      ticket_id: new_id,
    };
    localStorage.setItem("jira_tickets", JSON.stringify(ticket_arr));
    // console.log(JSON.parse(localStorage.getItem("jira_tickets")));
    // localStorage.clear();
    // console.log(JSON.parse(localStorage.getItem("jira_tickets")));
  });
}
// toolbox color filter
for (let i = 0; i < 4; i++) {
  all_tool_box_cont[i].addEventListener("click", (e) => {
    removal = false;
    let selectedColor = all_tool_box_cont[i].classList[1];
    let our_tickets = main_cont.children;
    for (let j = 0; j < our_tickets.length; j++) {
      if (our_tickets[j].children[0].classList[1] !== selectedColor) {
        our_tickets[j].style.display = "none";
      } else {
        our_tickets[j].style.display = "block"; // Show the matching ones
      }
    }
  });
  all_tool_box_cont[i].addEventListener("dblclick", (e) => {
    let our_tickets = main_cont.children;
    for (let j = 0; j < our_tickets.length; j++) {
      our_tickets[j].style.display = "block"; // Show the matching ones
    }
  });
}

// removal of certain ticket

// ... (existing code)

// remove button
remove_button.addEventListener("click", (e) => {
  removal = !removal;
  if (removal) {
    main_cont.classList.add("removal-mode");
  } else {
    main_cont.classList.remove("removal-mode");
  }
});

// function handle_remove(ticket) {
//   if (removal) ticket.remove();
// }

// handle removal of certain ticket
main_cont.addEventListener("click", (e) => {
  if (removal && e.target.closest(".ticket-cont")) {
    let ticketToRemove = e.target.closest(".ticket-cont");
    let index_to_set_color = search_ticket(ticketToRemove);
    ticket_arr.splice(index_to_set_color, 1);
    localStorage.setItem("jira_tickets", JSON.stringify(ticket_arr));
    // console.log(JSON.parse(localStorage.getItem("jira_tickets")));
    ticketToRemove.remove();
  }
});

// ... (existing code)

// searching
function search_ticket(ticket_cont) {
  let current_col = ticket_cont.children[0].classList[1];
  let current_idd = +ticket_cont.children[1].textContent;
  let index_value = ticket_arr.findIndex((ticketObj) => {
    // console.log(ticketObj.ticket_id, current_idd, current_col, ticketObj.color);
    return (
      ticketObj.ticket_id === current_idd && current_col === ticketObj.color
    );
  });
  // console.log("index is", index_value);
  return index_value;
}
