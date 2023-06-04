import React from "react";

import TaskFilter from "../task-filter";

import './footer.css';

const Footer = ({ filter, onFilterChange, onDoneClear, toDo }) => {
  return (
      <footer className="footer">
        <span className="todo-count">{toDo} items left</span>
          <ul className="filters">
            <TaskFilter filter={filter} 
                        onFilterChange={onFilterChange}/>
          </ul>
        <button className="clear-completed"
                onClick={onDoneClear}>Clear completed</button>
      </footer>
  );
}

export default Footer;