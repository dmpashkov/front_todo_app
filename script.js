const url = 'http://localhost:8000';
const headers = {
  'Content-Type': 'application/json;charset=utf-8'
}
let tasks = [];

window.onload = () => {
  try {
    if (document.querySelector('.todo-btn:last-child')
      && document.querySelector('.todo__input')
      && document.querySelector('.todo-btn')) {

      document.querySelector('.todo-btn:last-child').addEventListener("click", deleteAllTask);
      const input = document.querySelector('.todo__input');
      input.onchange = () => {
        addTask(input);
      }

      const inputBtn = document.querySelector('.todo-btn');
      inputBtn.onclick = () => {
        addTask(input);
      }
    } else {
      throw new Error();
    }

  } catch (err) {
    throw err
  }
  getAllTask();
}

const getAllTask = async () => {
  try {
    const resp = await fetch(`${url}/allTasks`, {
      method: 'GET'
    });
    const result = await resp.json();
    tasks = result.data;
    render();
  } catch (err) {
    throw err;
  }
}

const render = () => {
  try {
    const tasksCopy = [...tasks];
    if (!document.querySelector('.todo__tasks')) {
      throw new Error();
    }
    const tasksDiv = document.querySelector('.todo__tasks');
    while (tasksDiv.firstChild) {
      tasksDiv.removeChild(tasksDiv.firstChild)
    }
    tasksCopy.forEach(elem => {
      const { _id, text, isCheck } = elem;
      const task = document.createElement('div');
      task.id = `${_id}`;
      task.classList.add('todo__task');
      const checkBox = document.createElement("input");
      checkBox.type = "checkbox";
      if (isCheck) {
        task.classList.add("todo__task_complete");
      } else {
        task.classList.remove("todo__task_complete");
      }
      const taskText = document.createElement('div');
      taskText.innerText = text;
      task.appendChild(checkBox);
      task.appendChild(taskText);

      const editButton = document.createElement('button');
      const editIcon = document.createElement('img');
      editIcon.src = 'icons/edit-btn.png';
      editButton.appendChild(editIcon);
      editButton.classList.add('edit-btn');

      const deleteButton = document.createElement('button');
      const deleteIcon = document.createElement('img');
      deleteIcon.src = 'icons/remove-btn.png';
      deleteButton.appendChild(deleteIcon);
      deleteButton.classList.add('del-btn');

      isCheck
        ? editButton.style.visibility = "hidden"
        : editButton.style.visibility = "visible";

      editButton.onclick = () => {
        creatEditInput(_id, text);
      }

      deleteButton.onclick = () => {
        deleteTask(_id);
      }

      checkBox.onchange = () => {
        onChangeCheckbox(isCheck, _id);
      }

      task.appendChild(editButton);
      task.appendChild(deleteButton);

      const theFirstChild = tasksDiv.firstChild;

      isCheck
        ? tasksDiv.appendChild(task)
        : tasksDiv.insertBefore(task, theFirstChild)
    })
  } catch (err) {
    throw err;
  }
}

const creatEditInput = async (_id, text) => {
  const task = document.getElementById(`${_id}`);
  if (!task.classList.contains('edit')) {
    task.classList.add('edit');
    const edit = document.createElement("input");
    edit.type = "text";
    edit.value = text;
    edit.onchange = () => {
      text = task.lastChild.value;
      editTask(_id, text);
    }
    task.appendChild(edit);
    edit.focus();
  } else {
    task.classList.remove('edit');
    text = task.lastChild.value;
    task.removeChild(task.lastChild);
    if (text != text) {
      editTask(_id, text);
    }
  }
}

const addTask = async (input) => {
  try {
    let inputText = input.value;
    if (inputText.trim() === '') {
      throw new Error()
    }
    const resp = await fetch(`${url}/createTask`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        text: inputText,
        isCheck: false
      })
    });
    const result = await resp.json();
    tasks.push(result);
    input.value = '';
    render();
  } catch (err) {
    input.value = '';
    throw err;
  }
}

const onChangeCheckbox = async (check, _id) => {
  try {
    const resp = await fetch(`${url}/completeTask`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        isCheck: !check,
        _id
      })
    });
    const result = await resp.json();
    tasks.forEach(element => {
      if (element._id === result._id) {
        element.isCheck = !result.isCheck;
      }
    })
    render();
  } catch (err) {
    throw err;
  }
}

const editTask = async (id, text) => {
  try {
    const edit = text;
    if (edit) {
      const resp = await fetch(`${url}/updateTask`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          text: edit,
          _id: id
        })
      });
      tasks.forEach(element => {
        if (element._id === id) {
          element.text = edit;
        }
      })
      render();
    }
  } catch (err) {
    throw err;
  }
}

const deleteTask = async (id) => {
  try {
    const resp = await fetch(`${url}/deleteTask?_id=${id}`, {
      method: 'DELETE'
    });
    const result = await resp.json();

    if (result.deletedCount) {
      tasks = tasks.filter((task) => task._id !== id)
    }
    render();
  } catch (err) {
    throw err;
  }
}

const deleteAllTask = async () => {
  try {
    const resp = await fetch(`${url}/deleteAllTask`, {
      method: 'DELETE'
    });
    tasks = [];
    render();
  } catch (err) {
    throw err;
  }
}
