import React, { useState, useEffect, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';

import AppHeader from '../app-header';
import NewTaskForm from '../new-task-form';
import TaskList from '../task-list';
import Footer from '../footer';

function App() {
  let idCounter = 1;

  const createTodoItem = (label, minutes, seconds) => {
    const newItem = {
      id: idCounter,
      label,
      minutes,
      seconds,
      timerIsActive: false,
      completed: false,
      edit: false,
      created: 'created',
      createdTime: new Date(),
      elapsedTime: 'now',
    };

    idCounter++;

    return newItem;
  };

  const [todoData, setTodoData] = useState([
    createTodoItem('Task 1', 2, 3),
    createTodoItem('Task 2', 13, 26),
    createTodoItem('Task 3', 14, 27),
  ]);

  const [filter, setFilter] = useState('all');

  const deleteItem = useCallback((id) => {
    setTodoData((prevTodoData) => prevTodoData.filter((el) => el.id !== id));
  }, []);

  const addItem = useCallback((text, min, sec) => {
    const newItem = createTodoItem(text, min, sec);
    setTodoData((prevTodoData) => [...prevTodoData, newItem]);
  }, []);

  const toggleProperty = useCallback((arr, id, propName) => {
    return arr.map((el) => (el.id === id ? { ...el, [propName]: !el[propName] } : el));
  }, []);

  const setLabel = useCallback((id, label) => {
    setTodoData((prevTodoData) => {
      return prevTodoData.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            label,
            created: 'edit',
            edit: false,
          };
        }
        return task;
      });
    });
  }, []);

  const onToggleDone = (id) => {
    setTodoData(toggleProperty(todoData, id, 'completed'));
  };

  const onToggleEdit = useCallback(
    (id) => {
      setTodoData((prevTodoData) => {
        const updatedTodoData = prevTodoData.map((item) => ({ ...item, edit: false }));
        return toggleProperty(updatedTodoData, id, 'edit');
      });
    },
    [toggleProperty]
  );

  const filterItems = useCallback((items, selectedFilter) => {
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
  }, []);

  const onFilterChange = useCallback((selectedFilter) => {
    setFilter(selectedFilter);
  }, []);

  const clearDone = useCallback(() => {
    setTodoData((prevTodoData) => prevTodoData.filter((el) => !el.completed));
  }, []);

  const startCountdown = useCallback((id) => {
    const timers = {};

    setTodoData((prevTodoData) => {
      return prevTodoData.map((task) => {
        if (task.id === id && !task.timerIsActive) {
          const timer = setInterval(() => {
            setTodoData((prevState) => {
              const updatedTodoData = prevState.map((t) => {
                if (t.id === id) {
                  let { minutes, seconds } = t;

                  if (minutes === 0 && seconds === 0) {
                    clearInterval(timers[id]);
                    return { ...t, timerIsActive: false };
                  }

                  if (seconds === 0) {
                    minutes--;
                    seconds = 59;
                  } else {
                    seconds--;
                  }

                  return { ...t, minutes, seconds, timerIsActive: true };
                }

                return t;
              });

              return updatedTodoData;
            });
          }, 1000);

          timers[id] = timer;

          return { ...task, timerIsActive: true };
        }

        return task;
      });
    });
  }, []);

  const pauseCountdown = useCallback((id) => {
    setTodoData((prevTodoData) => {
      const updatedTodoData = prevTodoData.map((task) => {
        if (task.id === id) {
          return { ...task, timerIsActive: false };
        }
        return task;
      });

      return updatedTodoData;
    });
  }, []);

  useEffect(() => {
    const elapsedTimeInterval = setInterval(() => {
      setTodoData((prevTodoData) => {
        const updatedTodoData = prevTodoData.map((task) => {
          const elapsedTime = formatDistanceToNow(task.createdTime, { includeSeconds: true, addSuffix: true });
          return { ...task, elapsedTime };
        });

        return updatedTodoData;
      });
    }, 1000);

    return () => clearInterval(elapsedTimeInterval);
  }, []);

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

export default App;
