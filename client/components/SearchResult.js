import React, {Component} from 'react'
import {Form, Button} from 'react-bootstrap'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {fetchSearchTrees} from '../store/learningTree'

class SearchResult extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    return (
      <React.Fragment>
        {this.props.trees.map(tree => {
          return tree.title
        })}
      </React.Fragment>
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
