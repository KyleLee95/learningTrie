import React, {Component} from 'react'
import {Row, Col, Modal, Button, Form, Card} from 'react-bootstrap'
import {connect} from 'react-redux'
import {delComment, putComment, postReply} from '../store/comment'
import moment from 'moment'
class Comment extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      show: false,
      deleteShow: false,
      replyShow: false
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
  handleSubmit(e) {
    e.preventDefault()
    this.props.putComment({
      commentId: this.props.comment.id,
      content: this.state.content
    })
    this.handleClose()
  }

  //reply

  handleReplyShow() {
    this.setState({
      replyShow: !this.state.replyShow
    })
    console.log(this.state.replyShow)
  }
  handleReplyClose() {
    this.setState({
      replyShow: false
    })
  }
  handleReplyChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  handleReplySubmit(parentId) {
    this.props.postReply({
      parentId,
      resourceId: Number(this.props.resource.id),
      linkId: Number(this.props.link.id),
      content: 'TEST'
    })
    //Needs comment id
    console.log()
    // await this.handleReplyClose()
  }

  //   <Button
  //   variant="submit"
  //   onClick={() => this.handleReplySubmit(this.props.comment.id)}
  // >
  //   Reply Submit
  //   Reply
  // </Button>

  render() {
    //If the comment has an odd ID #, render it on a white backgroud
    //If the comment has an even ID #, render it on a dark grey background
    return (
      <React.Fragment>
        <Row>
          <Col xs={{span: 9, offSet: 10}}>
            <Card>
              <Card.Body>
                <Card.Title>
                  {this.props.comment.user &&
                  this.props.comment.user.firstName !== undefined &&
                  this.props.comment.user.lastName !== undefined
                    ? `${this.props.comment.user.firstName} ${
                        this.props.comment.user.lastName
                      }`
                    : ''}{' '}
                  | posted: {moment(this.props.comment.createdAt).fromNow()}
                </Card.Title>
                <Card.Body>{this.props.comment.content}</Card.Body>
              </Card.Body>
              {/* Create conditional render for color of the card like so */}
              <Card.Footer>
                <Button variant="submit" onClick={this.handleDeleteShow}>
                  Delete
                </Button>
                <Button variant="submit" onClick={this.handleShow}>
                  Edit
                </Button>
                <Button variant="submit" onClick={this.handleReplyShow}>
                  Reply
                </Button>

                {/* </Card.Footer>
              <Card.Footer> */}

                {/* \/\/\/\/\/\/\/\/\/\/\/\/\/ Replies go here \/ \/ \/ \/ \/ \/*/}
                {/* <Row> */}
                {/* <Col xs={12}> */}

                {this.props.comment.children !== undefined
                  ? this.props.comment.children.map(child => {
                      return (
                        <Card key={child.id}>
                          <Card.Body>
                            <Card.Title>
                              {child &&
                              child.user.firstName !== undefined &&
                              child.user.lastName !== undefined
                                ? `${child.user.firstName} ${
                                    child.user.lastName
                                  }`
                                : ''}{' '}
                              | posted: {moment(child.createdAt).fromNow()}
                            </Card.Title>
                            <Card.Body>{child.content}</Card.Body>
                          </Card.Body>
                          <Card.Footer>
                            <Button
                              variant="submit"
                              onClick={this.handleDeleteShow}
                            >
                              Delete
                            </Button>
                            <Button variant="submit" onClick={this.handleShow}>
                              Edit
                            </Button>
                            <Button
                              variant="submit"
                              onClick={() =>
                                this.handleReplySubmit(this.props.comment.id)
                              }
                            >
                              Reply
                            </Button>
                          </Card.Footer>
                        </Card>
                      )
                    })
                  : ''}
                {/* <Card>
                  <Card.Body>
                    <Card.Title>
                      {this.props.comment.user &&
                      this.props.comment.user.firstName !== undefined &&
                      this.props.comment.user.lastName !== undefined
                        ? `${this.props.comment.user.firstName} ${
                            this.props.comment.user.lastName
                          }`
                        : ''}{' '}
                      | posted: {moment(this.props.comment.createdAt).fromNow()}
                    </Card.Title>
                    <Card.Body>{this.props.comment.content}</Card.Body>
                  </Card.Body>
                  <Card.Footer>
                    <Button variant="submit" onClick={this.handleDeleteShow}>
                      Delete
                    </Button>
                    <Button variant="submit" onClick={this.handleShow}>
                      Edit
                    </Button>
                    <Button
                      variant="submit"
                      onClick={() =>
                        this.handleReplySubmit(this.props.comment.id)
                      }
                    >
                      Reply
                    </Button>
                  </Card.Footer>
                </Card> */}
                {/* </Col> */}
                {/* </Row> */}
              </Card.Footer>
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
    postReply: comment => dispatch(postReply(comment))
  }
}
const mapState = state => {
  return {
    resource: state.resource,
    link: state.link
  }
}

export const ConnectedComment = connect(mapState, mapDispatch)(Comment)
