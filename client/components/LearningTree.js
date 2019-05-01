import React, {Component} from 'react'
import {Row, Col, Modal, Button, Form} from 'react-bootstrap'
import {connect} from 'react-redux'
import {ConnectedTreeVisualization, ConnectedSidebar} from '.'
import {
  fetchSelectedTree,
  fetchTrees,
  putTree,
  delTree
} from '../store/learningTree'
import {me} from '../store/user'

//TODO:
//Forms are only prefilled the first time you edit. After that the forms empty.

class LearningTree extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      showEdit: false,
      show: false,
      title: this.props.tree.title,
      description: this.props.tree.description
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleShowEdit = this.handleShowEdit.bind(this)
    this.handleCloseEdit = this.handleCloseEdit.bind(this)
    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  async componentDidMount() {
    await this.props.fetchSelectedTree(Number(this.props.match.params.id))
    this.setState({
      title: this.props.tree.title,
      description: this.props.tree.description
    })
  }

  async componentDidUpdate(prevProps) {
    const prevTree = Number(prevProps.match.params.id)
    const curTree = Number(this.props.match.params.id)
    if (prevTree !== curTree) {
      await this.props.fetchSelectedTree(Number(this.props.match.params.id))
    }
  }

  //BEGIN MODAL METHODS
  async handleSubmit() {
    this.handleCloseEdit()
    await this.props.putTree({
      title: this.state.title,
      description: this.state.description,
      id: Number(this.props.match.params.id)
    })
    await this.props.me()
  }

  handleCloseEdit() {
    this.setState({
      title: '',
      description: '',
      showEdit: false
    })
  }

  async handleDelete() {
    this.handleClose()
    await this.props.delTree(Number(this.props.match.params.id))
    await this.props.me()
  }

  handleShowEdit() {
    this.setState({showEdit: true})
  }

  handleClose() {
    this.setState({
      show: false
    })
  }

  handleShow() {
    this.setState({show: true})
  }

  //END MODAL METHODS

  //FORM METHODS
  handleChange(event) {
    this.setState({[event.target.name]: event.target.value})
  }
  //END FORM METHODS

  render() {
    const {description, title} = this.state
    let enabled
    if (description !== undefined && title !== undefined) {
      enabled = description.length > 0 && title.length > 0
    }

    return (
      <React.Fragment>
        <Row>
          <Col xs={2}>
            {this.props.tree && this.props.tree.title ? (
              <div>
                <h1>
                  {this.props.tree.title}
                  <Button onClick={this.handleShowEdit}>Edit</Button>
                  <Button onClick={this.handleShow}>Delete</Button>
                </h1>
              </div>
            ) : (
              <h1 />
            )}
          </Col>
          <Col xs={10}>
            <ConnectedTreeVisualization />
          </Col>
        </Row>

        {/* Edit Form Modal */}
        <Form>
          <Modal show={this.state.showEdit} onHide={this.handleCloseEdit}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Learning Tree</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Modal.Body>
                <Form.Group controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    name="title"
                    type="title"
                    value={this.state.title || ''}
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    name="description"
                    as="textarea"
                    value={this.state.description || ''}
                    rows="3"
                    onChange={this.handleChange}
                  />
                </Form.Group>
              </Modal.Body>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleCloseEdit}>
                Close
              </Button>
              <Button
                variant="primary"
                disabled={!enabled}
                onClick={this.handleSubmit}
              >
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
        </Form>

        {/* Delete Check Modal */}
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Tree</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Modal.Body>
              <Form.Text>
                Are you sure you want to delete {this.props.tree.title}?
              </Form.Text>
            </Modal.Body>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              No
            </Button>
            <Button variant="primary" onClick={this.handleDelete}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    )
  }
}

const mapState = state => {
  return {
    user: state.user,
    tree: state.tree
  }
}

const mapDispatch = dispatch => {
  return {
    fetchSelectedTree: treeId => dispatch(fetchSelectedTree(treeId)),
    fetchTrees: () => dispatch(fetchTrees()),
    putTree: data => dispatch(putTree(data)),
    delTree: treeId => dispatch(delTree(treeId)),
    me: () => dispatch(me())
  }
}

export const ConnectedLearningTree = connect(mapState, mapDispatch)(
  LearningTree
)
