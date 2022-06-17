const url = 'http://localhost:8000/';
let tasks = [];

window.onload = () => {
  try { 
    document.querySelector('.todo__input').addEventListener("change", addTask);
    document.querySelector('.todo-btn').addEventListener("click", addTask);
    document.querySelector('.todo-btn:last-child').addEventListener("click", deleteAllTask);
  } catch(e) {
    return
  }
  getAlltask();
}

const getAlltask = async () => {
  const resp = await fetch(`${url}allTasks`, {
    method: 'GET'
  });
  result = await resp.json();
  tasks = result.data;
  render();
}

const render = () => {
  const tasksCopy = [ ...tasks ];
  tasksCopy.sort((a, b) => a.isCheck > b.isCheck ? 1 : -1);
  const taskrend = document.querySelector('.todo__tasks');

  while (taskrend.firstChild) {
    taskrend.removeChild(taskrend.firstChild)
  }
  tasksCopy.forEach((elem, index) => {
    const task = document.createElement('div');
    task.id = `${elem._id}`;
    task.classList.add('todo__task');
    const checkB = document.createElement("INPUT");
    checkB.setAttribute("type", "checkbox");
    if (elem.isCheck) {
      task.classList.add("todo__task_complete");
    } else {
      task.classList.remove("todo__task_complete");
    }
    const text = document.createElement('div');
    text.innerText = elem.text;
    task.appendChild(checkB);
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
    checkB.onchange = () => {
      onChangeCheckbox(elem);
    }

    task.appendChild(editImg);
    task.appendChild(delImg);
    taskrend.appendChild(task);
  })
}

const addTask = async (event) => {
  let value = '';
  value = event.target.value;
  if (value && value.trim() !== '') {
    const resp = await fetch(`${url}createTask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        text: value,
        isCheck: false
      })
    });
    value = '';
    event.target.value = '';
    const result = await resp.json();
    tasks.push(result);
    render();
  }
}

const onChangeCheckbox = async (elem) => {
  const resp = await fetch(`${url}updateTask`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
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
      const resp = await fetch(`${url}updateTask`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
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
  const resp = await fetch(`${url}deleteTask?_id=${id}`, {
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
  const resp = await fetch(`${url}deleteAllTask`, {
    method: 'DELETE'
  });
  tasks = [];
  render();
}