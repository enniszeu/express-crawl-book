const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')

const db = low(adapter)

db.defaults({ posts: [], views: [], chaps: [], homeXephang: [], viewsXepHang: [], chapsXephang: [], homeConGai: [], viewsConGai:[], chapsConGai:[]})
  .write()


 module.exports = db;