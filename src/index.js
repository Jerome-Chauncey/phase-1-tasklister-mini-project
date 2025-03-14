document.addEventListener("DOMContentLoaded", () => { //makes sure the script only runs after the HTML has fully loaded
  let form = document.getElementById("create-task-form") //selects the form where the user enters tasks

  let sortButton = document.getElementById("sort-tasks"); //selects the "sort by priority" button


  //handle task submission
  form.addEventListener("submit", (e) => { //adding an event lisnener for form submission, this detects when the user submits the form (presses the create new task button)
    e.preventDefault(); //prevents the page from refreshing, this allows the task to be added without losing previous tasks


    //extracting user inputs
    let taskDescription = document.getElementById("new-task-description").value; //new-task-description is the description input id, value retrieves the text the user entered
    let user = document.getElementById("user").value; //gets users name
    let duration = document.getElementById("duration").value; //gets task duration
    let dueDate = document.getElementById("due-date").value; // gets task due date
    let priority = document.getElementById("priority").value; // gets task priority

    buildToDo(taskDescription, user, duration, dueDate, priority); //sends input data to buildToDo, which creates the task
    form.reset(); //resets the form fields after submission
  });


  //sorting tasks with button
  sortButton.addEventListener("click", sortTasks); //calls sortTasks() when the sort by priority button is clicked, sorts tasks based on priority
});

//create task
function buildToDo(taskDescription, user, duration, dueDate, priority) { //this function creates a new task item and displays it in the task list

  //create task elements
  let li = document.createElement("li");//list item <li> to hold task details
  let btn = document.createElement("button");// delete button
  let editBtn = document.createElement("button");//edit button

  //insert task details
  li.innerHTML = `<strong>${taskDescription}</strong> (User: ${user}, Duration: ${duration} mins, Due: ${dueDate})`; //adds task details insiide the <li>

  //appling priority colors
  if (priority === "high") { //changes the text color on <li> based on the priority
    li.style.color = "red";
  } else if (priority === "medium") {
    li.style.color = "yellow";
  } else {
    li.style.color = "green";
  }


  //create delete button
  btn.textContent = "x"; //sets the button text to x 
  btn.addEventListener("click", handleDelete); //when button is clicked the handledDelete function will bw executed
  li.appendChild(btn); //ensures the delete button appears inside the task <li> element


  //create edit button
  editBtn.textContent = "Edit"; //sets button text to "edit"
  editBtn.addEventListener("click", () => editTask(li, taskDescription, user, duration, dueDate, priority)); //when clicked, the editTask() function is called, passing the task details so the user can update
  li.appendChild(editBtn);// this ensures the edit button appears inside the task <li> element


  //store priority data for sorting
  li.setAttribute("data-priority", priority);// sets a custom attribute on the <li> element to store the priority value. This will be later used to sort tasks based on priority


  //add task to the list
  document.querySelector("#tasks").appendChild(li); //selects the <ul> element with id "tasks" and adds the newly created <li> task inside it
}


//detetes a task
function handleDelete(e) { 
  e.target.parentNode.remove(); //e.target is the delete button that was clicked, parentNode.remove() - removes the entire <li>
}


//sort task by priority
function sortTasks() {
  let taskList = document.getElementById("tasks"); //finds the task list element
  let tasks = Array.from(taskList.children); //Array.from(converts it into an array for sorting), taskList.children(gives all <li> elements)

  //sorting logic
  tasks.sort((a, b) => {
    let priorityOrder = { "high": 1, "medium": 2, "low": 3 }; //Assign priority levels
    return priorityOrder[a.getAttribute("data-priority")] - priorityOrder[b.getAttribute("data-priority")]; //sort tasks based on priority (compares priority values and sorts them in descending order, high to low)
  });

  //rebuild the sorted list
  taskList.innerHTML = ""; // removes the <li> elements temporarily
  tasks.forEach(task => taskList.appendChild(task));// adds back tasks in correct order 
}


//edits a task
function editTask(li, taskDescription, user, duration, dueDate, priority) {//takes the task details as parameters and allows the user to modify them
  let newTask = prompt("Edit Task:", taskDescription);//prompt aks the user to enter new values, if they press canel the original values remain
  let newUser = prompt("Edit User:", user);
  let newDuration = prompt("Edit Duration (mins):", duration);
  let newDueDate = prompt("Edit Due Date:", dueDate);
  let newPriority = prompt("Edit Priority (high, medium, low):", priority);


  //update task details
  li.innerHTML = `<strong>${newTask}</strong> (User: ${newUser}, Duration: ${newDuration} mins, Due: ${newDueDate})`;//updates the <li> to show new details


  //apply new priority color(changes color based on priority)
  if (newPriority === "high") li.style.color = "red";
  else if (newPriority === "medium") li.style.color = "yellow";
  else li.style.color = "green";
//update priority attribute
  li.setAttribute("data-priority", newPriority); //updates the priority for future sorting


  //recreate buttons after editing
  let btn = document.createElement("button");
  btn.textContent = "x";
  btn.addEventListener("click", handleDelete);
  li.appendChild(btn);

  let editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => editTask(li, newTask, newUser, newDuration, newDueDate, newPriority));
  li.appendChild(editBtn);

  //deletes & re adds the delete and edit buttons after modifying
}
