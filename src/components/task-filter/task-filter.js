import { Component, React } from 'react';
import PropTypes from 'prop-types';

import './task-filter.css';

class TaskFilter extends Component {
  constructor(props) {
    super(props);
    this.buttons = [
      { name: 'all', label: 'All' },
      { name: 'active', label: 'Active' },
      { name: 'completed', label: 'Completed' },
    ];
  }

  render() {
    const { filter, onFilterChange } = this.props;

    const buttons = this.buttons.map(({ name, label }) => {
      const isActive = filter === name;
      const classBtn = isActive ? 'selected' : 'unselected';
      return (
        <button type="button" className={`${classBtn}`} key={name} onClick={() => onFilterChange(name)}>
          {label}
        </button>
      );
    });

    return <li>{buttons}</li>;
  }
}

TaskFilter.propTypes = {
  filter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default TaskFilter;
