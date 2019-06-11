import React, {Component} from 'react'
import {Row, Col, Form, Button, Modal, Card, ListGroup} from 'react-bootstrap'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import moment from 'moment'
import {
  getConversations,
  delConversation,
  postConversation,
  putConversation
} from '../store/conversation'
import {InboxLineItem} from '.'
class Inbox extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      show: false
    }

    // await this.props.putConversation({
    //   conversationId: Number(this.props.match.params.id),
    //   senderRead: true,
    //   receiverRead: false
    // })
    this.handleShow = this.handleShow.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.toggleRead = this.toggleRead.bind(this)
  }

  handleShow() {
    this.setState({
      show: !this.state.show
    })
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  async handleSubmit() {
    await this.props.postConversation({
      from: this.props.user.username,
      receiver: this.state.receiver,
      content: this.state.content,
      subject: this.state.subject
    })
    this.handleShow()
  }

  async toggleRead(id, sender) {
    const bold = document.getElementById(id)
    if (bold.style.fontWeight === 'bold') {
      document.getElementById(id).style.fontWeight = 'normal'
    }

    await this.props.putConversation({
      conversationId: Number(id),
      isSender: sender
    })
  }
  async componentDidMount() {
    await this.props.getConversations()
  }
  render() {
    return (
      <React.Fragment>
        <h3>Conversations</h3>
        <hr />
        <Row>
          <Col xs={1}>
            <Button onClick={this.handleShow}>New Conversation</Button>
          </Col>

          <Col xs={{span: 9, offset: 1}}>
            <ul style={{listStyle: 'none'}}>
              {this.props.conversations && this.props.conversations.length > 0
                ? this.props.conversations.map(conversation => {
                    return (
                      <InboxLineItem
                        user={this.props.user}
                        key={conversation.id}
                        conversation={conversation}
                        toggleRead={this.toggleRead}
                      />
                    )
                  })
                : 'none found'}
            </ul>
          </Col>
        </Row>

        <Form>
          <Modal show={this.state.show} onHide={this.handleShow}>
            <Modal.Header closeButton>
              <Modal.Title>New Conversation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              To
              <Form.Control
                name="receiver"
                placeholder="Username"
                onChange={this.handleChange}
              />
              <br />
              Subject
              <Form.Control
                name="subject"
                placeholder="Subject"
                onChange={this.handleChange}
              />
              <br />
              Message
              <Form.Control
                name="content"
                as="textarea"
                onChange={this.handleChange}
              />
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleShow}>
                  Close
                </Button>
                <Button variant="primary" onClick={this.handleSubmit}>
                  Send
                </Button>
              </Modal.Footer>
            </Modal.Body>
          </Modal>
        </Form>
      </React.Fragment>
    )
  }
}

const mapDispatch = dispatch => {
  return {
    getConversations: () => dispatch(getConversations()),
    delConversation: conversationId =>
      dispatch(delConversation(conversationId)),
    postConversation: conversation => dispatch(postConversation(conversation)),
    putConversation: conversation => dispatch(putConversation(conversation))
  }
}

const mapState = state => {
  return {
    user: state.currUser,
    resource: state.resource,
    comments: state.comment,
    conversations: state.conversation
  }
}

export const ConnectedInbox = connect(mapState, mapDispatch)(Inbox)
