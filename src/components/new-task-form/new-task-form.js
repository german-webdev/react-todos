import { Component, React } from 'react';

class NewTaskForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: '',
      minutes: '',
      seconds: '',
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
      if (label !== '' && minutes !== '' && seconds !== '') {
        this.props.onItemAdded(label, Number(minutes), Number(seconds));
        this.setState({
          label: '',
          minutes: null,
          seconds: null,
        });
      }
    };
  }

  componentDidMount() {
    this.keyDownEventHandler = (event) => {
      if (event.key === 'Enter') {
        this.onSubmit(event);
      }
    };
    document.addEventListener('keydown', this.keyDownEventHandler);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyDownEventHandler);
  }

  render() {
    const { label, minutes, seconds } = this.state;

    const viewMinutes = minutes !== null && minutes.match(/^(?:[0-9]|[1-5][0-9])$/) ? minutes : '';
    const viewSeconds = seconds !== null && seconds.match(/^(?:[0-9]|[1-5][0-9])$/) ? seconds : '';

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
