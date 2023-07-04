import React, { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';

import AppHeader from '../app-header';
import NewTaskForm from '../new-task-form';
import TaskList from '../task-list';
import Footer from '../footer';

function App(props) {
  const idCounter = useRef(1);
  const [editTimestamp, setEditTimestamp] = useState(null);

  const createTodoItem = (label, minutes, seconds) => {
    return {
      id: idCounter.current++,
      label,
      minutes,
      seconds,
      timerIsActive: false,
      completed: false,
      edit: false,
      created: 'created',
      createdTime: new Date(),
      elapsedTime: 'now',
      elapsedTimeInterval: null,
    };
  };

  const [todoData, setTodoData] = useState([
    createTodoItem('Task 1', 2, 3),
    createTodoItem('Task 2', 13, 26),
    createTodoItem('Task 3', 14, 27),
  ]);

  const [filter, setFilter] = useState('all');

  const deleteItem = (id) => {
    setTodoData((prevTodoData) => prevTodoData.filter((el) => el.id !== id));
  };

  const addItem = (text, min, sec) => {
    setTodoData((prevTodoData) => {
      const newItem = createTodoItem(text, min, sec);
      return [...prevTodoData, newItem];
    });
  };

  const toggleProperty = (arr, id, propName) => {
    return arr.map((el) => (el.id === id ? { ...el, [propName]: !el[propName] } : el));
  };

  const setLabel = (id, label) => {
    setTodoData((prevTodoData) => {
      return prevTodoData.map((task) => {
        if (task.id === id) {
          if (task.created === 'created' && task.elapsedTimeInterval) {
            clearInterval(task.elapsedTimeInterval);
          }

          setEditTimestamp(new Date());

          return {
            ...task,
            label,
            created: 'modified',
            edit: false,
            elapsedTime: 'now',
            elapsedTimeInterval: null,
          };
        }
        return task;
      });
    });
  };

  const onToggleDone = (id) => {
    setTodoData((prevTodoData) => toggleProperty(prevTodoData, id, 'completed'));
  };

  const onToggleEdit = (id) => {
    setTodoData((prevTodoData) => {
      const updatedTodoData = prevTodoData.map((item) => ({ ...item, edit: false }));
      return toggleProperty(updatedTodoData, id, 'edit');
    });
  };

  const filterItems = (items, selectedFilter) => {
    switch (selectedFilter) {
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

  const onFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  const clearDone = () => {
    setTodoData((prevTodoData) => prevTodoData.filter((el) => !el.completed));
  };

  const startCountdown = (id) => {
    setTodoData((prevTodoData) => {
      return prevTodoData.map((task) => {
        if (task.id === id && !task.timerIsActive) {
          const timerId = setInterval(() => {
            setTodoData((prevState) => {
              const updatedTodoData = prevState.map((item) => {
                if (item.id === id) {
                  let { minutes, seconds } = item;

                  if (minutes === 0 && seconds === 0) {
                    clearInterval(task.timerId);
                    return { ...item, timerIsActive: false };
                  }

                  if (seconds === 0) {
                    minutes--;
                    seconds = 59;
                  } else {
                    seconds--;
                  }

                  return { ...item, minutes, seconds, timerIsActive: true };
                }

                return item;
              });

              return updatedTodoData;
            });
          }, 1000);

          return { ...task, timerIsActive: true, timerId };
        }

        return task;
      });
    });
  };

  const pauseCountdown = (id) => {
    setTodoData((prevTodoData) => {
      return prevTodoData.map((task) => {
        if (task.id === id && task.timerIsActive) {
          clearInterval(task.timerId);
          return { ...task, timerIsActive: false };
        }
        return task;
      });
    });
  };

  useEffect(() => {
    const { counterInterval } = props;
    const elapsedTimeInterval = setInterval(() => {
      setTodoData((prevTodoData) => {
        const updatedTodoData = prevTodoData.map((task) => {
          const elapsedTime = formatDistanceToNow(task.created === 'edit' ? editTimestamp : task.createdTime, {
            includeSeconds: true,
            addSuffix: true,
          });

          return { ...task, elapsedTime };
        });

        return updatedTodoData;
      });
    }, counterInterval);

    return () => clearInterval(elapsedTimeInterval);
  }, [editTimestamp]);

  const visibleItems = filterItems(todoData, filter);

  const doneCount = todoData.filter((item) => item.completed).length;
  const todoCount = todoData.length - doneCount;

  return (
    <div className="todoapp">
      <AppHeader />
      <NewTaskForm onItemAdded={addItem} />
      <section className="main">
        <TaskList
          todos={visibleItems}
          onDeleted={deleteItem}
          onToggleDone={onToggleDone}
          onToggleEdit={onToggleEdit}
          onEditItem={setLabel}
          setLabel={setLabel}
          onStartCountdown={startCountdown}
          onPauseCountdown={pauseCountdown}
        />
        <Footer
          toDo={todoCount}
          filter={filter}
          todos={todoData}
          onFilterChange={onFilterChange}
          onDoneClear={clearDone}
        />
      </section>
    </div>
  );
}

App.defaultProps = {
  counterInterval: 30000,
};

export default App;
