import React, {Component} from 'react'
import {Row, Col, Form, Button, Modal, Card} from 'react-bootstrap'
import {postTree} from '../store/learningTree'
import {postTag} from '../store/tag'
import {me} from '../store/currentUser'
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
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  //Handles Modal
  async handleSubmit() {
    const tags = this.state.tags.split(', ')
    await this.props.postTree({
      title: this.state.title,
      description: this.state.description,
      tags: tags
    })

    await this.handleClose()
    await this.props.me()
  }

  handleClose() {
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
    const {description, title} = this.state
    let enabled
    if (description !== undefined && title !== undefined) {
      enabled = description.length > 0 && title.length > 0
    }
    return (
      <React.Fragment>
        <Card>
          <Button variant="submit" onClick={this.handleShow}>
            New Tree
          </Button>
        </Card>
        <Form>
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
                    // value={this.state.title}
                    placeholder="Ex. Machine Learning for Beginners"
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    name="description"
                    as="textarea"
                    // value={this.state.description}
                    rows="3"
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="tags">
                  <Form.Label>Tags</Form.Label>
                  <Form.Control name="tags" onChange={this.handleChange} />
                  <Form.Text className="text-muted">
                    Separate with a comma and a space. Ex. 'Machine Learning,
                    TensorFlow, JavaScript'
                  </Form.Text>
                </Form.Group>
              </Modal.Body>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
              <Button
                variant="primary"
                disabled={!enabled}
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

const mapDispatch = dispatch => {
  return {
    postTree: data => dispatch(postTree(data)),
    postTag: data => dispatch(postTag(data)),
    me: () => dispatch(me())
  }
}

const mapState = state => {
  return {
    tree: state.tree
  }
}

export const ConnectedNewTree = connect(mapState, mapDispatch)(NewTree)
