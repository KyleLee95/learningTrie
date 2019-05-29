/* eslint-disable complexity */
import React, {Component} from 'react'
import {
  Row,
  Col,
  Modal,
  Button,
  Form,
  Card,
  CardDeck,
  Tabs,
  Tab
} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {fetchSingleUser, addFollower, removeFollower} from '../store/user'
import {UserCard} from '.'

class UserProfile extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  async componentDidMount() {
    await this.props.fetchSingleUser(Number(this.props.match.params.id))
  }

  render() {
    const user = this.props.users[0]

    return (
      <React.Fragment>
        <Row>
          <Col xs={3}>
            <Card border="light">
              <Card.Img variant="top" src={user ? user.avatar : ''} />
              <Card.Title>
                <Row>
                  <Col xs={{offset: 1, span: 11}}>
                    <h2>
                      {user !== undefined
                        ? `${user.firstName} ${user.lastName}`
                        : ''}
                    </h2>
                  </Col>
                </Row>
                <Row>
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
                          this.props.addFollower(
                            Number(this.props.match.params.id)
                          )
                        }
                      >
                        follow
                      </Button>
                    )
                  ) : (
                    ''
                  )}
                </Row>
              </Card.Title>
              <Card.Body>
                <Row>{user ? user.bio : ''}</Row>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={9}>
            <Tabs defaultActiveKey="overview">
              <Tab eventKey="overview" title="Overview">
                Overview
              </Tab>
              <Tab eventKey="trees" title="Learning Trees">
                <Row>
                  <Col xs={12}>
                    <Card>
                      <Card.Body>
                        <Row>
                          <Col xs={4}>
                            <Card.Title>Title </Card.Title>
                          </Col>
                          <Col xs={1}>
                            <Card.Title>Owner</Card.Title>
                          </Col>
                          <Col xs={3}>
                            {' '}
                            <Card.Title>Description</Card.Title>
                          </Col>
                          <Col xs={1}>
                            <Card.Title>Rating</Card.Title>
                          </Col>
                          <Col xs={3}>
                            <Card.Title>Tags</Card.Title>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                {user
                  ? user.learningTrees.map(tree => {
                      return (
                        <Card key={tree.id}>
                          <Card.Body>
                            <Row>
                              <Col xs={4}>
                                <Link
                                  to={`/learningTree/${tree.id}`}
                                  style={{
                                    textDecoration: 'none',
                                    color: '#000000'
                                  }}
                                >
                                  <Card.Title>{tree.title}</Card.Title>
                                </Link>
                              </Col>
                              <Col xs={1}>
                                {tree.ownerId === this.props.user.id ? (
                                  <Link
                                    style={{
                                      textDecoration: 'none',
                                      color: '#000000'
                                    }}
                                    to={`/learningTree/${tree.id}`}
                                  >
                                    {' '}
                                    <Card.Title>me</Card.Title>
                                  </Link>
                                ) : (
                                  `${
                                    tree.users.filter(profileUser => {
                                      return tree.ownerId === profileUser.id
                                    })[0].firstName
                                  }
                            ${
                              tree.users.filter(profileUser => {
                                return tree.ownerId === profileUser.id
                              })[0].lastName
                            }`
                                )}
                              </Col>
                              <Col xs={3}>
                                {' '}
                                <Link
                                  to={`/learningTree/${tree.id}`}
                                  style={{
                                    textDecoration: 'none',
                                    color: '#000000'
                                  }}
                                >
                                  <Card.Title>{tree.description}</Card.Title>
                                </Link>
                              </Col>
                              <Col xs={1}>
                                <Card.Title>
                                  {' '}
                                  <Link
                                    style={{
                                      textDecoration: 'none',
                                      color: '#000000'
                                    }}
                                    to={`/learningTree/${tree.id}`}
                                  >
                                    <Card.Title>
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
                                        : 0}{' '}
                                      / 5
                                    </Card.Title>
                                  </Link>
                                </Card.Title>
                              </Col>
                              <Col xs={3}>
                                <Card.Title>
                                  {tree.tags !== undefined
                                    ? tree.tags.map(tag => {
                                        return (
                                          <Link
                                            key={tag.title}
                                            to={`/tag/${tag.id}`}
                                          >
                                            <Button size="sm" variant="light">
                                              {tag.title}
                                            </Button>
                                          </Link>
                                        )
                                      })
                                    : ''}
                                </Card.Title>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      )
                    })
                  : 'No Trees Found'}
              </Tab>
              <Tab eventKey="comments" title="Comments">
                {user && user.comments !== undefined
                  ? user.comments.map(comment => {
                      return <Card key={comment.id}>{comment.content}</Card>
                    })
                  : ''}
              </Tab>
              <Tab eventKey="submissions" title="Submitted Resources">
                {user && user.resources !== undefined
                  ? user.resources.map(resource => {
                      return resource.title
                    })
                  : 'No Resources Found'}
              </Tab>
              <Tab eventKey="groups" title="Groups">
                Groups
              </Tab>
              <Tab
                eventKey="followers"
                title={`Followers (${
                  user && user.followers !== undefined
                    ? user.followers.length
                    : 0
                })`}
              >
                <CardDeck>
                  {user && user.followers !== undefined
                    ? user.followers.map(follower => {
                        return (
                          <UserCard key={follower.id} follower={follower} />
                        )
                      })
                    : 'No Followers'}
                </CardDeck>
              </Tab>
              <Tab
                eventKey="following"
                title={`Following (${
                  user && user.following !== undefined
                    ? user.following.length
                    : 0
                })`}
              >
                <CardDeck>
                  {user && user.following !== undefined
                    ? user.following.map(follower => {
                        return (
                          <UserCard key={follower.id} follower={follower} />
                        )
                      })
                    : 'No Followers'}
                </CardDeck>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

const mapDispatch = dispatch => {
  return {
    fetchSingleUser: userId => dispatch(fetchSingleUser(userId)),
    addFollower: userId => dispatch(addFollower(userId)),
    removeFollower: userId => dispatch(removeFollower(userId))
  }
}

const mapState = state => {
  return {
    user: state.currUser,
    trees: state.tree,
    users: state.users
  }
}

export const ConnectedUserProfile = connect(mapState, mapDispatch)(UserProfile)
