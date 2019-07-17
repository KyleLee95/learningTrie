/*eslint-disable complexity*/
import React, {Component} from 'react'
import {Row, Col, Modal, Button, Form, Card} from 'react-bootstrap'
import {connect} from 'react-redux'
import {
  getSingleRecommendation,
  delRecommendation,
  putRecommendation,
  convertRecommendationToResource
} from '../store/recommendation'
import {getLink} from '../store/link'
import {getComments} from '../store/comment'
import {
  getRecommendationVote,
  downvoteRecommendation,
  upvoteRecommendation
} from '../store/vote'
import {ConnectedComment, ConnectedResourceCommentForm} from '.'
import {Link} from 'react-router-dom'
let voteType = 'none'
let auth = false
class Recommendation extends Component {
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
    await this.props.getSingleRecommendation(Number(this.props.match.params.id))
    await this.props.getRecommendationVote(this.props.recommendation[0].link)
    await this.props.getLink(Number(this.props.match.params.id))
    await this.props.getComments(Number(this.props.link.id))
    this.setState({
      score: this.props.recommendation[0].score,
      voteType: this.props.vote.voteType
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

  async handleSubmit() {
    await this.props.putRecommendation({
      id: Number(this.props.match.params.id),
      title: this.state.title,
      description: this.state.description,
      link: this.state.link,
      type: this.state.type
    })
    await this.props.getSingleRecommendation(Number(this.props.match.params.id))
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

    let authId = []
    if (
      this.props.recommendation[0] !== undefined &&
      this.props.recommendation[0].nodes !== undefined &&
      this.props.recommendation[0].nodes[0] !== undefined &&
      this.props.recommendation[0].nodes[0].learningTree !== undefined &&
      this.props.recommendation[0].nodes[0].learningTree !== undefined &&
      this.props.recommendation[0].nodes[0].learningTree.editor !== undefined &&
      this.props.recommendation[0].nodes[0].learningTree.editor[0] !== undefined
    ) {
      this.props.recommendation[0].nodes[0].learningTree.editor.forEach(
        user => {
          return authId.push(user.id)
        }
      )
    }

    if (
      this.props.recommendation[0] !== undefined &&
      this.props.recommendation[0].nodes !== undefined &&
      this.props.recommendation[0].nodes[0] !== undefined &&
      this.props.recommendation[0].nodes[0].learningTree !== undefined &&
      this.props.recommendation[0].nodes[0].learningTree !== undefined &&
      this.props.recommendation[0].nodes[0].learningTree.moderator !==
        undefined &&
      this.props.recommendation[0].nodes[0].learningTree.moderator[0] !==
        undefined
    ) {
      this.props.recommendation[0].nodes[0].learningTree.moderator.forEach(
        user => {
          return authId.push(user.id)
        }
      )
    }
    if (authId.includes(this.props.user.id) === true) {
      auth = true
    }

    if (
      this.props.user.rank === 'admin' ||
      this.props.user.rank === 'moderator'
    ) {
      auth = true
    }

    return (
      <div>
        <Row>
          <Col xs={12}>
            <Row>
              <Col xs={5}>
                {this.props.recommendation !== undefined &&
                this.props.recommendation[0] &&
                this.props.vote !== undefined ? (
                  <React.Fragment>
                    <Card>
                      <Card.Body>
                        <Card.Title>
                          <Row>
                            <Col>
                              <React.Fragment>
                                <Link
                                  to={`/recommendation/${
                                    this.props.recommendation[0].id
                                  }`}
                                  style={{color: 'black'}}
                                >
                                  {this.props.recommendation[0].title} | Score:{' '}
                                </Link>
                                {this.props.user.id === undefined ? (
                                  <Button variant="submit" sz="sm">
                                    {this.state.score} pts.
                                  </Button>
                                ) : (
                                  <React.Fragment>
                                    {this.state.voteType === 'upvote' ? (
                                      //deletes an upvote
                                      <Button
                                        variant="success"
                                        sz="sm"
                                        onClick={async () => {
                                          await this.props.upvoteRecommendation(
                                            {
                                              recommendation: this.props
                                                .recommendation[0],
                                              voteType: 'upvote'
                                            }
                                          )
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
                                          await this.props.upvoteRecommendation(
                                            {
                                              recommendation: this.props
                                                .recommendation[0],
                                              voteType: 'none'
                                            }
                                          )
                                          if (voteType === 'none') {
                                            this.setState({
                                              voteType: 'upvote',
                                              score: this.state.score + 1
                                            })
                                          } else if (voteType === 'downvote') {
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

                                    {/* Shows Score */}
                                    <Button variant="submit" sz="sm">
                                      {this.state.score} pts.
                                    </Button>

                                    {this.state.voteType === 'downvote' ? (
                                      //deletes downvote

                                      <Button
                                        variant="danger"
                                        sz="sm"
                                        onClick={async () => {
                                          await this.props.downvoteRecommendation(
                                            {
                                              recommendation: this.props
                                                .recommendation[0],
                                              voteType: 'downvote'
                                            }
                                          )
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
                                          await this.props.downvoteRecommendation(
                                            {
                                              recommendation: this.props
                                                .recommendation[0],
                                              voteType: 'none'
                                            }
                                          )
                                          if (voteType === 'upvote') {
                                            this.setState({
                                              voteType: 'downvote',
                                              score: this.state.score - 2
                                            })
                                          } else if (voteType === 'none') {
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
                                )}
                              </React.Fragment>
                            </Col>
                          </Row>
                        </Card.Title>
                        <Card.Subtitle>
                          <a
                            href={
                              this.props.recommendation[0] &&
                              this.props.recommendation.link !== undefined
                                ? this.props.resource.link
                                : ''
                            }
                            target="_blank"
                          >
                            {this.props.recommendation[0] &&
                            this.props.recommendation[0].link
                              ? this.props.recommendation[0].link
                              : ''}
                          </a>
                        </Card.Subtitle>
                        <br />
                        <Card.Subtitle className="text-muted">
                          {this.props.recommendation[0].description}
                        </Card.Subtitle>

                        <hr />
                        <Row>
                          <Col>
                            Tags:
                            {this.props.recommendation[0] &&
                            this.props.recommendation[0].ResourceTags &&
                            this.props.recommendation[0].ResourceTags.length > 0
                              ? this.props.recommendation[0].ResourceTags.map(
                                  tag => {
                                    return (
                                      <Link
                                        to={`/resourceTag/${tag.id}`}
                                        key={tag.id}
                                      >
                                        <Button size="sm" variant="light">
                                          {tag.title}{' '}
                                        </Button>
                                      </Link>
                                    )
                                  }
                                )
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
          {auth === false ? null : (
            <React.Fragment>
              <Button
                onClick={() =>
                  this.props.delResource({
                    recommendation: this.props.recommendation[0]
                  })
                }
                variant="submit"
              >
                Delete
              </Button>
              <Button onClick={this.handleShow} variant="submit">
                Edit
              </Button>
            </React.Fragment>
          )}

          {auth === false ? null : (
            <Button
              variant="submit"
              onClick={() =>
                this.props.convertRecommendationToResource({
                  id: this.props.recommendation[0].id,
                  title: this.props.recommendation[0].title,
                  link: this.props.recommendation[0].link,
                  description: this.props.recommendation[0].description,
                  type: this.props.recommendation[0].type,
                  nodeId: this.props.recommendation[0].nodes[0].id,
                  tags: this.props.recommendation[0].ResourceTags
                })
              }
            >
              Add to Resources
            </Button>
          )}
        </Row>

        <hr />
        <Row>
          <Col xs={12}>
            <strong>
              What people have said about{' '}
              {this.props.recommendation[0] !== undefined &&
                this.props.recommendation[0].title}:{' '}
            </strong>
            <hr />
            {this.props.comments && this.props.comments.length > 0
              ? this.props.comments.map(comment => {
                  return (
                    <ConnectedComment
                      key={comment.id}
                      comment={comment}
                      isRec={true}
                    />
                  )
                })
              : 'No comments yet.'}
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
    postResource: resource => dispatch(postResource(resource)),
    // delResource: resource => dispatch(delResource(resource)),
    convertRecommendationToResource: recommendation =>
      dispatch(convertRecommendationToResource(recommendation)),
    putRecommendation: recommendation =>
      dispatch(putRecommendation(recommendation)),
    getComments: resourceId => dispatch(getComments(resourceId)),
    getLink: resourceId => dispatch(getLink(resourceId)),
    getRecommendationVote: recommendationId =>
      dispatch(getRecommendationVote(recommendationId)),
    downvoteRecommendation: recommendation =>
      dispatch(downvoteRecommendation(recommendation)),
    upvoteRecommendation: recommendation =>
      dispatch(upvoteRecommendation(recommendation))
  }
}

const mapState = state => {
  return {
    recommendation: state.recommendation,
    comments: state.comment,
    link: state.link,
    user: state.currUser,
    vote: state.vote
  }
}

export const ConnectedRecommendation = connect(mapState, mapDispatch)(
  Recommendation
)
