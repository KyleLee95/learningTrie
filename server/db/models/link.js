const Sequelize = require('sequelize')
const db = require('../db')

const Link = db.define('link', {
  url: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  shortUrl: {
    type: Sequelize.TEXT,
    allowNull: false
  }
})

module.exports = Link
