import React, {Component} from 'react'
import {Row, Col, Modal, Button, Form} from 'react-bootstrap'
import {connect} from 'react-redux'
import {
  getSingleResource,
  delResource,
  putResource,
  postResource
} from '../store/resource'

class Resource extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      show: false
    }
    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  async componentDidMount() {
    await this.props.getSingleResource(Number(this.props.match.params.id))
  }

  handleShow() {
    this.setState({
      show: true
    })
  }

  handleClose() {
    this.setState({
      show: false
    })
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit() {
    this.props.putResource({
      id: Number(this.props.match.params.id),
      title: this.state.title,
      description: this.state.description,
      link: this.state.link,
      type: this.state.type
    })
    this.handleClose()
  }
  render() {
    const options = [
      'Select Type',
      'Paper',
      'Essay',
      'Video',
      'Full Course',
      'Blog',
      'Website',
      'Article',
      'Podcast',
      'Graph',
      'Textbook',
      'Book',
      'Practice Problem Set',
      'Exercise'
    ]
    return (
      <div>
        <Row>
          <Button
            onClick={() =>
              this.props.delResource({resource: this.props.resource})
            }
          >
            Delete
          </Button>
          <Button onClick={this.handleShow}>Edit</Button>
          <Col xs={12}>
            <Col xs={5}>
              <Row>
                {' '}
                <strong>Title:</strong> {this.props.resource.title}
              </Row>
            </Col>
            <Col xs={5}>
              <Row>
                {' '}
                <strong>Description:</strong>
                {this.props.resource.description}
              </Row>
            </Col>
            <Row>
              <Col xs={5}>
                {' '}
                <strong>Type:</strong> {this.props.resource.type}
              </Col>
            </Row>
            <Row>
              <Col xs={5}>
                {' '}
                <strong>Link:</strong>{' '}
                <a href={this.props.resource.link} target="_blank">
                  {this.props.resource.link}
                </a>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <strong>Comments here</strong>
          </Col>
        </Row>
        {/* Edit Modal */}
        <Form>
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Resource</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                {/* Title */}
                <Form.Label>Title</Form.Label>
                <Form.Control
                  name="title"
                  type="title"
                  placeholder="Enter Title"
                  onChange={this.handleChange}
                />
                <Form.Label>Description</Form.Label>
                <Form.Control
                  name="description"
                  type="description"
                  placeholder="Enter Description"
                  onChange={this.handleChange}
                />
                <Form.Label>Link</Form.Label>
                <Form.Control
                  name="link"
                  type="link"
                  placeholder="Enter Link"
                  onChange={this.handleChange}
                />
                <Form.Label>Type</Form.Label>
                <Form.Control
                  as="select"
                  name="type"
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
              <Button variant="submit" onClick={this.handleSubmit}>
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
    getSingleResource: resourceId => dispatch(getSingleResource(resourceId)),
    postResource: resource => dispatch(postResource(resource)),
    delResource: resource => dispatch(delResource(resource)),
    putResource: resource => dispatch(putResource(resource))
  }
}

const mapState = state => {
  return {
    resource: state.resource
  }
}

export const ConnectedResource = connect(mapState, mapDispatch)(Resource)
