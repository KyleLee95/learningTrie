/*eslint-disable complexity*/
import React, {Component} from 'react'
import {Row, Col, Modal, Button, Form} from 'react-bootstrap'
import {connect} from 'react-redux'
import {
  getSingleRecommendation,
  delResource,
  putResource,
  postResource
} from '../store/recommendation'
import {getLink} from '../store/link'
import {getComments} from '../store/comment'
import {ConnectedComment, ConnectedResourceCommentForm} from '.'

class Recommendation extends Component {
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
    await this.props.getSingleRecommendation(Number(this.props.match.params.id))
    // await this.props.getComments(Number(this.props.link.id))
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
                {this.props.recommendation &&
                this.props.recommendation.title !== undefined
                  ? this.props.recommendation.title
                  : ''}
              </Row>
            </Col>
            <Col xs={5}>
              <Row>
                {' '}
                <strong>Description:</strong>
                {this.props.recommendation
                  ? this.props.recommendation.description
                  : ''}
              </Row>
            </Col>
            <Row>
              <Col xs={5}>
                {' '}
                <strong>Type:</strong>{' '}
                {this.props.recommendation
                  ? this.props.recommendation.type
                  : ''}
              </Col>
            </Row>
            <Row>
              <Col xs={5}>
                {' '}
                <strong>Link:</strong>{' '}
                <a
                  href={
                    this.props.recommendation &&
                    this.props.recommendation.link !== undefined
                      ? this.props.recommendation.link
                      : ''
                  }
                  target="_blank"
                >
                  {this.props.recommendation && this.props.recommendation.link
                    ? this.props.recommendation.link
                    : ''}
                </a>
              </Col>
            </Row>
          </Col>
          <Button
            onClick={() =>
              this.props.delResource({
                recommendation: this.props.recommendation
              })
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
              ? this.props.comments.map(comment => {
                  return <ConnectedComment key={comment.id} comment={comment} />
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
    getSingleRecommendation: recommendationId =>
      dispatch(getSingleRecommendation(recommendationId)),
    // postResource: resource => dispatch(postResource(resource)),
    // delResource: resource => dispatch(delResource(resource)),
    // putResource: resource => dispatch(putResource(resource)),
    // getComments: resourceId => dispatch(getComments(resourceId)),
    getLink: resourceId => dispatch(getLink(resourceId))
  }
}

const mapState = state => {
  return {
    recommendation: state.recommendation,
    comments: state.comment,
    link: state.link
  }
}

export const ConnectedRecommendation = connect(mapState, mapDispatch)(
  Recommendation
)
