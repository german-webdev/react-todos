import { React } from 'react';
import PropTypes from 'prop-types';

import Task from '../task';
import './task-list.css';

function TaskList({ todos, onDeleted, onToggleDone, onToggleEdit, onEditItem }) {
  return (
    <ul className="todo-list">
      {todos.map((item) => {
        const { id, ...otherItems } = item;

        return (
          <Task
            {...otherItems}
            key={id}
            onDeleted={() => onDeleted(item.id)}
            onToggleDone={() => onToggleDone(item.id)}
            onToggleEdit={() => onToggleEdit(item.id)}
            onEditItem={onEditItem}
          />
        );
      })}
    </ul>
  );
}

TaskList.propTypes = {
  onDeleted: PropTypes.func.isRequired,
  onToggleDone: PropTypes.func.isRequired,
  onToggleEdit: PropTypes.func.isRequired,
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.node.isRequired,
      completed: PropTypes.bool.isRequired,
      edit: PropTypes.bool.isRequired,
    })
  ).isRequired,
};

export default TaskList;
