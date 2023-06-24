import { Component, React } from 'react';

class NewTaskForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: '',
      minutes: null,
      seconds: null,
    };

    this.onLabelChange = (event) => {
      this.setState({
        label: event.target.value,
      });
    };

    this.onMinutesChange = (event) => {
      this.setState({
        minutes: event.target.value,
      });
    };

    this.onSecondsChange = (event) => {
      this.setState({
        seconds: event.target.value,
      });
    };

    this.onSubmit = (event) => {
      const { label, minutes, seconds } = this.state;
      event.preventDefault();
      this.props.onItemAdded(label, minutes, seconds);
      this.setState({
        label: '',
        minutes: null,
        seconds: null,
      });
    };
  }

  render() {
    const { label, minutes, seconds } = this.state;

    const viewMinutes =
      minutes !== null &&
      minutes !== '' &&
      minutes.match(/^([0-9]{0,2}((-[0-9]{0,}){0,2})(,([0-9]{0,2}((-[0-9]{0,2}){0,1}))){0,})$/)
        ? minutes
        : '';
    const viewSeconds =
      seconds !== null && seconds.match(/^([0-9]{0,2}((-[0-9]{0,}){0,2})(,([0-9]{0,2}((-[0-9]{0,2}){0,1}))){0,})$/)
        ? seconds
        : '';

    return (
      <form className="new-todo-form" onSubmit={this.onSubmit}>
        <input
          type="text"
          className="new-todo"
          onChange={this.onLabelChange}
          placeholder="What needs to be done?"
          value={label}
        />
        <input
          type="text"
          className="new-todo-form__timer"
          onChange={this.onMinutesChange}
          placeholder="Min"
          value={viewMinutes}
        />
        <input
          type="text"
          className="new-todo-form__timer"
          onChange={this.onSecondsChange}
          placeholder="Sec"
          value={viewSeconds}
        />
      </form>
    );
  }
}

export default NewTaskForm;
