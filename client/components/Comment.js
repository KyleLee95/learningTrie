import React, {Component} from 'react'
import {Row, Col, Modal, Button, Form, Card} from 'react-bootstrap'
import {connect} from 'react-redux'

export const Comment = props => {
  console.log(props)
  return (
    <React.Fragment>
      <Row>
        <Col xs={{span: 6, offSet: 10}}>
          <Card>
            <Card.Title>UserName</Card.Title>
            <Card.Body>CONTENT GOES HERE</Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}
