import React from 'react';
import PropTypes from 'prop-types';

import TaskFilter from '../task-filter';

import './footer.css';

function Footer({ filter, onFilterChange, onDoneClear, toDo }) {
  return (
    <footer className="footer">
      <span className="todo-count">{toDo} items left</span>
      <ul className="filters">
        <TaskFilter filter={filter} onFilterChange={onFilterChange} />
      </ul>
      <button type="button" className="clear-completed" onClick={onDoneClear}>
        Clear completed
      </button>
    </footer>
  );
}

Footer.propTypes = {
  filter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onDoneClear: PropTypes.func.isRequired,
  toDo: PropTypes.number.isRequired,
};

export default Footer;
