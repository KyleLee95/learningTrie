import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Row, Col, Button, Card} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {fetchTrees} from '../store/learningTree'
/**
 * COMPONENT
 */
class Blog extends Component {
  async componentDidMount() {
    await this.props.fetchTrees()
  }
  render() {
    return <div>HELLO WORLD, BLOG</div>
  }
}

const mapState = state => {
  return {
    user: state.user,
    trees: state.tree
  }
}
const mapDispatch = dispatch => {
  return {
    fetchTrees: () => dispatch(fetchTrees())
  }
}

export const ConnectedBlog = connect(mapState, mapDispatch)(Blog)
