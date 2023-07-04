/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

function Task({
  completed,
  edit,
  label: initialLabel,
  onDeleted,
  onToggleDone,
  onToggleEdit,
  onStartCountdown,
  onPauseCountdown,
  minutes,
  seconds,
  created,
  elapsedTime,
  setLabel,
}) {
  const [label, setLabelState] = useState(initialLabel);
  const inputRef = useRef(null);

  const onEdit = () => {
    if (edit) {
      if (label !== '') {
        setLabel(label);
      }
    }
  };

  useEffect(() => {
    const keyDownEventHandler = (event) => {
      if (event.key === 'Enter') {
        onEdit(event);
      }
    };
    document.addEventListener('keydown', keyDownEventHandler);

    return () => {
      document.removeEventListener('keydown', keyDownEventHandler);
    };
  }, [onEdit]);

  const onLabelChange = (event) => {
    setLabelState(event.target.value);
  };

  const handleButtonClick = () => {
    setTimeout(() => {
      inputRef.current.focus();
    }, 100);
  };

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  let classNames = 'active';
  const editor = 'edit';
  let formClass = 'visible';
  if (completed) {
    classNames = 'completed';
  }

  if (edit) {
    classNames = 'editing';
  } else {
    formClass = 'hidden';
  }

  return (
    <li className={classNames}>
      <div className="view">
        <input className="toggle" type="checkbox" checked={completed} onChange={onToggleDone} />
        <label>
          <span className="title">{label}</span>
          <span className="description">
            <button type="button" className="icon icon-play" onClick={onStartCountdown} />
            <button type="button" className="icon icon-pause" onClick={onPauseCountdown} />

            <span className="timer">
              {formatTime(minutes)}:{formatTime(seconds)}
            </span>
          </span>
          <span className="description">
            {created} {elapsedTime}
          </span>
        </label>
        <button type="button" className="icon icon-edit" aria-label={handleButtonClick()} onClick={onToggleEdit} />
        <button type="button" className="icon icon-destroy" aria-label={onDeleted} onClick={onDeleted} />
      </div>
      <form className={formClass}>
        <input
          type="text"
          ref={inputRef}
          className={editor}
          placeholder="Get modified task"
          onChange={onLabelChange}
          value={label}
        />
      </form>
    </li>
  );
}

Task.propTypes = {
  label: PropTypes.node.isRequired,
  edit: PropTypes.bool.isRequired,
  completed: PropTypes.bool.isRequired,
  setLabel: PropTypes.func.isRequired,
};

export default Task;
