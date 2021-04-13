import React from 'react';
import RecipeElement from './RecipeElement';

export default class RecipiesList extends React.Component {
  render () {
    const mappedList = this.props.recipies.map((el, i) => { return { index: i, value: el } });

    mappedList.sort(function(a, b) {
      if (a.value > b.value) {
        return 1; }
      if (a.value < b.value) {
        return -1; }
      return 0;
    });

    const elemList = this.props.recipies.map(el => (
    <RecipeElement 
      key={ el }
      name={ el }
      active={ el === this.props.activeEl }
      onClick={this.props.onChoose} />));
    
    const elemListSorted = mappedList.map(el => elemList[el.index]);

    return (
      <div className="recipies_list">
        {elemListSorted}
      </div>
    );
  }
}
