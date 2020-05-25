let timerId = null;
let preventClick = false;

const createButtons = document.querySelectorAll(".create-task-btn");
createButtons.forEach(function (btn) {
  btn.addEventListener("click", function (e) {
    hideMessagePanel();
    const taskList = document.querySelector("#task-list");
    const newTaskItem = createTaskItem();
    taskList.append(newTaskItem);
    // Set focus on the created task
    newTaskItem.querySelector("input[type='text']").focus();
  });
});

function hideMessagePanel() {
  const panel = document.querySelector("#message-panel");
  if (panel.style.display !== "none") {
    panel.style.display = "none";
  }
}

function createTaskItem() {
  const task = document.createElement("li");
  task.classList.add("task-list__item");

  const inputField = createInput();
  task.append(inputField);

  const deleteTaskButton = createDeleteTaskButton();
  task.append(deleteTaskButton);

  return task;
}

function createInput() {
  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.addEventListener("blur", function (e) {
    if (this.savedValue && this.value.length === 0) {
      this.value = this.savedValue;
    } else if (this.value.length === 0) {
      this.parentElement.remove();
    } else {
      this.savedValue = this.value;
    }
    this.setAttribute("readonly", null);
  });

  inputField.addEventListener("click", function (e) {
    if (
      preventClick ||
      (this === document.activeElement && !this.getAttribute("readonly"))
    ) {
      return;
    }

    timerId = setTimeout(() => {
      this.classList.toggle("done");
      this.blur();
      preventClick = false;
    }, 200);

    preventClick = true;
  });

  inputField.addEventListener("dblclick", function (e) {
    clearTimeout(timerId);
    preventClick = false;
    this.classList.remove("done");
    this.removeAttribute("readonly");
    this.focus();
  });

  return inputField;
}

function createDeleteTaskButton() {
  const deleteTaskButton = document.createElement("button");
  deleteTaskButton.classList.add("delete-task-btn");
  const trashIcon = document.createElement("i");
  trashIcon.classList.add("fas", "fa-trash");
  deleteTaskButton.append(trashIcon);
  deleteTaskButton.addEventListener("click", function (e) {
    this.parentElement.remove();
  });

  return deleteTaskButton;
}
