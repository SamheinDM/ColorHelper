const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const path = require('path');
const fs = require('fs');
const os = require('os');

fs.openSync(path.join(os.homedir(), '/db.json'), 'a+')
const adapter = new FileSync(path.join(os.homedir(), '/db.json'))
const db = low(adapter)

const defaultRecipe =     {
  name: "default",
  data: [
    {
      name: "",
      ammount: "",
      percent: "",
      total: 0
    },
    {
      name: "",
      ammount: "",
      percent: "",
      total: 0
    },
    {
      name: "",
      ammount: "",
      percent: "",
      total: 0
    },
    {
      name: "",
      ammount: "",
      percent: "",
      total: 0
    },
    {
      name: "",
      ammount: "",
      percent: "",
      total: 0
    },
    {
      name: "",
      ammount: "",
      percent: "",
      total: 0
    },
    {
      name: "",
      ammount: "",
      percent: "",
      total: 0
    },
    {
      name: "",
      ammount: "",
      percent: "",
      total: 0
    },
    {
      name: "",
      ammount: "",
      percent: "",
      total: 0
    },
    {
      name: "",
      ammount: "",
      percent: "",
      total: 0
    },
    {
      name: "",
      ammount: "",
      percent: "",
      total: 0
    },
    {
      name: "",
      ammount: "",
      percent: "",
      total: 0
    },
    {
      name: "",
      ammount: "",
      percent: "",
      total: 0
    },
    {
      name: "",
      ammount: "",
      percent: "",
      total: 0
    },
    {
      name: "",
      ammount: "",
      percent: "",
      total: 0
    }
  ]
};

db.defaults({ 
  recipies: [defaultRecipe] })
  .write();

function getDefault() {
  db.get('recipies')
    .find({ name: 'default' })
    .assign({ 
      name: defaultRecipe.name,
      data: defaultRecipe.data.map(el => Object.assign({}, el)) })
    .write();

  return db.get('recipies')
    .find({ name: 'default' })
    .value();
}

function saveRecipe(data) {
  db.get('recipies')
    .push(data)
    .write();
}

function getRecipiesList() {
  return db.get('recipies')
    .filter(el => el.name === 'default' ? false : true)
    .map(el => el.name)
    .value();
}

function getRecipe(recipeName) {
  return db.get('recipies')
    .find({ name: recipeName })
    .value();
}

function updateRecipe(recipe) {
  db.get('recipies')
    .find({ name: recipe.name })
    .assign({ 
      name: recipe.name,
      data: recipe.data.map(el => Object.assign({}, el)) })
    .write();
}

function deleteRecipe(recipeName) {
  db.get('recipies')
    .remove({ name: recipeName })
    .write();
}

module.exports.getDefault = getDefault;
module.exports.saveRecipe = saveRecipe;
module.exports.getRecipiesList = getRecipiesList;
module.exports.getRecipe = getRecipe;
module.exports.updateRecipe = updateRecipe;
module.exports.deleteRecipe = deleteRecipe;