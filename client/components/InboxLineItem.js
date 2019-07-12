import React from 'react'
import {Card, Col, Row} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import moment from 'moment'
export const InboxLineItem = props => {
  return (
    <React.Fragment>
      {props.conversation.sender === props.user.username ? (
        props.conversation.senderRead === true ? (
          <li
            id={`${props.conversation.id.toString()}`}
            key={props.conversation.id}
            style={{fontWeight: 'none'}}
            onClick={() =>
              props.toggleRead(props.conversation.id.toString(), true)
            }
          >
            <Card>
              <Link
                to={`/conversation/${props.conversation.id}`}
                style={{textDecoration: 'none', color: 'black'}}
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
        ) : (
          <li
            id={`${props.conversation.id.toString()}`}
            key={props.conversation.id}
            style={{fontWeight: 'bold'}}
            onClick={() =>
              props.toggleRead(props.conversation.id.toString(), true)
            }
          >
            <Card>
              <Link
                to={`/conversation/${props.conversation.id}`}
                style={{textDecoration: 'none', color: 'black'}}
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
      ) : props.conversation.receiverRead === true ? (
        <li
          id={`${props.conversation.id.toString()}`}
          key={props.conversation.id}
          style={{fontWeight: 'none', color: 'black'}}
          onClick={() =>
            props.toggleRead(props.conversation.id.toString(), false)
          }
        >
          <Card>
            <Link
              to={`/conversation/${props.conversation.id}`}
              style={{textDecoration: 'none', color: 'black'}}
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
      ) : (
        <li
          id={`${props.conversation.id.toString()}`}
          key={props.conversation.id}
          style={{fontWeight: 'bold', color: 'black'}}
          onClick={() =>
            props.toggleRead(props.conversation.id.toString(), false)
          }
        >
          <Card>
            <Link
              to={`/conversation/${props.conversation.id}`}
              style={{textDecoration: 'none', color: 'black'}}
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
      )}
      <br />
    </React.Fragment>
  )
}
