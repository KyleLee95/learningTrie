const crypto = require('crypto')
const Sequelize = require('sequelize')
const db = require('../db')

const User = db.define('user', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'firstName'
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'lastName'
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'user'
  },
  dbUsername: {
    type: Sequelize.STRING
  },
  bio: {
    type: Sequelize.TEXT,
    defaultValue: ''
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  avatar: {
    type: Sequelize.TEXT,
    defaultValue: 'https://robohash.org/MatLamTam'
  },
  password: {
    type: Sequelize.STRING,
    // Making `.password` act like a func hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('password')
    }
  },
  salt: {
    type: Sequelize.STRING,
    // Making `.salt` act like a function hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('salt')
    }
  },
  googleId: {
    type: Sequelize.STRING
  },
  rank: {
    type: Sequelize.ENUM(['admin', 'moderator', 'basic']),
    defaultValue: 'basic',
    allowNull: false
  },
  newMessage: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
})

module.exports = User

/**
 * instanceMethods
 */
User.prototype.correctPassword = function(candidatePwd) {
  return User.encryptPassword(candidatePwd, this.salt()) === this.password()
}

/**
 * classMethods
 */
User.generateSalt = function() {
  return crypto.randomBytes(16).toString('base64')
}

User.encryptPassword = function(plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex')
}

/**
 * hooks
 */
const setSaltAndPassword = user => {
  if (user.changed('password')) {
    user.salt = User.generateSalt()
    user.password = User.encryptPassword(user.password(), user.salt())
  }
}

User.beforeCreate(setSaltAndPassword)
User.beforeUpdate(setSaltAndPassword)
User.beforeBulkCreate(users => {
  users.forEach(setSaltAndPassword)
})

module.exports = User
