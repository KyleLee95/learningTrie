import React, {Component} from 'react'
import {Card, Col, Row} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import moment from 'moment'
export const InboxLineItem = props => {
  console.log(props)
  return (
    <li
      id={`${props.conversation.id.toString()}`}
      key={props.conversation.id}
      style={{fontWeight: 'bold'}}
      onClick={() => props.toggleRead(props.conversation.id.toString())}
    >
      <Card>
        <Link
          to={`/conversation/${props.conversation.id}`}
          style={{textDecoration: 'none'}}
        >
          <Row>
            <Col lg={{span: 3, offset: 1}}>
              {props.conversation.sender === props.user.username
                ? props.conversation.receiver
                : props.conversation.sender}{' '}
            </Col>
            <Col lg={5}>{props.conversation.subject}</Col>
            <Col lg={3}>
              {moment(props.conversation.createdAt).format(
                'MMMM Do YYYY, h:mm:ss a'
              )}
            </Col>
          </Row>
        </Link>
      </Card>
    </li>
  )
}
