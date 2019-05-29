import React, {Component} from 'react'
import {Row, Col, Form, Button, Modal, Card} from 'react-bootstrap'
import {connect} from 'react-redux'
import {postComment} from '../store/comment'

class ResourceCommentForm extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  //Handles Modal
  handleSubmit(e) {
    e.preventDefault()
    if (this.state.content.length < 0) {
      //prevents
      console.log()
    }
    this.props.postComment({
      content: this.state.content,
      userId: this.props.user.id,
      resourceId: Number(this.props.resourceId),
      linkId: Number(this.props.linkId)
    })
    this.setState({
      content: ''
    })
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value})
  }

  render() {
    const {content} = this.state
    let enabled
    if (content !== undefined) {
      enabled = content.length > 0
    }
    return (
      <Row>
        <Col xs={12}>
          <strong>Comment:</strong>
          <Form onSubmit={this.handleSubmit}>
            {/* <Form.Group controlId="title"> */}
            <Form.Control
              name="content"
              type="content"
              as="textarea"
              value={this.state.content}
              style={{width: '50%'}}
              placeholder="Please keep all discussion related to the resource"
              onChange={this.handleChange}
            />
            <br />
            {/* </Form.Group> */}
            <Button
              variant="primary"
              onClick={this.handleSubmit}
              disabled={!enabled}
            >
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    )
  }
}

const mapDispatch = dispatch => {
  return {
    postComment: comment => dispatch(postComment(comment))
  }
}

const mapState = state => {
  return {
    resource: state.resource,
    user: state.currUser
  }
}

export const ConnectedResourceCommentForm = connect(mapState, mapDispatch)(
  ResourceCommentForm
)
