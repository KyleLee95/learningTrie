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
import {Link, Route} from 'react-router-dom'
import {LinkContainer} from 'react-router-bootstrap'
import {NewTree} from '.'
class Sidebar extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      show: false
    }
    //Bindings
    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  //Handles Modal
  handleClose() {
    this.setState({show: false})
  }

  handleShow() {
    this.setState({show: true})
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
          {/* <LinkContainer to={`/new`}> */}
          <Dropdown.Item onClick={this.handleShow}> New Tree</Dropdown.Item>
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <NewTree />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={this.handleClose}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
          {/* </LinkContainer> */}
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
