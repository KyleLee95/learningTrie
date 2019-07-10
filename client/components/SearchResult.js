import React, {Component} from 'react'
import {Form, Row, Col, Button, Card} from 'react-bootstrap'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {fetchSearchTrees} from '../store/learningTree'
import {ConnectedNewTree} from '.'
class SearchResult extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
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
                <Button variant="submit">All Trees</Button>
              </Card>
              <Card>
                <Button
                  onClick={() => this.props.fetchMyTrees(this.props.user.id)}
                  variant="submit"
                >
                  My Trees
                </Button>
              </Card>
              <Card>
                <Button variant="submit">Favorite Trees</Button>
              </Card>
              <Card>
                <Button variant="submit">Trees Shared With Me</Button>
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
                                <React.Fragment >
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
    fetchSearchTrees: search => dispatch(fetchSearchTrees(search))
  }
}

export const ConnectedSearchResult = connect(mapState, mapDispatch)(
  SearchResult
)
