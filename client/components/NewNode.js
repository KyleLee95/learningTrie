import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Modal, Button, Form} from 'react-bootstrap'

class NewNode extends Component {
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
    // const counter = 1000
    // let id
    // if (this.props.nodes.length === 0) {
    //   id = Date.now()
    // } else {
    const id = Date.now()
    // this.props.nodes.length + counter
    // }
    this.setState({
      show: false
    })
    await this.props.createNode(
      this.state.title,
      this.state.description,
      id,
      this.state.resource
    )
  }

  render() {
    return (
      <React.Fragment>
        <Button variant="primary" onClick={this.handleShow}>
          Add Node
        </Button>
        <Form>
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>New Node</Modal.Title>
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

                {/* <Form.Label>Resource</Form.Label>
                <Form.Control
                  name="resource"
                  type="resource"
                  placeholder="Add Resoure"
                  onChange={this.handleChange}
                /> */}
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
  return {nodes: state.node}
}

export const ConnectedNewNode = connect(mapState, null)(NewNode)
