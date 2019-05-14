import React, {Component} from 'react'

import {connect} from 'react-redux'
import {Row, Col, Button, Card, Tabs, Tab} from 'react-bootstrap'

class UserHomeTab extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    return (
      <Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
        <Tab eventKey="home" title="Home" />
        <Tab eventKey="profile" title="Profile" />
      </Tabs>
    )
  }
}

export const ConnectedUserHomeTab = connect(null, null)(UserHomeTab)
