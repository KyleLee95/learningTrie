import React, {Component} from 'react'
import {Row, Col, Form, Button, Modal, Card} from 'react-bootstrap'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import moment from 'moment'
import {
  getConversations,
  delConversation,
  postConversation
} from '../store/conversation'
class Inbox extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  async componentDidMount() {
    await this.props.getConversations()
  }
  render() {
    return (
      <React.Fragment>
        <h3>Conversations</h3>
        <Row>
          <Col lg={12}>
            {this.props.conversations && this.props.conversations.length > 0
              ? this.props.conversations.map(conversation => {
                  return (
                    <Card key={conversation.id}>
                      <Card.Body>
                        <Row>
                          <Col lg={3}>
                            {' '}
                            <Card.Title>{conversation.sender}</Card.Title>
                          </Col>
                          <Col lg={5}>
                            <Card.Title>{conversation.title}</Card.Title>
                          </Col>
                          <Col lg={{span: 3, offset: 1}}>
                            <Card.Title>
                              {moment(conversation.createdAt).format(
                                'MMMM Do YYYY, h:mma'
                              )}
                            </Card.Title>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  )
                })
              : 'no conversations found'}
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

const mapDispatch = dispatch => {
  return {
    getConversations: () => dispatch(getConversations()),
    delConversation: conversationId =>
      dispatch(delConversation(conversationId)),
    postConversation: conversation => dispatch(postConversation(conversation))
  }
}

const mapState = state => {
  return {
    resource: state.resource,
    comments: state.comment,
    conversations: state.conversation
  }
}

export const ConnectedInbox = connect(mapState, mapDispatch)(Inbox)
