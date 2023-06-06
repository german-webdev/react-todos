import { Component, React } from 'react';

import './new-task-form.css';

class NewTaskForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: '',
    };

    this.onLabelChange = (event) => {
      this.setState({
        label: event.target.value,
      });
    };

    this.onSubmit = (event) => {
      event.preventDefault();
      this.props.onItemAdded(this.state.label);
      this.setState({
        label: '',
      });
    };
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <input
          type="text"
          className="new-todo"
          onChange={this.onLabelChange}
          placeholder="What needs to be done?"
          value={this.state.label}
        />
      </form>
    );
  }
}

export default NewTaskForm;
