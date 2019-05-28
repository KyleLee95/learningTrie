import React, {Component} from 'react'
import {Row, Col, Modal, Button, Form, Card} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {fetchSingleUser} from '../store/user'

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
        <Card border="light">
          <Card.Title>
            {user !== undefined ? `${user.firstName} ${user.lastName}` : ''}
          </Card.Title>
        </Card>
        <Row>
          <Col xs={12}>
            <Card>
              <Row>
                <Col xs={4}>
                  <Card.Title>Title</Card.Title>
                </Col>

                <Col xs={5}>
                  {' '}
                  <Card.Title>Description</Card.Title>
                </Col>
                <Col xs={3}>
                  <Card.Title>Tags</Card.Title>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        {user
          ? user.learningTrees.map(tree => {
              return (
                <Card key={tree.id}>
                  <Row>
                    <Col xs={4}>
                      <Card.Title>{tree.title}</Card.Title>
                    </Col>
                    <Col xs={5}>
                      {' '}
                      <Card.Title>{tree.description}</Card.Title>
                    </Col>
                    <Col xs={3}>
                      <Card.Title>
                        {tree.tags !== undefined
                          ? tree.tags.map(tag => {
                              return (
                                <Link key={tag.title} to={`/tag/${tag.id}`}>
                                  <Button variant="light">{tag.title}</Button>
                                </Link>
                              )
                            })
                          : ''}
                      </Card.Title>
                    </Col>
                  </Row>
                </Card>
              )
            })
          : 'No Trees Found'}
      </React.Fragment>
    )
  }
}

const mapDispatch = dispatch => {
  return {
    fetchSingleUser: userId => dispatch(fetchSingleUser(userId))
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
