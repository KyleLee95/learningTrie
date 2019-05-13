import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Modal, Button, Form} from 'react-bootstrap'

class EditNode extends Component {
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
    this.setState({show: false})
    await this.props.createNode(
      this.state.title,
      this.state.description,
      //prevents the node and edge with the same ID from being selected
      this.props.nodes.length + 100000
    )
  }

  render() {
    return (
      <div>
        <Modal.Header closeButton>
          <Modal.Title>Edit Node</Modal.Title>
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
            <Form.Label>Description</Form.Label>
            <Form.Control
              name="description"
              type="description"
              placeholder="Add Description"
              onChange={this.handleChange}
            />

            <Form.Label>Resource</Form.Label>
            <Form.Control
              name="resource"
              type="resource"
              placeholder="Add Resoure"
              onChange={this.handleChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="submit" onClick={this.props.close}>
            Close
          </Button>
          <Button variant="submit" onClick={this.handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </div>
    )
  }
}

const mapState = state => {
  return {nodes: state.node}
}

export const ConnectedEditNode = connect(mapState, null)(EditNode)
