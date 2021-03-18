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

module.exports.getDefault = getDefault;
module.exports.saveRecipe = saveRecipe;