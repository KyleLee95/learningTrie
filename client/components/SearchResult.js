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
            {this.props.trees !== undefined &&
            this.props.trees.length > 0 &&
            this.props.trees &&
            this.props.trees[0] !== undefined &&
            this.props.trees[0].users !== undefined &&
            this.props.trees[0].users[0] !== undefined
              ? this.props.trees.map(tree => {
                  return (
                    <Card key={tree.id}>
                      <Card.Body>
                        <Row>
                          <Col xs={4}>
                            {' '}
                            <Card.Title>
                              {' '}
                              <Link
                                style={{
                                  textDecoration: 'none',
                                  color: '#000000'
                                }}
                                to={`/learningTree/${tree.id}`}
                              >
                                {tree.title}{' '}
                              </Link>
                            </Card.Title>
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
                                tree.users.filter(user => {
                                  return tree.ownerId === user.id
                                })[0].firstName
                              }
                            ${
                              tree.users.filter(user => {
                                return tree.ownerId === user.id
                              })[0].lastName
                            }`
                            )}
                          </Col>
                          <Col xs={3}>
                            {' '}
                            <Card.Title>
                              {' '}
                              <Link
                                style={{
                                  textDecoration: 'none',
                                  color: '#000000'
                                }}
                                to={`/learningTree/${tree.id}`}
                              >
                                {tree.description}
                              </Link>
                            </Card.Title>
                          </Col>
                          <Col xs={1}>
                            <Card.Title>
                              {tree.review && tree.reviews.length > 0
                                ? tree.reviews.reduce((acc, review) => {
                                    return acc + review.rating
                                  }, 0) / tree.reviews.length
                                : 0}{' '}
                              / 5
                            </Card.Title>
                          </Col>
                          <Col xs={3}>
                            <Card.Title>
                              {tree.tags.map(tag => {
                                return (
                                  <Button variant="light" key={tag.id}>
                                    <Link
                                      to={`/tag/${tag.id}`}
                                      style={{
                                        textDecoration: 'none',
                                        color: '#000000'
                                      }}
                                    >
                                      {tag.title}{' '}
                                    </Link>
                                  </Button>
                                )
                              })}
                            </Card.Title>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
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
