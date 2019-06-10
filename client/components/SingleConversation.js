import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Row, Col, Card} from 'react-router-dom'

class Conversation extends Component {
  constructor(props, context) {
    super(props)
    this.state = {}
  }
  render() {
    return 'HELLO WORLD'
  }
}

const mapState = state => {
  return {}
}

const mapDispatch = dispatch => {
  return {}
}

export const ConnectedConversation = connect(mapState, mapDispatch)(
  Conversation
)
