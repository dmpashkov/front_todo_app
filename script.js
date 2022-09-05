const url = 'http://localhost:8000';
const headers = {
  'Content-Type': 'application/json;charset=utf-8'
}
let tasks = [];

window.onload = () => {
  getAllTasks();
}

const getAllTasks = async () => {
  try {
    const resp = await fetch(`${url}/tasks`, {
      method: 'GET'
    });
    const result = await resp.json();
    tasks = result.data;
    render();
  } catch (err) {
    getError("Cannot connect to the server.");
  }
}

const render = () => {
  const tasksCopy = [...tasks];
  const todoTasks = document.querySelector('.todo__tasks');
  if (todoTasks === null) {
    return;
  }
  while (todoTasks.firstChild) {
    todoTasks.removeChild(todoTasks.firstChild)
  }
  tasksCopy.forEach(elem => {
    const { _id, text, isCheck } = elem;

    const task = document.createElement('div');
    task.id = `task-${_id}`;
    task.classList.add('todo__task');

    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    task.appendChild(checkBox);

    const taskText = document.createElement('div');
    taskText.innerText = text;
    task.appendChild(taskText);

    const editButton = document.createElement('button');
    const editIcon = document.createElement('img');
    editIcon.alt = "edit";
    editIcon.src = 'icons/edit-btn.png';
    editButton.appendChild(editIcon);
    editButton.classList.add('edit-btn');

    const deleteButton = document.createElement('button');
    const deleteIcon = document.createElement('img');
    deleteIcon.alt = "remove";
    deleteIcon.src = 'icons/remove-btn.png';
    deleteButton.appendChild(deleteIcon);
    deleteButton.classList.add('delete-button');

    editButton.onclick = () => {
      creatEditInput(_id, text);
    }

    deleteButton.onclick = () => {
      deleteTask(_id);
    }

    checkBox.onchange = () => {
      onChangeCheckbox(isCheck, _id);
    }

    const theFirstChild = todoTasks.firstChild;

    if (isCheck) {
      task.classList.add("todo__task_complete");
      todoTasks.appendChild(task);
    } else {
      task.classList.remove("todo__task_complete");
      task.appendChild(editButton);
      todoTasks.insertBefore(task, theFirstChild);
    }
    task.appendChild(deleteButton);
  })
}

const creatEditInput = (_id, text) => {
  const task = document.getElementById(`task-${_id}`);
  const editBtn = task.lastChild.previousSibling;
  const editIcon = task.lastChild.previousSibling.lastChild;
  if (task === null
    || editBtn == null
    || editIcon == null
  ) {
    return;
  }
  if (!task.classList.contains('edit')) {
    task.classList.add('edit');
    const edit = document.createElement("input");
    edit.type = "text";
    edit.value = text;
    editIcon.src = "icons/done.png";

    editBtn.onclick = () => {
      text = task.lastChild.value;
      editTask(_id, text);
    }
    task.appendChild(edit);
    edit.focus();
  } else {
    editIcon.src = "icons/edit-btn.png";
    task.classList.remove('edit');
    task.removeChild(task.lastChild);
  }
}

const getError = (error) => {
  const showError = document.querySelector('.error');
  if (showError === null) {
    return;
  }
  showError.innerHTML = error;
  showError.style.display = 'block'
  setTimeout(() => showError.style.display = 'none', 2000);
}

const addTask = async () => {
  try {
    const input = document.querySelector('.todo__input');
    let inputText = input.value;
    if (inputText.trim() === '') {
      getError('the field must not be empty');
      return;
    }
    const resp = await fetch(`${url}/tasks`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        text: inputText
      })
    });
    const result = await resp.json();
    tasks.push(result);
    input.value = '';
    render();
  } catch (err) {
    getError('something went wrong');
  }
}

const onChangeCheckbox = async (check, _id) => {
  try {
    const resp = await fetch(`${url}/tasks/${_id}/toggle`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        isCheck: !check
      })
    });
    const result = await resp.json();
    tasks.forEach(element => {
      if (element._id === result._id) {
        element.isCheck = result.isCheck;
      }
    })
    render();
  } catch (err) {
    getError('something went wrong');
  }
}

const editTask = async (id, text) => {
  try {
    if (text.trim() === '') {
      getError('the field must not be empty');
      return;
    }

    const resp = await fetch(`${url}/tasks/${id}/text`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        text: text.replace(/\s+/g, ' ').trim()
      })
    });
    const result = await resp.json();
    tasks.forEach(element => {
      if (element._id === id) {
        element.text = result.text;
      }
    })
    render();
  } catch (err) {
    getError('something went wrong');
  }
}

const deleteTask = async (id) => {
  try {
    const resp = await fetch(`${url}/tasks/${id}`, {
      method: 'DELETE'
    });
    const result = await resp.json();
    if (result.deletedCount === 1) {
      tasks = tasks.filter((task) => task._id !== id)
    }
    render();
  } catch (err) {
    getError('something went wrong');
  }
}

const deleteAllTask = async () => {
  try {
    const resp = await fetch(`${url}/tasks`, {
      method: 'DELETE'
    });
    tasks = [];
    render();
  } catch (err) {
    getError('something went wrong');
  }
}
