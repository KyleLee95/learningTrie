/*eslint-disable complexity*/
import React, {Component} from 'react'
import {Row, Col, Modal, Button, Form} from 'react-bootstrap'
import {connect} from 'react-redux'
import {
  getSingleResource,
  delResource,
  putResource,
  postResource
} from '../store/resource'
import {getLink} from '../store/link'
import {getComments} from '../store/comment'
import {ConnectedComment, ConnectedResourceCommentForm} from '.'
import {Link} from 'react-router-dom'
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
    await this.props.getLink(Number(this.props.match.params.id))
    await this.props.getSingleResource(Number(this.props.match.params.id))
    await this.props.getComments(Number(this.props.link.id))
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
          <Col xs={12}>
            <Col xs={5}>
              <Row>
                {' '}
                <strong>Title:</strong>{' '}
                {this.props.resource && this.props.resource.title !== undefined
                  ? this.props.resource.title
                  : ''}
              </Row>
            </Col>
            <Col xs={5}>
              <Row>
                {' '}
                <strong>Description:</strong>
                {this.props.resource ? this.props.resource.description : ''}
              </Row>
            </Col>
            <Row>
              <Col xs={5}>
                {' '}
                <strong>Type:</strong>{' '}
                {this.props.resource ? this.props.resource.type : ''}
              </Col>
            </Row>
            <Row>
              <Col xs={5}>
                {' '}
                <strong>Link:</strong>{' '}
                <a
                  href={
                    this.props.resource &&
                    this.props.resource.link !== undefined
                      ? this.props.resource.link
                      : ''
                  }
                  target="_blank"
                >
                  {this.props.resource && this.props.resource.link
                    ? this.props.resource.link
                    : ''}
                </a>
              </Col>
            </Row>
            <Row>
              <Col xs={5}>
                <strong>Tags:</strong>{' '}
                {this.props.resource && this.props.resource.ResourceTags
                  ? this.props.resource.ResourceTags.map(tag => {
                      return (
                        <Link key={tag.id} to={`/resourceTag/${tag.id}`}>
                          <Button variant="light" size="sm">
                            {tag.title}
                          </Button>
                        </Link>
                      )
                    })
                  : null}
              </Col>
            </Row>
          </Col>
          <Button
            onClick={() =>
              this.props.delResource({resource: this.props.resource})
            }
            variant="submit"
          >
            Delete
          </Button>
          <Button onClick={this.handleShow} variant="submit">
            Edit
          </Button>
        </Row>
        <Row>
          <Col xs={12}>
            <ConnectedResourceCommentForm
              resourceId={this.props.match.params.id}
              linkId={
                this.props.resource !== undefined &&
                this.props.resource.links !== undefined &&
                this.props.resource.links.length > 0
                  ? this.props.resource.links[0].id
                  : ''
              }
            />
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xs={12}>
            <strong>Discussion: </strong>
            <hr />

            {this.props.comments && this.props.comments.length > 0
              ? this.props.comments
                  .filter(comment => {
                    return comment.isChild === false
                  })
                  .map(comment => {
                    return (
                      <ConnectedComment key={comment.id} comment={comment} />
                    )
                  })
              : 'No comments yet. Start the discussion by adding your own comment!'}
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
    putResource: resource => dispatch(putResource(resource)),
    getComments: resourceId => dispatch(getComments(resourceId)),
    getLink: resourceId => dispatch(getLink(resourceId))
  }
}

const mapState = state => {
  return {
    resource: state.resource,
    comments: state.comment,
    link: state.link
  }
}

export const ConnectedResource = connect(mapState, mapDispatch)(Resource)
