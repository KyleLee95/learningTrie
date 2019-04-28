import React, {Component} from 'react'
import {Row, Col, DropdownButton, Dropdown, SplitButton} from 'react-bootstrap'
import {connect} from 'react-redux'
import {fetchTrees} from '../store/learningTree'
import {Link, Route} from 'react-router-dom'
import {LinkContainer} from 'react-router-bootstrap'
class Sidebar extends Component {
  async componentDidMount() {
    // await this.props.fetchTrees()
    console.log(this.props)
  }

  async componentDidUpdate() {}
  render() {
    return (
      <div>
        <SplitButton
          id="dropdown-split-variants-Primary"
          title="Learning Trees"
        >
          {this.props.user.learningTrees && this.props.user.learningTrees.length
            ? this.props.user.learningTrees
                .filter(tree => tree.userId === this.props.user.id)
                .map(tree => {
                  return (
                    <LinkContainer
                      key={tree.id}
                      to={`/learningTree/${tree.id}`}
                    >
                      <Dropdown.Item>{tree.title}</Dropdown.Item>
                    </LinkContainer>
                  )
                })
            : ''}
        </SplitButton>
      </div>
    )
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
