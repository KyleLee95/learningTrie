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
import {NewTree} from './NewTree'
class Sidebar extends Component {
  constructor(props, context) {
    super(props, context)
  }

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
          <Dropdown.Divider />
          <NewTree />
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
