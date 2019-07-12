/*eslint-disable complexity*/
import React, {Component} from 'react'
import {Row, Col, Modal, Button, Form, Card} from 'react-bootstrap'
import {connect} from 'react-redux'
import {
  getSingleResource,
  delResource,
  putResource,
  postResource
} from '../store/resource'
import {upvote, downvote, getVote} from '../store/vote'
import {getLink} from '../store/link'
import {getComments} from '../store/comment'
import {
  ConnectedComment,
  ConnectedResourceCommentForm,
  ConnectedResourceTagLineItem
} from '.'
import {Link} from 'react-router-dom'
class Resource extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      show: false,
      score: 0,
      voteType: 'none'
    }
    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async componentDidMount() {
    await this.props.getSingleResource(Number(this.props.match.params.id))
    await this.props.getLink(Number(this.props.match.params.id))
    await this.props.getComments(Number(this.props.link.id))
    let voteCheck = []
    if (
      this.props.resource !== undefined &&
      this.props.resource.votes !== undefined &&
      this.props.resource.votes.length > 0 &&
      this.props.user !== undefined &&
      this.props.user.id !== undefined
    ) {
      const upvotes = this.props.resource.votes.filter(vote => {
        return vote.voteType === 'upvote'
      })
      const downvotes = this.props.resource.votes.filter(vote => {
        return vote.voteType === 'downvote'
      })
      let resourceScore = upvotes.length - downvotes.length
      this.setState({
        score: resourceScore,
        originalScore: resourceScore
      })
      voteCheck = this.props.resource.votes.filter(vote => {
        return vote.userId === this.props.user.id
      })
    }
    console.log(voteCheck)
    if (voteCheck.length > 0) {
      this.setState({
        voteType: voteCheck[0].voteType
      })
    } else
      this.setState({
        voteType: 'none'
      })
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
    let tags = ''
    if (
      this.props.resource &&
      this.props.resource.ResourceTags &&
      this.props.resource.ResourceTags.length > 0
    ) {
      this.props.resource.ResourceTags.forEach(tag => {
        tags += `${tag.title}, `
      })
    }

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
    const resource = this.props.resource
    return (
      <div>
        <Row>
          <Col xs={12}>
            {/* <Col xs={5}>
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
            </Row> */}
            {/* <Row>
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
            </Row> */}
            <Row>
              <Col xs={5}>
                {this.props.resource !== undefined &&
                this.props.resource.votes !== undefined ? (
                  <React.Fragment>
                    <Card>
                      <Card.Body>
                        <Card.Title>
                          <Row>
                            <Col>
                              <React.Fragment>
                                <Link
                                  to={`/resource/${resource.id}`}
                                  style={{color: 'black'}}
                                >
                                  {resource.title} | Score:{' '}
                                </Link>{' '}
                                {this.state.voteType === 'upvote' ? (
                                  //deletes an upvote
                                  <Button
                                    variant="success"
                                    sz="sm"
                                    onClick={async () => {
                                      await this.props.upvote({
                                        resource: this.props.resource,
                                        voteType: 'upvote'
                                      })
                                      this.setState({
                                        voteType: 'none',
                                        score: this.state.score - 1
                                      })
                                    }}
                                  >
                                    +
                                  </Button>
                                ) : (
                                  //posts the upvote

                                  <Button
                                    variant="outline-secondary"
                                    sz="sm"
                                    onClick={async () => {
                                      await this.props.upvote({
                                        resource: this.props.resource,
                                        voteType: 'none'
                                      })
                                      if (this.state.voteType === 'none') {
                                        this.setState({
                                          voteType: 'upvote',
                                          score: this.state.score + 1
                                        })
                                      } else if (
                                        this.state.voteType === 'downvote'
                                      ) {
                                        this.setState({
                                          voteType: 'upvote',
                                          score: this.state.score + 2
                                        })
                                      }
                                    }}
                                  >
                                    +
                                  </Button>
                                )}
                                <Button variant="submit" sz="sm">
                                  {this.state.score} pts.
                                </Button>
                                {this.state.voteType === 'downvote' ? (
                                  //deletes downvote
                                  <Button
                                    variant="danger"
                                    sz="sm"
                                    onClick={async () => {
                                      await this.props.downvote({
                                        resource: this.props.resource,
                                        voteType: 'none'
                                      })
                                      this.setState({
                                        voteType: 'none',
                                        score: this.state.score + 1
                                      })
                                    }}
                                  >
                                    -
                                  </Button>
                                ) : (
                                  //posts a downvote

                                  <Button
                                    variant="outline-secondary"
                                    sz="sm"
                                    onClick={async () => {
                                      await this.props.downvote({
                                        resource: this.props.resource,
                                        voteType: 'downvote'
                                      })
                                      if (this.state.voteType === 'upvote') {
                                        this.setState({
                                          voteType: 'downvote',
                                          score: this.state.score - 2
                                        })
                                      } else if (
                                        this.state.voteType === 'none'
                                      ) {
                                        this.setState({
                                          voteType: 'downvote',
                                          score: this.state.score - 1
                                        })
                                      }
                                    }}
                                  >
                                    -
                                  </Button>
                                )}
                              </React.Fragment>
                            </Col>
                          </Row>
                        </Card.Title>
                        <Card.Subtitle className="text-muted">
                          {resource.description}
                        </Card.Subtitle>
                        <hr />
                        <Row>
                          <Col>
                            Tags:
                            {resource &&
                            resource.ResourceTags &&
                            resource.ResourceTags.length > 0
                              ? resource.ResourceTags.map(tag => {
                                  return (
                                    <Link to={`/tag/${tag.id}`} key={tag.id}>
                                      <Button size="sm" variant="light">
                                        {tag.title}{' '}
                                      </Button>
                                    </Link>
                                  )
                                })
                              : null}
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                    <br />
                  </React.Fragment>
                ) : null}
              </Col>
            </Row>
          </Col>
          {this.props.user.rank === 'admin' ? (
            <Button
              onClick={() =>
                this.props.delResource({resource: this.props.resource})
              }
              variant="submit"
            >
              Delete
            </Button>
          ) : null}
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
                  defaultValue={this.props.resource.title}
                  onChange={this.handleChange}
                />
                <Form.Label>Description</Form.Label>
                <Form.Control
                  name="description"
                  type="description"
                  placeholder="Enter Description"
                  defaultValue={this.props.resource.description}
                  onChange={this.handleChange}
                />
                <Form.Label>Link</Form.Label>
                <Form.Control
                  name="link"
                  type="link"
                  placeholder="Enter Link"
                  defaultValue={this.props.resource.link}
                  onChange={this.handleChange}
                />
                <Form.Label>Type</Form.Label>
                <Form.Control
                  as="select"
                  name="type"
                  defaultValue={this.props.resource.type}
                  onChange={this.handleChange}
                >
                  {options.map(option => {
                    return <option key={option}>{option}</option>
                  })}
                </Form.Control>
                <Form.Label>Tags</Form.Label>
                <Form.Control
                  name="tags"
                  type="tags"
                  placeholder="Enter Tags"
                  defaultValue={tags}
                  onChange={this.handleChange}
                />
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
    getLink: resourceId => dispatch(getLink(resourceId)),
    upvote: resource => dispatch(upvote(resource)),
    downvote: resource => dispatch(downvote(resource)),
    getVote: resource => dispatch(getVote(resource))
  }
}

const mapState = state => {
  return {
    resource: state.resource,
    comments: state.comment,
    link: state.link,
    user: state.currUser,
    vote: state.vote
  }
}

export const ConnectedResource = connect(mapState, mapDispatch)(Resource)
