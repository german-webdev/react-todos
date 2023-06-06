import React, { Component } from "react";
import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';


import './task.css'; 

class Task extends Component {

    static defaultProps = {
        updateInterval: 100000
    };

    static propTypes = {
        updateInterval: PropTypes.number,
        label: PropTypes.node,
        edit: PropTypes.bool,
        completed: PropTypes.bool
    }

    constructor(props) {
        super(props)
        this.state = {
            created: 'created',
            label: this.props.label,
            createdTime: new Date(),
            elapsedTime: 'now',
        }

        this.inputRef = React.createRef()

        this.edited = () => {
            this.setState({
                created: 'edit'
            });
        }

        this.onLabelChange = (event) => {
            this.setState({
                label: event.target.value,
            });
        };

        this.onEdit = (event) => {
            event.preventDefault();
            this.props.onEditItem(this.state.label);
            this.setState({
                label: ''
            });
        };

        this.componentDidMount = () => {
            const { updateInterval } = this.props
            this.elapsedTimeInterval = setInterval(() => {
                this.setState({
                    elapsedTime: formatDistanceToNow(this.state.createdTime, { includeSeconds: true, addSuffix: true })
                })
            }, updateInterval);
        };
    
        this.componentWillUnmount = () => {
            clearInterval(this.elapsedTimeInterval);
        };

        this.handleButtonClick = (event) => {
            setTimeout(() => {
                this.inputRef.current.focus()
            }, 100);
        }

    }

    render() {
        const {completed, edit, label, onDeleted, onToggleDone, onToggleEdit} = this.props
        const { created, elapsedTime } = this.state

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
                        <span className="description">{label}</span>
                        <span className="created">{created} {elapsedTime}</span>
                    </label>
                    <button className="icon icon-edit"
                        onClick={() => {
                            onToggleEdit();
                            this.handleButtonClick();
                            }}></button>
                    <button className="icon icon-destroy"
                        onClick={onDeleted}></button>
                </div>
                <form className={formClass} onChange={this.edited} onSubmit={this.onEdit}>
                    <input type='text' 
                    ref={this.inputRef}
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