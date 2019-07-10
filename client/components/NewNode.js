import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Modal, Button, Form, Card} from 'react-bootstrap'
import {postNode} from '../store/node'

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

  //START NODE HANDLERS

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
    this.setState({
      show: false
    })
    await this.props.postNode({
      title: this.state.title,
      description: this.state.description,
      question: this.state.question,
      nodeType: 'Root',
      type: 'empty',
      x: 796.4899291992188,
      y: 407.50421142578125,
      treeId: this.props.treeId
    })
  }

  render() {
    return (
      <React.Fragment>
        <Card>
          <Button variant="light" onClick={this.handleShow}>
            Add Node
          </Button>
        </Card>
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
                {/* Focus Question */}
                <Form.Label>Focus Question</Form.Label>
                <Form.Control
                  name="question"
                  type="question"
                  placeholder="Add Focus Question"
                  onChange={this.handleChange}
                />
                <Form.Text className="text-muted">
                  A good Focus Question can help you figure out what you're
                  supposed to learn from a concept. If you were learning about
                  baking bread, for example, you might ask 'What does yeast do
                  in the process of baking bread?'
                </Form.Text>
                {/* Description */}

                <Form.Label>Description</Form.Label>
                <Form.Control
                  name="description"
                  type="description"
                  placeholder="Add Description"
                  onChange={this.handleChange}
                />
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
const mapDispatch = dispatch => {
  return {
    postNode: node => dispatch(postNode(node))
  }
}

export const ConnectedNewNode = connect(mapState, mapDispatch)(NewNode)
