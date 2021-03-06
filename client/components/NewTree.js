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
      description: '',
      private: 'False'
    }
    //Bindings
    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  //Handles Modal
  async handleSubmit() {
    let privateCheck = false
    const tags = this.state.tags.split(', ')

    if (this.state.private === 'True') {
      privateCheck = true
    }

    await this.props.postTree({
      title: this.state.title,
      description: this.state.description,
      isPrivate: privateCheck,
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
    console.log(this.state)
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
          <Button variant="light" onClick={this.handleShow}>
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
                <Form.Group controlId="private">
                  <Form.Label>Private</Form.Label>
                  <Form.Control
                    name="private"
                    as="select"
                    onChange={this.handleChange}
                    // defaultValue={this.state.private}
                  >
                    {/* NOT WORKING NOT SURE WHY */}
                    <option>Select</option>
                    <option>True</option>
                    <option>False</option>
                  </Form.Control>
                  <Form.Text className="text-muted">
                    True: Only you and approved users can see this Tree.
                    <br />
                    False (default): Anyone can see this Tree. Approved users
                    may make edits
                  </Form.Text>
                </Form.Group>
                <Form.Group controlId="tags">
                  <Form.Label>Tags</Form.Label>
                  <Form.Control name="tags" onChange={this.handleChange} />
                  <Form.Text className="text-muted">
                    Separate with a comma and a space. Ex. 'Machine Learning,
                    TensorFlow, JavaScript
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
