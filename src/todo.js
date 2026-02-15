class Todo {
  #id;

  constructor(id, text, completed = false) {
    this.#id = id;
    this.text = text;
    this.completed = completed;
  }

  toggle() {
    this.completed = !this.completed;
  }

  get Id() {
    return this.#id;
  }
}

const todo = new Todo(1, "Buy milk");
