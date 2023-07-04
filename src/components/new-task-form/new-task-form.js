import React, { useState, useEffect } from 'react';

function NewTaskForm({ onItemAdded }) {
  const [label, setLabel] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  const onLabelChange = (event) => {
    setLabel(event.target.value);
  };

  const onMinutesChange = (event) => {
    setMinutes(event.target.value);
  };

  const onSecondsChange = (event) => {
    setSeconds(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (label !== '' && minutes !== '' && seconds !== '') {
      onItemAdded(label, Number(minutes), Number(seconds));
      setLabel('');
      setMinutes('');
      setSeconds('');
    }
  };

  useEffect(() => {
    const keyDownEventHandler = (event) => {
      if (event.key === 'Enter') {
        onSubmit(event);
      }
    };

    document.addEventListener('keydown', keyDownEventHandler);

    return () => {
      document.removeEventListener('keydown', keyDownEventHandler);
    };
  }, [onSubmit]);

  const viewMinutes = minutes !== '' && minutes.match(/^(?:[0-9]|[1-5][0-9])$/) ? minutes : '';
  const viewSeconds = seconds !== '' && seconds.match(/^(?:[0-9]|[1-5][0-9])$/) ? seconds : '';

  return (
    <form className="new-todo-form" onSubmit={onSubmit}>
      <input
        type="text"
        className="new-todo"
        onChange={onLabelChange}
        placeholder="What needs to be done?"
        value={label}
      />
      <input
        type="text"
        className="new-todo-form__timer"
        onChange={onMinutesChange}
        placeholder="Min"
        value={viewMinutes}
      />
      <input
        type="text"
        className="new-todo-form__timer"
        onChange={onSecondsChange}
        placeholder="Sec"
        value={viewSeconds}
      />
    </form>
  );
}

export default NewTaskForm;
