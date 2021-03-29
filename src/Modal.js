import React from 'react';

export default class Modal extends React.Component {
  render() {
    if (this.props.isShow) {
      return (
        <div className="modal_window">
          <div>
            <p>
              {this.props.message}
            </p>
          </div>
          <div>
            <button onClick={this.props.okHandler}>Да</button>
            <button onClick={this.props.cancelHandler}>Нет</button>
          </div>
        </div>
      );
    }
    return null;
  }
}
