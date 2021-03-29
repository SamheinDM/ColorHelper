import React from 'react';

export default function ErrorMessage(props) {
  if (props.isShow) {
    return (
      <span className="error_msg">
        {props.text}
      </span>
    );
  }
  return null;
}
