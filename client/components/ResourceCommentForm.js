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
    this.props.postComment({
      content: this.state.content,
      userId: this.props.user.id,
      resourceId: Number(this.props.resourceId)
    })
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value})
  }

  render() {
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
              style={{width: '50%'}}
              placeholder="Please keep all discussion related to resource"
              onChange={this.handleChange}
            />
            <br />
            {/* </Form.Group> */}
            <Button variant="primary" onClick={this.handleSubmit}>
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
    user: state.user
  }
}

export const ConnectedResourceCommentForm = connect(mapState, mapDispatch)(
  ResourceCommentForm
)
