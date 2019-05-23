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
    console.log(user)
    return (
      <React.Fragment>
        <Card>{user !== undefined ? user.firstName : ''}</Card>
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
    user: state.user,
    trees: state.tree,
    users: state.users
  }
}

export const ConnectedUserProfile = connect(mapState, mapDispatch)(UserProfile)
