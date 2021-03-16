const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

function create() {
  db.get('recipies')
  .push({ name: '1'})
  .write();
  console.log('f')
}

module.exports.create = create;