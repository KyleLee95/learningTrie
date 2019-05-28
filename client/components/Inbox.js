import React, {Component} from 'react'
import {Row, Col, Form, Button, Modal, Card} from 'react-bootstrap'
import {connect} from 'react-redux'

class Inbox extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }
  render() {
    return <div>HELLO WORLD, INBOX</div>
  }
}

const mapDispatch = dispatch => {
  return {}
}

const mapState = state => {
  return {}
}

export const ConnectedInbox = connect(mapState, mapDispatch)(Inbox)
