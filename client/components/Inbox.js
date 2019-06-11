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
    this.state = {
      show: false
    }

    this.handleShow = this.handleShow.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
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

          <Col lg={11}>
            {this.props.conversations && this.props.conversations.length > 0
              ? this.props.conversations.map(conversation => {
                  return (
                    <Link
                      to={`/conversation/${conversation.id}`}
                      style={{fontWeight: 'bold'}}
                      key={conversation.id}
                    >
                      <Card>
                        <Card.Body>
                          <Row>
                            <Col lg={3}>
                              {' '}
                              <Card.Title>
                                {conversation.sender ===
                                this.props.user.username
                                  ? conversation.receiver
                                  : conversation.sender}
                              </Card.Title>
                            </Col>
                            <Col lg={5}>
                              <Card.Title>{conversation.subject}</Card.Title>
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
                    </Link>
                  )
                })
              : 'no conversations found'}
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
    postConversation: conversation => dispatch(postConversation(conversation))
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
