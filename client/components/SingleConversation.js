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
              Subject:{' '}
              {this.props.conversations[0] !== undefined
                ? this.props.conversations[0].subject
                : ''}
            </h3>
          </Col>
        </Row>
        <Row>
          <Col lg={{span: 10, offset: 1}}>
            {this.props.messages.map(message => {
              return message.messageType === 'message' ? (
                <React.Fragment key={message.id}>
                  <Card>
                    <Card.Header>
                      <Link to={`/user/${message.user.id}`}>
                        {message.user.username}
                      </Link>{' '}
                      {moment(message.createdAt).format('MMMM Do YYYY, h:mma')}
                    </Card.Header>

                    {/* <hr /> */}
                    <Card.Body>{message.content}</Card.Body>
                  </Card>
                  <br />
                </React.Fragment>
              ) : message.messageType === 'recommendation' ? (
                <React.Fragment key={message.id}>
                  <Card>
                    <Card.Header>
                      <Link
                        to={`/user/${message.user.id}`}
                        style={{color: 'black'}}
                      >
                        {message.user.username}
                      </Link>{' '}
                      {moment(message.createdAt).format('MMMM Do YYYY, h:mma')}
                    </Card.Header>

                    {/* <hr /> */}
                    <Card.Body>
                      <Link
                        to={`/user/${message.user.id}`}
                        style={{color: 'black'}}
                      >
                        {message.user.username}
                      </Link>{' '}
                      recommended the resource{' '}
                      <Link to={`/recommendation/${message.recommendationId}`}>
                        {message.recommendation}
                      </Link>{' '}
                      to the node {message.content} in the learning tree{' '}
                      <Link to={`/learningTree/${message.treeId}`}>
                        {message.tree}
                      </Link>
                    </Card.Body>
                  </Card>
                  <br />
                </React.Fragment>
              ) : message.messageType === 'resource' ? (
                <React.Fragment key={message.id}>
                  <Card>
                    <Card.Header>
                      <Link
                        to={`/user/${message.user.id}`}
                        style={{color: 'black'}}
                      >
                        {message.user.username}
                      </Link>{' '}
                      {moment(message.createdAt).format('MMMM Do YYYY, h:mma')}
                    </Card.Header>

                    {/* <hr /> */}
                    <Card.Body>
                      <Link
                        to={`/user/${message.user.id}`}
                        style={{color: 'black'}}
                      >
                        {message.user.username}
                      </Link>{' '}
                      added resource{' '}
                      <Link to={`/resource/${message.resourceId}`}>
                        {message.resource}
                      </Link>{' '}
                      to node {message.content} in{' '}
                      <Link to={`/learningTree/${message.treeId}`}>
                        {message.tree}
                      </Link>
                    </Card.Body>
                  </Card>
                  <br />
                </React.Fragment>
              ) : null
            })}

            <Card>
              <Card.Header>Replying as: {this.props.user.username}</Card.Header>
              <Card.Body>
                <Form>
                  <Form.Row>
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
                    {this.props.conversations &&
                    this.props.conversations[0] &&
                    this.props.conversations[0].users &&
                    this.props.conversations[0].users.length > 0 ? (
                      <Button onClick={this.handleSubmit}>Submit</Button>
                    ) : (
                      <Button onClick={this.handleSubmit}>Submit</Button>
                    )}
                  </Form.Row>
                </Form>
              </Card.Body>
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
