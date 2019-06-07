import React, {Component} from 'react'
import {Row, Col, Form, Button, Modal, Card} from 'react-bootstrap'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import moment from 'moment'
import {
  delComment,
  putComment,
  postReply,
  getComments,
  getReplies
} from '../store/comment'
class Inbox extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  async componentDidMount() {
    await this.prop.getComments()
  }
  render() {
    return (
      <React.Fragment>
        <Row>
          <Col xs={{span: 12, offset: 0.5}}>
            <Card>
              <Card.Body>
                <Card.Title>
                  {this.props.comment.user &&
                  this.props.comment.user.username !== undefined ? (
                    <Link to={`/user/${this.props.comment.user.id}`}>
                      {this.props.comment.user.username}
                    </Link>
                  ) : (
                    ''
                  )}{' '}
                  | posted: {moment(this.props.comment.createdAt).fromNow()}
                </Card.Title>
                <Card.Body>{this.props.comment.content}</Card.Body>
                <Button variant="submit" onClick={this.handleDeleteShow}>
                  Delete
                </Button>
                <Button variant="submit" onClick={this.handleShow}>
                  Edit
                </Button>
                <Button
                  variant="submit"
                  onClick={() => this.handleReplyShow(this.props.comment.id)}
                >
                  Reply
                </Button>
                {/* \/\/\/\/\/\/\/\ reply form \/\/\/\/\/\/\/\/ */}
                <Form
                  id={`${this.props.comment.id.toString()}`}
                  style={{resize: 'both', display: `${this.state.replyShow}`}}
                >
                  <Row>
                    <Col xs={12}>
                      <Form.Label>Reply:</Form.Label>
                      <Form.Control
                        name="reply"
                        as="textarea"
                        rows="5"
                        cols="50"
                        style={{resize: 'both'}}
                        onChange={this.handleReplyChange}
                      />

                      <Button
                        variant="submit"
                        onClick={() =>
                          this.handleReplySubmit(this.props.comment.id)
                        }
                      >
                        Submit
                      </Button>
                      <Button
                        variant="submit"
                        onClick={() =>
                          this.handleReplyClose(this.props.comment.id)
                        }
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

const mapDispatch = dispatch => {
  return {
    delComment: commentId => dispatch(delComment(commentId)),
    putComment: comment => dispatch(putComment(comment)),
    postReply: comment => dispatch(postReply(comment)),
    getComments: resourceId => dispatch(getComments(resourceId)),
    getReplies: parentId => dispatch(getReplies(parentId))
  }
}

const mapState = state => {
  return {
    resource: state.resource,
    link: state.link,
    comments: state.comment
  }
}

export const ConnectedInbox = connect(mapState, mapDispatch)(Inbox)
