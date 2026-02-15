import "./style.css";

// user interaction -> state changes -> UI change

const createTodoApp = () => {
  // State of the app
  let todos = [];
  let nextTodoId = 1;
  let filter = "all"; // can be "all", "active", "completed"

  const filterTodo = () => {
    if (filter === "active") {
      return todos.filter((todo) => !todo.completed);
    } else if (filter === "completed") {
      return todos.filter((todo) => todo.completed);
    } else {
      return [...todos];
    }
  };

  return {
    addTodo: (todoText) => {
      todos = [
        ...todos,
        {
          id: nextTodoId++,
          text: todoText,
          completed: false,
        },
      ];
    },
    toggleTodo: (todoId) => {
      todos = todos.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              completed: !todo.completed,
            }
          : todo,
      );
    },
    markAllCompleted: () => {
      todos = todos.map((todo) => ({ ...todo, completed: true }));
    },
    clearCompleted: () => {
      todos = todos.filter((todo) => !todo.completed);
    },
    getTodos: () => filterTodo(),
    getNumberOfActiveTodos: () =>
      todos.reduce((count, todo) => count + (todo.completed ? 0 : 1), 0),
    setFilter: (newFilter) => {
      filter = newFilter;
    },
  };
};

// get HTML elements
const todoNav = document.getElementById("todo-nav");
const newTodoInput = document.getElementById("new-todo");
const todoList = document.getElementById("todo-list");
const markAllCompleted = document.getElementById("mark-all-completed");
const clearCompleted = document.getElementById("clear-completed");
const activeTodoCount = document.getElementById("todo-count");

const todoApp = createTodoApp();

const createTodoText = (todo) => {
  const todoText = document.createElement("div");
  todoText.classList.add("todo-text");
  todoText.setAttribute("id", `todo-text-${todo.id}`);
  if (todo.completed) {
    todoText.classList.add("line-through");
  }
  todoText.textContent = todo.text;
  return todoText;
};

const createTodoInput = (todo) => {
  const todoEdit = document.createElement("div");
  todoEdit.classList.add("hidden", "todo-edit");
  todoEdit.value = todo.text;
  return todoEdit;
};

const createTodoItem = (todo) => {
  const todoItem = document.createElement("div");
  todoItem.classList.add("p-4", "todo-item");
  todoItem.append(createTodoText(todo), createTodoInput(todo));
  return todoItem;
};

const renderTodos = () => {
  todoList.replaceChildren(...todoApp.getTodos().map(createTodoItem));
  activeTodoCount.textContent = `${todoApp.getNumberOfActiveTodos()} items left`;
};

const updateClassList = (element, isActive) => {
  const classes = [
    "underline",
    "underline-offset-4",
    "decoration-rose-700",
    "decoration-2",
  ];
  if (isActive) {
    element.classList.add(...classes);
  } else {
    element.classList.remove(...classes);
  }
};

const renderTodoNavBar = (hrefValue) => {
  Array.from(todoNav.children).forEach((e) =>
    updateClassList(e, e.href === hrefValue),
  );
};

const handleNewTodoKeyDown = (event) => {
  const newTodoInput = event.target;
  const todoText = newTodoInput.value.trim();

  if (event.key === "Enter" && todoText !== "") {
    todoApp.addTodo(todoText);
    newTodoInput.value = "";
    renderTodos();
  }
};

const handleClickOnNavbar = (event) => {
  if (event.target.tagName === "A") {
    const hrefValue = event.target.href;
    todoApp.setFilter(hrefValue.split("/").pop() || "all");
    renderTodos();
    renderTodoNavBar(hrefValue);
  }
};

const handleClickOnTodoList = (event) => {
  if (event.target.id.includes("todo-text")) {
    const todoId = event.target.id.split("-").pop();
    todoApp.toggleTodo(Number(todoId));
    renderTodos();
  }
};

const handleClickOnMarkAllCompleted = () => {
  todoApp.markAllCompleted();
  renderTodos();
};

const handleClickOnClearCompleted = () => {
  todoApp.clearCompleted();
  renderTodos();
};

// event listeners
newTodoInput.addEventListener("keydown", handleNewTodoKeyDown);
todoNav.addEventListener("click", handleClickOnNavbar);
todoList.addEventListener("click", handleClickOnTodoList);
markAllCompleted.addEventListener("click", handleClickOnMarkAllCompleted);
clearCompleted.addEventListener("click", handleClickOnClearCompleted);
document.addEventListener("DOMContentLoaded", renderTodos);
