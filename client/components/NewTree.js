import React, {Component} from 'react'
import {Row, Col, Form, Button, Modal, Dropdown} from 'react-bootstrap'
import {postTree} from '../store/learningTree'
import {connect} from 'react-redux'

class NewTree extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      show: false,
      title: '',
      description: ''
    }
    //Bindings
    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  //Handles Modal
  handleClose() {
    //AXIOS POST
    this.props.postTree({
      title: this.state.title,
      description: this.state.description
    })
    this.setState({
      title: '',
      description: '',
      show: false
    })
  }

  handleShow() {
    this.setState({show: true})
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value})
  }

  render() {
    return (
      <div>
        <Form>
          <Dropdown.Item onClick={this.handleShow}>New Tree</Dropdown.Item>
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>New Learning Tree</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Modal.Body>
                <Form.Group controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    name="title"
                    type="title"
                    value={this.state.title}
                    placeholder="Ex. Machine Learning for Beginners"
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    name="description"
                    as="textarea"
                    value={this.state.description}
                    rows="3"
                    onChange={this.handleChange}
                  />
                </Form.Group>
              </Modal.Body>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={this.handleClose}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
        </Form>
      </div>
    )
  }
}

const mapDispatch = dispatch => {
  return {
    postTree: data => dispatch(postTree(data))
  }
}

export const ConnectedNewTree = connect(null, mapDispatch)(NewTree)
