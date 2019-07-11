import React, {Component} from 'react'
import {Form, Row, Col, Button, Card} from 'react-bootstrap'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {
  fetchSearchTrees,
  fetchTrees,
  fetchMyTrees,
  fetchSharedTrees,
  fetchFavoriteTrees
} from '../store/learningTree'
import {ConnectedNewTree} from '.'
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
          <Col xs={2}>
            <React.Fragment>
              <Card>
                <Button
                  variant="light"
                  active={this.state.all}
                  onClick={async () => {
                    await this.props.fetchTrees()
                    this.setState({
                      all: true,
                      my: false,
                      fav: false,
                      shared: false
                    })
                  }}
                >
                  All Trees
                </Button>
              </Card>
              <Card>
                <Button
                  active={this.state.my}
                  onClick={async () => {
                    await this.props.fetchMyTrees(this.props.user.id)
                    this.setState({
                      all: false,
                      my: true,
                      fav: false,
                      shared: false
                    })
                  }}
                  variant="light"
                >
                  My Trees
                </Button>
              </Card>
              <Card>
                <Button
                  active={this.state.fav}
                  variant="light"
                  onClick={async () => {
                    this.setState({
                      all: false,
                      my: false,
                      fav: true,
                      shared: false
                    })
                    await this.props.fetchFavoriteTrees()
                  }}
                >
                  Favorite Trees
                </Button>
              </Card>
              <Card>
                <Button
                  active={this.state.shared}
                  variant="light"
                  onClick={async () => {
                    this.setState({
                      all: false,
                      my: false,
                      fav: false,
                      shared: true
                    })
                    await this.props.fetchSharedTrees(this.props.user.id)
                  }}
                >
                  Trees Shared With Me
                </Button>
              </Card>

              <ConnectedNewTree />
            </React.Fragment>
          </Col>
          <Col xs={10}>
            {this.props.trees !== undefined &&
            this.props.trees.length > 0 &&
            this.props.trees &&
            this.props.trees[0] !== undefined &&
            this.props.trees[0].users !== undefined &&
            this.props.trees[0].users[0] !== undefined
              ? this.props.trees.map(tree => {
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
                  )
                })
              : 'No Results Found '}
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
    fetchFavoriteTrees: () => dispatch(fetchFavoriteTrees())
  }
}

export const ConnectedSearchResult = connect(mapState, mapDispatch)(
  SearchResult
)
