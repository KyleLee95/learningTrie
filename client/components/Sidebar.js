import React, {Component} from 'react'
import {
  Row,
  Col,
  DropdownButton,
  Dropdown,
  SplitButton,
  Modal,
  Button,
  Form
} from 'react-bootstrap'
import {connect} from 'react-redux'
import {fetchTrees} from '../store/learningTree'
// import {Link, Route} from 'react-router-dom'
import {LinkContainer} from 'react-router-bootstrap'
import {ConnectedNewTree} from './NewTree'
class Sidebar extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    return <div />
  }
}

const mapState = state => {
  return {
    user: state.user,
    trees: state.trees
  }
}

const mapDispatch = dispatch => {
  return {
    fetchTrees: () => dispatch(fetchTrees())
  }
}

export const ConnectedSidebar = connect(mapState, mapDispatch)(Sidebar)
