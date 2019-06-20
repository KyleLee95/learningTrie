const Sequelize = require('sequelize')
const db = require('../db')

const Resource = db.define('resource', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT
  },
  link: {
    type: Sequelize.STRING
  },
  type: {
    type: Sequelize.ENUM(
      'Paper',
      'Essay',
      'Video',
      'Full Course',
      'Blog',
      'Website',
      'Article',
      'Podcast',
      'Graph',
      'Textbook',
      'Book',
      'Practice Problem Set',
      'Exercise'
    )
  },
  score: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  }
})

module.exports = Resource
