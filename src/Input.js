import React from 'react';

export default class Input extends React.Component {  
  render() {
    return <input 
      type="text"
      className="main_input"
      value={this.props.value}
      placeholder={this.props.inputName}
      onChange={(e) => this.props.changeHolder(e, this.props.name, this.props.id)}/>;
  }
}