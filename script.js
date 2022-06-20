const url = 'http://localhost:8000';
const headerValue = 'application/json;charset=utf-8'
let tasks = [];

window.onload = () => {
  try {
    document.querySelector('.todo__input').addEventListener("change", addTask);
    document.querySelector('.todo-btn').addEventListener("click", addTask);
    document.querySelector('.todo-btn:last-child').addEventListener("click", deleteAllTask);
  } catch (e) {
    return
  }
  getAllTask();
}

const getAllTask = async () => {
  const resp = await fetch(`${url}/allTasks`, {
    method: 'GET'
  });
  const result = await resp.json();
  tasks = result.data;
  render();
}

const render = () => {
  const tasksCopy = [...tasks];
  tasksCopy.sort((a, b) => a.isCheck > b.isCheck ? 1 : -1);
  if (document.querySelector('.todo__tasks')) {
    const tasksDiv = document.querySelector('.todo__tasks');
    while (tasksDiv.firstChild) {
      tasksDiv.removeChild(tasksDiv.firstChild)
    }
    tasksCopy.forEach((elem, index) => {
      const task = document.createElement('div');
      task.id = `${elem._id}`;
      task.classList.add('todo__task');
      const checkBox = document.createElement("input");
      checkBox.type = "checkbox";
      if (elem.isCheck) {
        task.classList.add("todo__task_complete");
      } else {
        task.classList.remove("todo__task_complete");
      }
      const text = document.createElement('div');
      text.innerText = elem.text;
      task.appendChild(checkBox);
      task.appendChild(text)

      const editImg = document.createElement('img');
      const delImg = document.createElement('img');
      editImg.src = 'icons/edit-btn.png';
      delImg.src = 'icons/remove-btn.png';
      editImg.onclick = () => {
        editTask(elem._id, elem.isCheck);
      }
      delImg.onclick = () => {
        deleteTask(elem._id);
      }
      checkBox.onchange = () => {
        onChangeCheckbox(elem);
      }

      task.appendChild(editImg);
      task.appendChild(delImg);
      tasksDiv.appendChild(task);
    })
  } else {
    return console.error('error')
  }
}

const addTask = async (event) => {
  let inputText = '';
  inputText = event.target.value;
  if (inputText && inputText.trim() !== '') {
    const resp = await fetch(`${url}/createTask`, {
      method: 'POST',
      headers: {
        'Content-Type': headerValue
      },
      body: JSON.stringify({
        text: inputText,
        isCheck: false
      })
    });
    inputText = '';
    event.target.value = '';
    const result = await resp.json();
    tasks.push(result);
    render();
  }
}

const onChangeCheckbox = async (elem) => {
  const resp = await fetch(`${url}/completeTask`, {
    method: 'PATCH',
    headers: {
      'Content-Type': headerValue
    },
    body: JSON.stringify({
      isCheck: !elem.isCheck,
      _id: elem._id
    })
  });
  tasks.forEach((element, index) => {
    if (element._id === elem._id) {
      tasks[index].isCheck = !elem.isCheck;
    }
  })
  render();
}

const editTask = async (id, check) => {
  if (!check) {
    const edit = prompt('Введите новый текст', '');
    if (edit) {
      const resp = await fetch(`${url}/updateTask`, {
        method: 'PATCH',
        headers: {
          'Content-Type': headerValue
        },
        body: JSON.stringify({
          text: edit,
          _id: id
        })
      });
      tasks.forEach((element, index) => {
        if (element._id === id) {
          tasks[index].text = edit;
        }
      })
      render();
    }
  }
}

const deleteTask = async (id) => {
  const resp = await fetch(`${url}/deleteTask?_id=${id}`, {
    method: 'DELETE'
  });

  tasks.forEach((element, index) => {
    if (element._id === id) {
      tasks.splice(index, 1);
    }
  })
  render();
}

const deleteAllTask = async () => {
  const resp = await fetch(`${url}/deleteAllTask`, {
    method: 'DELETE'
  });
  tasks = [];
  render();
}