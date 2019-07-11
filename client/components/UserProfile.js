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
import moment from 'moment'
import {ConnectedResourceTagLineItem} from './ResourceTagLineItem'

class UserProfile extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  async componentDidMount() {
    await this.props.fetchSingleUser(Number(this.props.match.params.id))
  }
  async componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      await this.props.fetchSingleUser(Number(this.props.match.params.id))
    }
  }

  render() {
    const user = this.props.users[0]

    return (
      <React.Fragment>
        <Row>
          <Col xs={2}>
            <Card border="light">
              <Card.Img variant="top" src={user ? user.avatar : ''} />
              <Card.Title>
                <Row>
                  <Col xs={{offset: 1, span: 11}}>
                    <h2>{user !== undefined ? `${user.username} ` : null} </h2>
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
          <Col xs={10}>
            <Tabs defaultActiveKey="trees">
              <Tab eventKey="trees" title="Learning Trees">
                <br />
                <br />
                {user && user.learningTrees
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
                                        {tree.users.filter(user => {
                                          return user.id === tree.ownerId
                                        })[0] !== undefined
                                          ? tree.users.filter(user => {
                                              return user.id === tree.ownerId
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
                      )
                    })
                  : 'No Trees Found'}
              </Tab>
              <Tab eventKey="comments" title="Comments">
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
                                <Link to={`/resource/${comment.resource.id}`}>
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
                    : 'No Followers Found'}
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
                    : 'Not Following Anybody'}
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
