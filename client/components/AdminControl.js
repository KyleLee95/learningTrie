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
import {
  fetchSingleUser,
  addFollower,
  removeFollower,
  fetchUsers
} from '../store/user'

class AdminControl extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }
  async componentDidMount() {
    await this.props.fetchUsers()
  }
  render() {
    return (
      <React.Fragment>
        {' '}
        {this.props.user.rank !== 'admin' ? (
          'You do not have sufficient privilege'
        ) : (
          <Tabs defaultActiveKey="home">
            <Tab eventKey="home" title="Home">
              Home
            </Tab>
            <Tab eventKey="users" title="users">
              {this.props.users === undefined
                ? null
                : this.props.users.map(user => {
                    return (
                      <li key={user.id}>
                        {' '}
                        id: {user.id} username: {user.username}{' '}
                      </li>
                    )
                  })}
            </Tab>
            <Tab eventKey="resource" title="resource">
              resource{' '}
            </Tab>
            <Tab eventKey="learning trees" title="learning trees">
              learning trees
            </Tab>
          </Tabs>
        )}
      </React.Fragment>
    )
  }
}

const mapDispatch = dispatch => {
  return {
    fetchSingleUser: userId => dispatch(fetchSingleUser(userId)),
    addFollower: userId => dispatch(addFollower(userId)),
    removeFollower: userId => dispatch(removeFollower(userId)),
    fetchUsers: () => dispatch(fetchUsers())
  }
}

const mapState = state => {
  return {
    user: state.currUser,
    trees: state.tree,
    users: state.users
  }
}

export const ConnectedAdminControl = connect(mapState, mapDispatch)(
  AdminControl
)
