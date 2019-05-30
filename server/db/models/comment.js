const Sequelize = require('sequelize')
const db = require('../db')

const Comment = db.define('comment', {
  content: {
    type: Sequelize.TEXT
  },
  DateTime: {
    type: Sequelize.DATEONLY,
    get: function() {
      return moment(this.getDataValue('DateTime')).format('DD.MM.YYYY')
    }
  }
})

module.exports = Comment
