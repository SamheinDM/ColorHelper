import React from 'react';
import RecipeElement from './RecipeElement';

export default class RecipiesList extends React.Component {
  render () {
    const elemList = this.props.recipies.map(el => (
    <RecipeElement 
      key={ el }
      name={ el }
      active={ el === this.props.activeEl }
      onClick={this.props.onChoose} />));

    return (
      <div>
        {elemList}
      </div>
    );
  }
}
