import React from 'react';

export default class RecipeElement extends React.Component {
  render () {
    return (
      <div 
        className={`recipies_list_elem${this.props.active ? ' selected' : ''}`}
        onClick={(e) => this.props.onClick(e)}>
        {this.props.name}
      </div>
    );
  }
}
