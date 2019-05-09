import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Modal, Button, Form} from 'react-bootstrap'

class NewNode extends Component {
  constructor(props, context) {
    super(props, context)
    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      show: false
    }
  }

  handleClose() {
    this.setState({show: false})
  }

  handleShow() {
    this.setState({show: true})
  }

  handleSubmit(e) {
    this.setState({show: false})
    this.props.createNode()
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
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Title</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>
              <Form.Group controlId="formBasicChecbox">
                <Form.Check type="checkbox" label="Check me out" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
              <Button variant="submit" onClick={this.handleSubmit}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
        </Form>
      </React.Fragment>
    )
  }
}

// const mapDispatch = dispatch => {
//   return {}
// }

export const ConnectedNewNode = connect(null, null)(NewNode)
