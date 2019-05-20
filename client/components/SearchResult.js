import React, {Component} from 'react'
import {Form, Row, Col, Button, Card} from 'react-bootstrap'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {fetchSearchTrees} from '../store/learningTree'

class SearchResult extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  componentDidMount() {
    console.log(this.props)
    this.props.fetchSearchTrees(`${this.props.location.search}`)
  }

  render() {
    return (
      <div>
        <Row>
          <Col xs={2}>
            <React.Fragment>SOME SIDE BAR HERE</React.Fragment>
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
            {this.props.trees.map(tree => {
              return (
                <Card key={tree.id}>
                  <Card.Body>
                    <Row>
                      <Col xs={4}>
                        <Card.Title>{tree.title} </Card.Title>
                      </Col>
                      <Col xs={1}>
                        <Card.Title>Owner</Card.Title>
                      </Col>
                      <Col xs={3}>
                        {' '}
                        <Card.Title>{tree.description}</Card.Title>
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
              )
            })}
          </Col>
        </Row>
      </div>
    )
  }
}

const mapState = state => {
  return {
    trees: state.tree
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
