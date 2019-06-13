import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Card, Button, Row, Col} from 'react-bootstrap'

const GroupCard = props => {
  return 'HELLO WORLD'
}

export const ConnectedGroupCard = connect(null, null)(GroupCard)
