const Sequelize = require('sequelize')
const db = require('../db')

const Recommendation = db.define('recommendation', {
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
  }
})

module.exports = Recommendation
