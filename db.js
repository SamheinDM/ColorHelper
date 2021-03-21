const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

function getDefault() {
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
    .map(el => el.name !== 'default' ? el.name : null)
    .value();
}

module.exports.getDefault = getDefault;
module.exports.saveRecipe = saveRecipe;
module.exports.getRecipiesList = getRecipiesList;