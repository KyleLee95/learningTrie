import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Modal, Button, Form} from 'react-bootstrap'

class NewReview extends Component {
  constructor(props, context) {
    super(props, context)
    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      show: false
    }
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  handleClose() {
    this.setState({show: false})
  }

  handleShow() {
    this.setState({show: true})
  }

  async handleSubmit() {
    await console.log('A')
  }

  render() {
    const options = [1, 2, 3, 4, 5]
    return (
      <React.Fragment>
        <Button variant="primary" onClick={this.handleShow}>
          Add Review
        </Button>
        <Form>
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>New Review</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                {/* Title */}
                <Form.Label>Title</Form.Label>
                <Form.Control
                  name="title"
                  type="title"
                  placeholder="Enter title"
                  onChange={this.handleChange}
                />
                {/* Description */}
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  name="content"
                  type="content"
                  placeholder="Add Content"
                  onChange={this.handleChange}
                />
                <Form.Label>Rating</Form.Label>
                <Form.Control
                  as="select"
                  multipl
                  name="rating"
                  type="rating"
                  placeholder="Add Rating"
                  onChange={this.handleChange}
                >
                  {options.map(option => {
                    return <option key={option}>{option}</option>
                  })}
                </Form.Control>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="submit" onClick={this.handleClose}>
                Close
              </Button>
              <Button
                variant="submit"
                type="submit"
                onClick={this.handleSubmit}
              >
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
        </Form>
      </React.Fragment>
    )
  }
}

const mapState = state => {
  return {tree: state.tree}
}

export const ConnectedNewReview = connect(mapState, null)(NewReview)
