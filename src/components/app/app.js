import { React, Component } from 'react';

import AppHeader from '../app-header';
import NewTaskForm from '../new-task-form';
import TaskList from '../task-list';
import Footer from '../footer';

class App extends Component {
  id = 1;

  constructor() {
    super();
    this.state = {
      todoData: [
        this.createTodoItem('Task 1', 2, 3),
        this.createTodoItem('Task 2', 13, 26),
        this.createTodoItem('Task 3', 14, 27),
      ],
      filter: 'all',
    };

    this.deleteItem = (id) => {
      this.setState(({ todoData }) => {
        const index = todoData.findIndex((el) => el.id === id);

        const newArray = [...todoData.slice(0, index), ...todoData.slice(index + 1)];

        return {
          todoData: newArray,
        };
      });
    };

    this.addItem = (text, min, sec) => {
      const newItem = this.createTodoItem(text, min, sec);

      this.setState(({ todoData }) => {
        const newArray = [...todoData, newItem];

        return {
          todoData: newArray,
        };
      });
    };

    // this.editItem = (text) => {

    // }

    this.toggleProperty = (arr, id, propName) => {
      const index = arr.findIndex((el) => el.id === id);

      const oldItem = arr[index];
      const newItem = {
        ...oldItem,
        [propName]: !oldItem[propName],
      };

      return [...arr.slice(0, index), newItem, ...arr.slice(index + 1)];
    };

    this.changeLabel = (arr, id, value) => {
      console.log(arr);
      console.log(id);
      console.log(value);
      const index = arr.findIndex((el) => el.id === id);
      const oldItem = arr[index];
      console.log(oldItem);
      const newItem = {
        ...oldItem,
        label: value,
      };
      console.log(newItem);

      return [...arr.slice(0, index), newItem, ...arr.slice(index + 1)];
    };

    this.getLabel = (label) => {
      console.log(label);
      return label;
    };

    this.getIdItem = (id) => {
      this.setState(({ todoData }) => {
        return {
          todoData: this.changeLabel(todoData, id, this.getLabel()),
        };
      });
    };

    this.onToggleDone = (id) => {
      this.setState(({ todoData }) => {
        return {
          todoData: this.toggleProperty(todoData, id, 'completed'),
        };
      });
    };

    this.onToggleEdit = (id) => {
      this.state.todoData.map((item) => {
        item.edit = false;
        return item;
      });

      this.setState(({ todoData }) => {
        return {
          todoData: this.toggleProperty(todoData, id, 'edit'),
        };
      });
    };

    this.filter = (items, filter) => {
      switch (filter) {
        case 'all':
          return items;
        case 'active':
          return items.filter((item) => !item.completed);
        case 'completed':
          return items.filter((item) => item.completed);
        default:
          return items;
      }
    };

    this.onFilterChange = (filter) => {
      this.setState({ filter });
    };

    this.clearDone = () => {
      this.setState(({ todoData }) => {
        const active = todoData.filter((el) => !el.completed);

        return {
          todoData: active,
        };
      });
    };
  }

  createTodoItem(label, minutes, seconds) {
    return {
      id: this.id++,
      label,
      minutes,
      seconds,
      completed: false,
      edit: false,
    };
  }

  render() {
    const { todoData, filter } = this.state;
    const visibleItems = this.filter(todoData, filter);

    const doneCount = todoData.filter((item) => item.completed).length;
    const todoCount = todoData.length - doneCount;

    return (
      <div className="todoapp">
        <AppHeader />
        <NewTaskForm onItemAdded={this.addItem} />
        <section className="main">
          <TaskList
            todos={visibleItems}
            onDeleted={this.deleteItem}
            onToggleDone={this.onToggleDone}
            onToggleEdit={this.onToggleEdit}
            onEditItem={this.editItem}
            getLabel={this.getLabel}
            getIdItem={this.getIdItem}
          />
          <Footer
            toDo={todoCount}
            filter={filter}
            todos={todoData}
            onFilterChange={this.onFilterChange}
            onDoneClear={this.clearDone}
          />
        </section>
      </div>
    );
  }
}

export default App;
