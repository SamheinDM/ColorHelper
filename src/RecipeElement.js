import React from 'react';

export default class RecipeElement extends React.Component {
  render () {
    return (
      <div 
        className="recipies_list_elem" 
        onClick={(e)this.props.onClick}>
        {this.props.name}
      </div>
    );
  }
}
