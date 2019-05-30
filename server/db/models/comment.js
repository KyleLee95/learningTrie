const Sequelize = require('sequelize')
const db = require('../db')
const moment = require('moment')
const Comment = db.define('comment', {
  content: {
    type: Sequelize.TEXT
  },
  postedAt: {
    type: Sequelize.DATEONLY,
    get: function() {
      return moment(this.getDataValue(Date.now())).format('MM/DD/YYYY')
    }
  }
})

module.exports = Comment
