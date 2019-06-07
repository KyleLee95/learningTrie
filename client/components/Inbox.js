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
        <Row>
          <Col lg={12}>
            {this.props.conversations && this.props.conversations.length > 0
              ? this.props.conversations.map(conversation => {
                  return (
                    <Card key={conversation.id}>
                      <Row>
                        <Col lg={4}>{conversation.sender}</Col>
                        <Col lg={4}>
                          <Card.Title>{conversation.title}</Card.Title>
                        </Col>
                        <Col lg={4}>
                          <Card.Title>
                            place holder for last message sent
                            {moment(conversation.createdAt).format(
                              'MMMM Do YYYY, h:mma'
                            )}
                          </Card.Title>
                        </Col>
                      </Row>
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
