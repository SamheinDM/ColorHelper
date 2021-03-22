import React from 'react';
import RecipeElement from './RecipeElement';

export default class RecipiesList extends React.Component {
  render () {
    const elemList = this.props.recipies.map(el => <RecipeElement name={ el } />);

    return (
      <div>
        {elemList}
      </div>
    );
  }
}
