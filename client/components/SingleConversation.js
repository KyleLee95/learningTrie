import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Row, Col, Card, Form, Button} from 'react-bootstrap'
import {getMessages, postMessage} from '../store/message'
import {getSelectedConversation, putConversation} from '../store/conversation'
import moment from 'moment'
class Conversation extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      content: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  async handleSubmit() {
    if (this.props.conversations[0].sender === this.props.user.username) {
      await this.props.postMessage({
        conversationId: Number(this.props.match.params.id),
        content: this.state.content,
        isSender: true,
        users: this.props.conversations[0].users
      })
    } else {
      await this.props.postMessage({
        conversationId: Number(this.props.match.params.id),
        content: this.state.content,
        isSender: false,
        users: this.props.conversations[0].users
      })
    }
    document.getElementById('content').value = ''
  }

  async componentDidMount() {
    await this.props.getSelectedConversation(Number(this.props.match.params.id))
    await this.props.getMessages(Number(this.props.match.params.id))
  }
  render() {
    return (
      <React.Fragment>
        <Row>
          <Col lg={{span: 10, offset: 1}}>
            <h3>
              {this.props.conversations[0] !== undefined
                ? this.props.conversations[0].subject
                : ''}
            </h3>
          </Col>
        </Row>
        <Row>
          <Col lg={{span: 10, offset: 1}}>
            {this.props.messages.map(message => {
              return (
                <React.Fragment key={message.id}>
                  <Card>
                    <Row>
                      <Col xs={2} lg={2}>
                        {/* <Card.Img
                          variant="top"
                          src={
                            message.user.avatar !== undefined
                              ? message.user.avatar
                              : null
                          }
                        /> */}
                        <Card.Title>{message.user.username}</Card.Title>
                      </Col>
                      <Col xs={10} lg={10}>
                        <Card.Title>
                          {moment(message.createdAt).format(
                            'MMMM Do YYYY, h:mma'
                          )}
                        </Card.Title>
                        <hr />
                        <Card.Body>{message.content}</Card.Body>
                      </Col>
                    </Row>
                  </Card>
                </React.Fragment>
              )
            })}
            <Card>
              <Row>
                <Col xs={2} lg={2}>
                  {/* <Card.Img variant="top" src={this.props.user.avatar} /> */}
                  <Card.Title>{this.props.user.username}</Card.Title>
                </Col>
                <Col xs={10} lg={10}>
                  <Form>
                    <Form.Row>
                      <Form.Label>Reply</Form.Label>
                      <Form.Control
                        value={this.state.content.value}
                        id="content"
                        as="textarea"
                        resize="both"
                        rows="5"
                        cols="300"
                        name="content"
                        onChange={this.handleChange}
                      />
                    </Form.Row>
                    <Form.Row>
                      <Button onClick={this.handleSubmit}>Submit</Button>
                    </Form.Row>
                  </Form>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

const mapState = state => {
  return {
    messages: state.message,
    user: state.currUser,
    conversations: state.conversation
  }
}

const mapDispatch = dispatch => {
  return {
    getMessages: conversationId => dispatch(getMessages(conversationId)),
    postMessage: message => dispatch(postMessage(message)),
    getSelectedConversation: conversationId =>
      dispatch(getSelectedConversation(conversationId)),
    putConversation: conversation => dispatch(putConversation(conversation))
  }
}

export const ConnectedConversation = connect(mapState, mapDispatch)(
  Conversation
)
