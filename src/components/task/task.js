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
      timerIsActive: false,

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

    this.startCountdown = () => {
      if (this.state.timerIsActive) {
        return;
      }
      this.timer = setInterval(() => {
        this.setState((prevState) => {
          let { minutes, seconds } = prevState;

          if (minutes === 0 && seconds === 0) {
            clearInterval(this.timer);
            return { timerIsActive: false };
          }

          if (seconds === 0) {
            minutes--;
            seconds = 59;
          } else {
            seconds--;
          }

          return {
            minutes,
            seconds,
            isRunning: true,
          };
        });
      }, 1000);

      this.setState({ timerIsActive: true });
    };

    this.pauseCountdown = () => {
      clearInterval(this.timer);
      this.setState({ timerIsActive: false });
    };

    this.formatTime = (time) => {
      return time < 10 ? `0${time}` : time;
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
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    clearInterval(this.elapsedTimeInterval);
    document.removeEventListener('keydown', this.keyDownEventHandler);
  }

  render() {
    const { completed, edit, label, onDeleted, onToggleDone, onToggleEdit } = this.props;
    const { created, elapsedTime, minutes, seconds } = this.state;

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
          <input className="toggle" type="checkbox" onChange={onToggleDone} />
          <label>
            <span className="title">{label}</span>
            <span className="description">
              <button type="button" className="icon icon-play" onClick={this.startCountdown} />
              <button type="button" className="icon icon-pause" onClick={this.pauseCountdown} />

              <span className="timer">
                {this.formatTime(minutes)}:{this.formatTime(seconds)}
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
            onClick={onToggleEdit}
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
