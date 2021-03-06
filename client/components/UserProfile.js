/* eslint-disable complexity */
import React, {Component} from 'react'
import {Row, Col, Modal, Button, Form, Card, Tabs, Tab} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {
  fetchSingleUser,
  addFollower,
  removeFollower,
  getResourcesByUser,
  putProfile
} from '../store/user'
import {UserCard} from '.'
import {upvote, downvote, getVote} from '../store/vote'
import moment from 'moment'
import {ConnectedResourceTagLineItem} from './ResourceTagLineItem'

class UserProfile extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      score: 0,
      voteType: 'none',
      show: false
    }
    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  async componentDidMount() {
    await this.props.fetchSingleUser(Number(this.props.match.params.id))
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
    if (voteCheck.length > 0) {
      this.setState({
        voteType: voteCheck[0].voteType
      })
    } else
      this.setState({
        voteType: 'none'
      })
  }
  async componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      await this.props.fetchSingleUser(Number(this.props.match.params.id))
    }
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
  async handleSubmit(e) {
    e.preventDefault()

    await this.props.putProfile({
      bio: this.state.bio,
      id: Number(this.props.match.params.id)
    })
    this.handleClose()
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    let user = []
    if (this.props.users !== undefined && this.props.users[0] !== undefined) {
      user = this.props.users[0]
    }

    return (
      <React.Fragment>
        <Row>
          <Col xs={12} sm={12} md={12} lg={3} xl={3}>
            <h2>
              {user !== undefined ? `${user.username} ` : null}{' '}
              {this.props.user && user && this.props.user.id !== user.id ? (
                user.followers &&
                user.followers.find(
                  follower => this.props.user.id === follower.id
                ) !== undefined ? (
                  <Button
                    onClick={() =>
                      this.props.removeFollower(
                        Number(this.props.match.params.id)
                      )
                    }
                  >
                    unfollow
                  </Button>
                ) : (
                  <Button
                    onClick={() =>
                      this.props.addFollower(Number(this.props.match.params.id))
                    }
                  >
                    follow
                  </Button>
                )
              ) : null}
              {this.props.user &&
              Number(this.props.user.id) !==
                Number(this.props.match.params.id) ? null : (
                <Button onClick={() => this.handleShow()}>Edit</Button>
              )}
            </h2>
            {user.bio}
          </Col>

          <Col xs={12} sm={12} md={12} lg={9} xl={9}>
            <Tabs defaultActiveKey="trees">
              <Tab eventKey="trees" title="Learning Trees">
                <br />

                <Row>
                  <Col xs={12} sm={12} md={12} lg={8} xl={8}>
                    {user && user.learningTrees !== undefined
                      ? user.learningTrees.map(tree => {
                          return (
                            <React.Fragment key={tree.id}>
                              <Card>
                                <Card.Body>
                                  <Card.Title>
                                    <Row>
                                      <Col>
                                        <React.Fragment>
                                          <Link
                                            to={`/learningTree/${tree.id}`}
                                            style={{color: 'black'}}
                                          >
                                            {tree.title} | Score:{' '}
                                            {tree.reviews !== undefined
                                              ? tree.reviews.reduce(
                                                  (accumulator, review) => {
                                                    return (
                                                      accumulator +
                                                      review.rating /
                                                        tree.reviews.length
                                                    )
                                                  },
                                                  0
                                                )
                                              : 0}
                                            / 5 |
                                          </Link>{' '}
                                          created by:{' '}
                                          <Link
                                            to={`/user/${tree.ownerId}`}
                                            style={{color: 'black'}}
                                          >
                                            {tree.users.filter(profile => {
                                              return profile.id === tree.ownerId
                                            })[0] !== undefined
                                              ? tree.users.filter(profile => {
                                                  return (
                                                    profile.id === tree.ownerId
                                                  )
                                                })[0].username
                                              : null}
                                          </Link>
                                        </React.Fragment>
                                      </Col>
                                    </Row>
                                  </Card.Title>
                                  <Card.Subtitle className="text-muted">
                                    {tree.description}
                                  </Card.Subtitle>
                                  <hr />
                                  <Row>
                                    <Col>
                                      Tags:
                                      {tree && tree.tags && tree.tags.length > 0
                                        ? tree.tags.map(tag => {
                                            return (
                                              <Link
                                                to={`/tag/${tag.id}`}
                                                key={tag.id}
                                              >
                                                <Button
                                                  size="sm"
                                                  variant="light"
                                                >
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
                          )
                        })
                      : 'No Trees Found'}
                  </Col>
                </Row>
              </Tab>
              <Tab eventKey="comments" title="Comments">
                <br />
                {user && user.comments !== undefined
                  ? user.comments.map(comment => {
                      return (
                        <Card key={comment.id}>
                          <Card.Body>
                            <Card.Title>
                              {`${user.firstName} ${
                                user.lastName
                              } | posted: ${moment(
                                comment.createdAt
                              ).fromNow()} to `}
                              {
                                <Link
                                  to={`/resource/${comment.resource.id}`}
                                  style={{color: 'black'}}
                                >
                                  {`${comment.resource.title} (${
                                    comment.link.shortUrl
                                  })`}
                                </Link>
                              }
                            </Card.Title>
                            <Card.Body>{comment.content}</Card.Body>
                          </Card.Body>
                          <Card.Footer>
                            <Link to={`/resource/${comment.resource.id}`}>
                              <Button variant="submit">See full context</Button>
                            </Link>
                          </Card.Footer>
                        </Card>
                      )
                    })
                  : 'No Comments Found'}
              </Tab>
              <Tab eventKey="submissions" title="Submitted Resources">
                <br />
                {user && user.resources !== undefined
                  ? user.resources.map(resource => {
                      return (
                        <ConnectedResourceTagLineItem
                          key={resource.id}
                          resource={resource}
                        />
                      )
                    })
                  : 'No Resources Found'}
              </Tab>
              {/* <Tab eventKey="groups" title="Groups">
                Groups
              </Tab> */}
              <Tab
                eventKey="followers"
                title={`Followers (${
                  user && user.followers !== undefined
                    ? user.followers.length
                    : 0
                })`}
              >
                <Row>
                  <Col xs={12} sm={12} md={12} lg={8} xl={8}>
                    <br />
                    {user &&
                    user.followers !== undefined &&
                    user.followers.length > 0
                      ? user.followers.map(follower => {
                          return (
                            <UserCard key={follower.id} follower={follower} />
                          )
                        })
                      : 'No Followers Found'}
                  </Col>
                </Row>
              </Tab>
              <Tab
                eventKey="following"
                title={`Following (${
                  user &&
                  user.following !== undefined &&
                  user.following.length > 0
                    ? user.following.length
                    : 0
                })`}
              >
                <Row>
                  <Col xs={12} sm={12} md={12} lg={8} xl={8}>
                    <br />
                    {user && user.following !== undefined
                      ? user.following.map(follower => {
                          return (
                            <UserCard key={follower.id} follower={follower} />
                          )
                        })
                      : 'Not Following Anybody'}
                  </Col>
                </Row>
              </Tab>
            </Tabs>
          </Col>
        </Row>
        <Form onSubmit={this.handleSubmit}>
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header>Edit Profile</Modal.Header>

            <Modal.Body>
              <Form.Group>
                <Form.Label>Bio</Form.Label>

                {this.props.users &&
                this.props.users[0] === undefined ? null : (
                  <Form.Control
                    name="bio"
                    type="bio"
                    as="textarea"
                    rows="10"
                    onChange={this.handleChange}
                    defaultValue={this.props.users[0].bio}
                  />
                )}
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="submit" onClick={() => this.props.handleClose}>
                Cancel
              </Button>
              <Button variant="submit" type="submit">
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
    fetchSingleUser: userId => dispatch(fetchSingleUser(userId)),
    addFollower: userId => dispatch(addFollower(userId)),
    removeFollower: userId => dispatch(removeFollower(userId)),
    upvote: resource => dispatch(upvote(resource)),
    downvote: resource => dispatch(downvote(resource)),
    getVote: resource => dispatch(getVote(resource)),
    getResourcesByUser: user => dispatch(getResourcesByUser(user)),
    putProfile: user => dispatch(putProfile(user))
  }
}

const mapState = state => {
  return {
    user: state.currUser,
    trees: state.tree,
    vote: state.vote,
    users: state.users
  }
}

export const ConnectedUserProfile = connect(mapState, mapDispatch)(UserProfile)
