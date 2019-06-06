import React, {Component} from 'react'
import {Row, Col, Modal, Button, Form, Card} from 'react-bootstrap'
import {connect} from 'react-redux'
import {
  delComment,
  putComment,
  postReply,
  getComments,
  getReplies
} from '../store/comment'
import {Link} from 'react-router-dom'
import moment from 'moment'
class Comment extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      show: false,
      deleteShow: false,
      replyShow: 'none'
    }
    //Edit Modal
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
    //Delete Check
    this.handleDeleteShow = this.handleDeleteShow.bind(this)
    this.handleDeleteClose = this.handleDeleteClose.bind(this)
    this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this)
    //Reply
    this.handleReplyShow = this.handleReplyShow.bind(this)
    this.handleReplyClose = this.handleReplyClose.bind(this)
    this.handleReplyChange = this.handleReplyChange.bind(this)
    this.handleReplySubmit = this.handleReplySubmit.bind(this)
  }

  //Delete
  handleDeleteShow() {
    this.setState({
      deleteShow: true
    })
  }
  handleDeleteClose() {
    this.setState({
      deleteShow: false
    })
  }
  handleDeleteSubmit() {
    this.props.delComment(Number(this.props.comment.id))
    this.handleDeleteClose()
  }

  //Edit
  handleShow() {
    this.setState({
      show: true
    })
  }
  handleClose() {
    this.setState({
      show: false
    })
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  async handleSubmit(e) {
    e.preventDefault()
    await this.props.putComment({
      commentId: this.props.comment.id,
      content: this.state.content
    })
    this.handleClose()
  }

  //reply

  handleReplyShow(id) {
    let form = document.getElementById(id)
    console.log(form)
    form.style.display = 'block'

    // this.setState({
    //   replyShow: 'block'
    // })
    // console.log(this.state.replyShow)
  }
  handleReplyClose(id) {
    let form = document.getElementById(id)
    console.log(form)
    form.style.display = 'none'
  }
  handleReplyChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
    // console.log(this.state)
  }
  async handleReplySubmit(parentId) {
    await this.props.postReply({
      parentId,
      resourceId: Number(this.props.resource.id),
      linkId: Number(this.props.link.id),
      content: this.state.reply,
      isChild: true
    })

    await this.handleReplyClose(parentId)
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
              {this.props.comments !== undefined ? (
                this.props.comments.filter(comment => {
                  return comment.parentId === this.props.comment.id
                }).length > 0 ? (
                  <Card.Footer>
                    {/* \/\/\/\/\/\/\/\/\/\/\/\/\/ Replies go here \/ \/ \/ \/ \/ \/*/}
                    {this.props.comments !== undefined
                      ? this.props.comments
                          .filter(comment => {
                            return comment.parentId === this.props.comment.id
                          })
                          .map(comment => {
                            return (
                              <ConnectedComment
                                key={comment.id}
                                comment={comment}
                              />
                            )
                          })
                      : ''}
                  </Card.Footer>
                ) : null
              ) : null}
            </Card>
          </Col>
        </Row>
        <br />
        {/* Delete Modal */}
        <Modal show={this.state.deleteShow} onHide={this.handleDeleteClose}>
          <Modal.Header closeButton>Delete</Modal.Header>
          <Modal.Body>Are you sure you want to delete your comment?</Modal.Body>
          <Modal.Footer>
            <Button variant="submit" onClick={this.handleDeleteClose}>
              Cancel
            </Button>
            <Button variant="submit" onClick={this.handleDeleteSubmit}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Edit Comment Modal */}
        <Form onSubmit={this.handleSubmit}>
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>Edit Comment</Modal.Header>
            <Modal.Body>
              Please keep all discussion related to the resource
              <Form.Control
                name="content"
                type="content"
                as="textarea"
                rows="10"
                onChange={this.handleChange}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="submit" onClick={this.handleClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={this.handleSubmit}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
        </Form>
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

export const ConnectedComment = connect(mapState, mapDispatch)(Comment)
