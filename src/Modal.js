import React from 'react';
import Button from './Button';

export default class Modal extends React.Component {
  render() {
    if (this.props.isShow) {
      return (
        <div className="modal_window_wrapper">
          <div className="modal_window">
            <p className="modal_message">
              {this.props.message}
            </p>
            <div className="buttons_wrapper">
              <Button clickHandler={this.props.okHandler} name="Да" isRed={true}/>
              <Button clickHandler={this.props.cancelHandler} name="Нет"/>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}
