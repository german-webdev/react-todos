import React from 'react';
import PropTypes from 'prop-types';

function TaskFilter({ filter, onFilterChange }) {
  const buttons = [
    { name: 'all', label: 'All' },
    { name: 'active', label: 'Active' },
    { name: 'completed', label: 'Completed' },
  ];

  return (
    <li>
      {buttons.map(({ name, label }) => {
        const isActive = filter === name;
        const classBtn = isActive ? 'selected' : 'unselected';
        return (
          <button type="button" className={`${classBtn}`} key={name} onClick={() => onFilterChange(name)}>
            {label}
          </button>
        );
      })}
    </li>
  );
}

TaskFilter.propTypes = {
  filter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default TaskFilter;
