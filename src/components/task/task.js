/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      created: 'created',
      label: this.props.label,
      minutes: this.props.minutes,
      seconds: this.props.seconds,

      createdTime: new Date(),
      elapsedTime: 'now',
    };

    this.inputRef = React.createRef();

    this.onLabelChange = (event) => {
      this.setState({
        label: event.target.value,
      });
    };

    this.onEdit = () => {
      if (this.props.edit) {
        this.setState({ created: 'edit' });
        this.props.setLabel(this.state.label);
      }
    };

    this.handleButtonClick = () => {
      setTimeout(() => {
        this.inputRef.current.focus();
      }, 100);
    };

    this.activeTimer = () => {
      this.startTimer = setInterval(() => {
        const { minutes, seconds } = this.state;

        const offset = minutes * 60 + seconds - 1;

        if (offset <= 0) {
          clearInterval(this.startTimer);
        }

        this.setState({
          minutes: Math.floor(offset / 60),
          seconds: offset % 60,
        });
      }, 1000);
    };

    this.deactivatedTimer = () => {
      clearInterval(this.startTimer);
    };
  }

  componentDidMount() {
    const { updateInterval } = this.props;
    this.elapsedTimeInterval = setInterval(() => {
      this.setState(({ createdTime }) => {
        return {
          elapsedTime: formatDistanceToNow(createdTime, { includeSeconds: true, addSuffix: true }),
        };
      });
    }, updateInterval);

    this.keyDownEventHandler = (event) => {
      if (event.key === 'Enter') {
        this.onEdit(event);
      }
    };
    document.addEventListener('keydown', this.keyDownEventHandler);

    this.eventsEdit = () => {
      this.props.onToggleEdit();
    };
  }

  componentWillUnmount() {
    clearInterval(this.startTimer);
    clearInterval(this.elapsedTimeInterval);
    document.removeEventListener('keydown', this.keyDownEventHandler);
  }

  render() {
    const { completed, edit, label, onDeleted, onToggleDone } = this.props;
    const { created, elapsedTime, minutes, seconds } = this.state;

    let classNames = 'active';
    // eslint-disable-next-line prefer-const
    let editor = 'edit';
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
          <input className="toggle" type="checkbox" onChange={onToggleDone} />
          <label>
            <span className="title">{label}</span>
            <span className="description">
              <button type="button" className="icon icon-play" onClick={this.activeTimer} />
              <button type="button" className="icon icon-pause" onClick={this.deactivatedTimer} />
              <span className="timer">
                {minutes > 9 ? minutes : `0${minutes}`}:{seconds > 9 ? seconds : `0${seconds}`}
              </span>
            </span>
            <span className="description">
              {created} {elapsedTime}
            </span>
          </label>
          <button
            type="button"
            className="icon icon-edit"
            aria-label={this.handleButtonClick()}
            onClick={() => this.eventsEdit()}
          />
          <button type="button" className="icon icon-destroy" aria-label={onDeleted} onClick={onDeleted} />
        </div>
        <form className={formClass}>
          <input
            type="text"
            ref={this.inputRef}
            className={editor}
            placeholder="Get modified task"
            onChange={this.onLabelChange}
            value={this.state.label}
          />
        </form>
      </li>
    );
  }
}

Task.defaultProps = {
  updateInterval: 100000,
};

Task.propTypes = {
  updateInterval: PropTypes.number,
  label: PropTypes.node.isRequired,
  edit: PropTypes.bool.isRequired,
  completed: PropTypes.bool.isRequired,
};

export default Task;
