/*eslint-disable complexity*/
import React, {Component} from 'react'
import {Tabs, Tab, Row, Col, Button, Card} from 'react-bootstrap'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {
  fetchSearchTrees,
  fetchTrees,
  fetchMyTrees,
  fetchSharedTrees,
  fetchFavoriteTrees
} from '../store/learningTree'
import {addFollower, removeFollower} from '../store/user'
import {ConnectedResourceTagLineItem} from '.'
class SearchResult extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      all: false,
      my: false,
      fav: false,
      shared: false
    }
  }

  componentDidMount() {
    const toSearch = this.props.location.search.slice(
      3,
      this.props.location.search.length
    )
    this.props.fetchSearchTrees(toSearch)
  }

  render() {
    return (
      <div>
        <Row>
          <Col xs={12} sm={12} md={8} lg={8} xl={8} style={{paddingTop: '5vh'}}>
            <Tabs defaultActiveKey="learningTrees">
              <Tab eventKey="learningTrees" title="Learning Trees">
                {this.props.trees !== undefined &&
                this.props.trees.length > 0 &&
                this.props.trees &&
                this.props.trees[0] !== undefined &&
                this.props.trees[0].trees !== undefined
                  ? this.props.trees[0].trees.map(tree => {
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
                  : 'No Results Found '}
              </Tab>
              <Tab eventKey="resources" title="Resources">
                {this.props.trees !== undefined &&
                this.props.trees.length > 0 &&
                this.props.trees &&
                this.props.trees[0] !== undefined &&
                this.props.trees[0].resources !== undefined &&
                this.props.trees[0].resources[0] !== undefined
                  ? this.props.trees[0].resources.map(resource => {
                      return (
                        <ConnectedResourceTagLineItem
                          key={resource.id}
                          resource={resource}
                        />
                      )
                    })
                  : 'No Results Found'}
              </Tab>

              <Tab eventKey="users" title="Users">
                <Row>
                  <Col xs={{span: 7}}>
                    {this.props.trees !== undefined &&
                    this.props.trees.length > 0 &&
                    this.props.trees &&
                    this.props.trees[0] !== undefined &&
                    this.props.trees[0].users !== undefined &&
                    this.props.trees[0].users[0] !== undefined
                      ? this.props.trees[0].users.map(user => {
                          return (
                            <Card key={user.id}>
                              <Card.Body>
                                <Row>
                                  <Col xs={12} sm={12} md={12} lg={12} xl={10}>
                                    <h4>
                                      <Link
                                        to={`/user/${user.id}`}
                                        style={{color: 'black'}}
                                      >
                                        {user.username}
                                      </Link>
                                    </h4>
                                  </Col>

                                  {/* <Col xs={12} sm={12} md={12} lg={12} xl={2}>
                                    {user.followers.includes(
                                      this.props.user.id
                                    ) ? (
                                      <Button sz="sm" onClick={{}}>
                                        Follow
                                      </Button>
                                    ) : (
                                      <Button sz="sm">unfollow</Button>
                                    )}
                                  </Col> */}
                                </Row>
                                <br />
                                <Row>
                                  <Col xs={12}>{user.bio.slice(0, 255)}...</Col>
                                </Row>
                              </Card.Body>
                            </Card>
                          )
                        })
                      : 'No Results Found'}
                  </Col>
                </Row>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </div>
    )
  }
}

const mapState = state => {
  return {
    trees: state.tree,
    user: state.currUser
  }
}

const mapDispatch = dispatch => {
  return {
    fetchSearchTrees: search => dispatch(fetchSearchTrees(search)),
    fetchTrees: () => dispatch(fetchTrees()),
    fetchMyTrees: userId => dispatch(fetchMyTrees(userId)),
    me: () => dispatch(me()),
    fetchSharedTrees: userId => dispatch(fetchSharedTrees(userId)),
    fetchFavoriteTrees: () => dispatch(fetchFavoriteTrees()),
    addFollower: userId => dispatch(addFollower(userId)),
    removeFollower: userId => dispatch(removeFollower(userId))
  }
}

export const ConnectedSearchResult = connect(mapState, mapDispatch)(
  SearchResult
)
