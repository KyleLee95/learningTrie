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
import {ConnectedUserProfileOverview} from './UserProfileOverview'

class AdminControl extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  async componentDidMount() {
    await this.props.fetchSingleUser(Number(this.props.match.params.id))
    console.log('A')
  }
  async componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      await this.props.fetchSingleUser(Number(this.props.match.params.id))
    }
  }

  render() {
    return 'HELLO WORLD'
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

export const ConnectedAdminControl = connect(mapState, mapDispatch)(
  AdminControl
)
