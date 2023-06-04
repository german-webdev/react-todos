import { Component, React } from "react";

import './task.css'; 

class Task extends Component {

    constructor(props) {
        super(props)
        this.state = {
            label: this.props.label
        }

        this.onLabelChange = (event) => {
            console.log(`${props.id}`, event.target.value);
            this.setState({
                label: event.target.value
            });
        };

        this.onEdit = (event) => {
            event.preventDefault();
            this.props.onEditItem(this.state.label);
            this.setState({
                label: ''
            });
        };

    }

    render() {
        const {completed, edit, label, onDeleted, onToggleDone, onToggleEdit, time} = this.props

        let classNames = 'active'
        let editor = 'edit'
        let formClass = 'visible'
        if (completed) {
            classNames = 'completed'
        }

        if (edit) {
            classNames = 'editing'
        } else {
            formClass= 'hidden'
        }
    
        return (
            <li className={classNames}>
                <div className='view'>
                    <input className="toggle" type="checkbox"
                        onChange={onToggleDone} />
                    <label>
                        <span className="description">{ label }</span>
                        <span className="created">created { time } ago</span>
                    </label>
                    <button className="icon icon-edit"
                        onClick={onToggleEdit}></button>
                    <button className="icon icon-destroy"
                        onClick={onDeleted}></button>
                </div>
                <form className={formClass} onSubmit={this.onEdit} selected>
                    <input type='text' 
                        className={editor} 
                        placeholder='Get modified task'
                        onChange={this.onLabelChange}
                        value={this.state.label}></input>
                </form>
                
            </li>
        );
    }

};

export default Task;