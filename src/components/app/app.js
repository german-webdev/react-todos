/* eslint-disable react/no-access-state-in-setstate */
import { React, Component } from 'react';

import AppHeader from '../app-header';
import NewTaskForm from '../new-task-form';
import TaskList from '../task-list';
import Footer from '../footer';

class App extends Component {
  id = 1;

  timers = {};

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

    this.toggleProperty = (arr, id, propName) => {
      const index = arr.findIndex((el) => el.id === id);

      const oldItem = arr[index];
      const newItem = {
        ...oldItem,
        [propName]: !oldItem[propName],
      };

      return [...arr.slice(0, index), newItem, ...arr.slice(index + 1)];
    };

    this.setLabel = (id, label) => {
      const { todoData } = this.state;
      const taskIndex = todoData.findIndex((task) => task.id === id);
      todoData[taskIndex].label = label;
      todoData[taskIndex].edit = false;

      this.setState({ todoData });
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

    this.startCountdown = (id) => {
      const updatedTodoData = this.state.todoData.map((task) => {
        if (task.id === id && !task.timerIsActive) {
          const timer = setInterval(() => {
            this.setState((prevState) => {
              const { todoData } = prevState;
              const taskIndex = todoData.findIndex((t) => t.id === id);
              const currentTask = todoData[taskIndex];

              let { minutes, seconds } = currentTask;

              if (minutes === 0 && seconds === 0) {
                clearInterval(this.timers[id]);
                return {
                  todoData: [
                    ...todoData.slice(0, taskIndex),
                    { ...currentTask, timerIsActive: false },
                    ...todoData.slice(taskIndex + 1),
                  ],
                };
              }

              if (seconds === 0) {
                minutes--;
                seconds = 59;
              } else {
                seconds--;
              }

              return {
                todoData: [
                  ...todoData.slice(0, taskIndex),
                  { ...currentTask, minutes, seconds, timerIsActive: true },
                  ...todoData.slice(taskIndex + 1),
                ],
              };
            });
          }, 1000);

          this.timers[id] = timer;

          return {
            ...task,
            timerIsActive: true,
          };
        }

        return task;
      });

      this.setState({ todoData: updatedTodoData });
    };

    this.pauseCountdown = (id) => {
      clearInterval(this.timers[id]);
      delete this.timers[id];

      const updatedTodoData = this.state.todoData.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            timerIsActive: false,
          };
        }

        return task;
      });

      this.setState({ todoData: updatedTodoData });
    };
  }

  componentWillUnmount() {
    Object.values(this.timers).forEach((timer) => clearInterval(timer));
  }

  createTodoItem(label, minutes, seconds) {
    return {
      id: this.id++,
      label,
      minutes,
      seconds,
      timerIsActive: false,
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
            setLabel={this.setLabel}
            onStartCountdown={this.startCountdown}
            onPauseCountdown={this.pauseCountdown}
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
