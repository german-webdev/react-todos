import { React } from "react";

import Task from "../task";
import './task-list.css';

const TaskList = ({ todos, onDeleted, onToggleDone, onToggleEdit, onEditItem }) => {

    return (
        
        <ul className="todo-list">

           {todos.map((item) => {

            return <Task {...item} item={item} key={item.id} time={item.time}
                onDeleted={() => onDeleted(item.id)}
                onToggleDone={() => onToggleDone(item.id)}
                onToggleEdit={() => onToggleEdit(item.id)}
                onEditItem={onEditItem}
                />
           })}
        </ul>
    );
};

export default TaskList;