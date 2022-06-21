const url = 'http://localhost:8000';
const headerValue = 'application/json;charset=utf-8'
let tasks = [];

window.onload = () => {
  try {
    document.querySelector('.todo-btn:last-child').addEventListener("click", deleteAllTask);
    const input = document.querySelector('.todo__input');
    input.onchange = () => {
      addTask(input);
    }

    const inputBtn = document.querySelector('.todo-btn');
    inputBtn.onclick = () => {
      addTask(input);
    }

  } catch (err) {
    console.error(err);
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
    console.error(err);
  }
}

const render = () => {
  try {
    const tasksCopy = [...tasks];
    if (document.querySelector('.todo__tasks')) {
      const tasksHTML = document.querySelector('.todo__tasks');
      while (tasksHTML.firstChild) {
        tasksHTML.removeChild(tasksHTML.firstChild)
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
        task.appendChild(text);

        const editBtn = document.createElement('button');
        const editImg = document.createElement('img');
        editImg.src = 'icons/edit-btn.png';
        editBtn.appendChild(editImg);
        editBtn.classList.add('edit-btn');

        const delBtn = document.createElement('button');
        const delImg = document.createElement('img');
        delImg.src = 'icons/remove-btn.png';
        delBtn.appendChild(delImg);
        delBtn.classList.add('del-btn');

        editBtn.onclick = () => {
          if (!elem.isCheck) {
            if (!task.classList.contains('edit')) {
              task.classList.add('edit');
              const edit = document.createElement("input");
              edit.type = "text";
              edit.value = elem.text;
              edit.onchange = () => {
                const text = task.lastChild.value;
                editTask(elem._id, elem.isCheck, text);
              }
              task.appendChild(edit);
              edit.focus();
            } else {
              const text = task.lastChild.value;
              task.classList.remove('edit');
              task.removeChild(task.lastChild);
              if (elem.text != text) {
                editTask(elem._id, elem.isCheck, text);
              }
            }
          }
        }
        delBtn.onclick = () => {
          deleteTask(elem._id);
        }
        checkBox.onchange = () => {
          onChangeCheckbox(elem.isCheck, elem._id);
        }

        task.appendChild(editBtn);
        task.appendChild(delBtn);

        const theFirstChild = tasksHTML.firstChild;

        if (elem.isCheck) {
          tasksHTML.appendChild(task);
        } else {
          tasksHTML.insertBefore(task, theFirstChild)
        }
      })
    } else {
      return console.error('error')
    }
  } catch {
    console.error(err);
  }
}

const addTask = async (input) => {
  try {
    let inputText = '';
    inputText = input.value;
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
      input.value = '';
      const result = await resp.json();
      tasks.push(result);
      render();
    }
  } catch (err) {
    console.error(err);
  }
}

const onChangeCheckbox = async (check, _id) => {
  try {
    const resp = await fetch(`${url}/completeTask`, {
      method: 'PATCH',
      headers: {
        'Content-Type': headerValue
      },
      body: JSON.stringify({
        isCheck: !check,
        _id
      })
    });
    const [task] = await resp.json();
    tasks.forEach((element, index) => {
      if (element._id === _id) {
        tasks[index].isCheck = task.isCheck;
      }
    })
    render();
  } catch {
    console.error(err);
  }
}

const editTask = async (id, check, text) => {
  try {
    if (!check) {
      const edit = text;
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
  } catch (err) {
    console.error(err);
  }
}

const deleteTask = async (id) => {
  try {
    const resp = await fetch(`${url}/deleteTask?_id=${id}`, {
      method: 'DELETE'
    });
    const result = await resp.json();

    if (result.deletedCount === 1) {
      tasks = tasks.filter((task) => {
        return task._id !== id
      })
    }
    render();
  } catch (err) {
    console.error(err);
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
    console.error(err);
  }
}