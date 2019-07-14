/* eslint-disable complexity */
/* eslint-disable max-statements */
import React, {Component} from 'react'
import {
  Row,
  Col,
  Modal,
  Button,
  Form,
  DropdownButton,
  Dropdown,
  OverlayTrigger,
  Tooltip,
  Popover
} from 'react-bootstrap'
import {connect} from 'react-redux'
import {ConnectedTreeVisualization, ConnectedSidebar} from '.'
import {
  fetchSelectedTree,
  fetchTrees,
  putTree,
  delTree,
  associateUserToTree,
  unassociateUserFromTree,
  addTreeToFavorites,
  removeTreeFromFavorites
} from '../store/learningTree'
import {getTag, postTag, putTag, delTag} from '../store/tag'
import {getReviews} from '../store/review'
import {Link} from 'react-router-dom'
import {me} from '../store/currentUser'
import {ConnectedNewReview} from './NewReview'

let auth = false
let favorite = false
class LearningTree extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      showEdit: false,
      show: false,
      showCollaborator: false,
      shape: 'Node Shape',
      nodeTitle: 'Node Shape'
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleShowEdit = this.handleShowEdit.bind(this)
    this.handleCloseEdit = this.handleCloseEdit.bind(this)
    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleDelete = this.handleDelete.bind(this)

    //Collaborator
    this.handleCollabChange = this.handleCollabChange.bind(this)
    this.handleCollabShow = this.handleCollabShow.bind(this)
    this.handleCollabClose = this.handleCollabClose.bind(this)
    this.handleCollabSubmit = this.handleCollabSubmit.bind(this)
  }

  async componentDidMount() {
    await this.props.fetchSelectedTree(Number(this.props.match.params.id))
    await this.props.getReviews(Number(this.props.match.params.id))
  }

  async componentDidUpdate(prevProps) {
    const prevTree = Number(prevProps.match.params.id)
    const curTree = Number(this.props.match.params.id)
    if (prevTree !== curTree) {
      await this.props.fetchSelectedTree(Number(this.props.match.params.id))
    }
    if (
      prevProps.trees[0] !== undefined &&
      prevProps.trees[0].users !== undefined &&
      this.props.trees[0] !== undefined &&
      this.props.trees[0].users !== undefined &&
      prevProps.trees[0].users.length !== this.props.trees[0].users.length
    ) {
      await this.props.fetchSelectedTree(Number(this.props.match.params.id))
    }
  }

  //BEGIN MODAL METHODS
  //EDIT \/\/\/\/
  async handleSubmit() {
    this.handleCloseEdit()
    let tags = this.props.trees[0].tags
    let privateCheck = false
    if (this.state.private === 'true') {
      privateCheck = true
    }
    if (this.state.tags !== undefined) {
      tags = this.state.tags.split(', ')
    }

    await this.props.putTree({
      title: this.state.title,
      description: this.state.description,
      private: privateCheck,
      tags: tags,
      id: Number(this.props.match.params.id)
    })

    await this.props.me()
    await this.props.fetchSelectedTree(Number(this.props.match.params.id))
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

  //ADD COLLABORATOR MODAL

  handleCollabChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  handleCollabShow() {
    this.setState({
      showCollaborator: true
    })
  }
  handleCollabClose() {
    this.setState({
      showCollaborator: false
    })
  }
  async handleCollabSubmit(e) {
    e.preventDefault()
    await this.props.associateUserToTree({
      learningTreeId: Number(this.props.match.params.id),
      username: this.state.username,
      permission: this.state.permission
    })
  }

  //END COLLABORATOR MODAL

  render() {
    const {description, title} = this.state
    let enabled
    const shapes = [
      {name: 'Circle', type: 'empty'},
      {name: 'Rectangle', type: 'skinny'},
      {name: 'Diamond', type: 'special'},
      {name: 'Hexagon', type: 'poly'}
    ]
    if (description !== undefined && title !== undefined) {
      enabled = description.length > 0 && title.length > 0
    }

    const filteredReviews = this.props.reviews.filter(review => {
      return review.learningTreeId === Number(this.props.match.params.id)
    })
    //Sets rating
    const checkRating =
      filteredReviews.reduce((acc, review) => {
        return acc + review.rating
      }, 0) / filteredReviews.length
    let rating = 0
    if (isNaN(checkRating) === true) {
      rating = 0
    } else {
      rating = checkRating.toString().slice(0, 4)
    }
    //auth check

    let authId = []
    let editorId = []
    let viewerId = []
    let modId = []
    let favoriteId = []

    let canSee = false
    let canEdit = false
    let isMod = false

    let tags = ''

    if (this.props.trees !== undefined && this.props.trees[0] !== undefined) {
      if (this.props.trees[0].isPrivate === true) {
        if (
          this.props.trees[0].viewer !== undefined &&
          this.props.trees[0].viewer[0] !== undefined &&
          this.props.trees[0].viewer[0].id !== undefined
        ) {
          //Viewer check
          this.props.trees[0].viewer.forEach(viewer => {
            return viewerId.push(viewer.id)
          })
          if (viewerId.includes(this.props.user.id) === true) {
            canSee = true
          }
        }

        if (
          this.props.trees[0].editor !== undefined &&
          this.props.trees[0].editor[0] !== undefined &&
          this.props.trees[0].editor[0].id !== undefined
        ) {
          //Editor Check
          this.props.trees[0].editor.forEach(editor => {
            return editorId.push(editor.id)
          })
          if (editorId.includes(this.props.user.id) === true) {
            canEdit = true
            canSee = true
          }
        }

        if (
          this.props.trees[0].moderator !== undefined &&
          this.props.trees[0].moderator[0] !== undefined &&
          this.props.trees[0].moderator[0].id !== undefined
        ) {
          //Moderator Check
          this.props.trees[0].moderator.forEach(moderator => {
            return modId.push(moderator.id)
          })
        }
        if (modId.includes(this.props.user.id) === true) {
          isMod = true
          canEdit = true
          canSee = true
        }
      } else {
        if (
          this.props.trees &&
          this.props.trees[0] !== undefined &&
          this.props.trees[0].isPrivate === false
        ) {
          canSee = true
          if (
            this.props.trees[0].editor !== undefined &&
            this.props.trees[0].editor[0] !== undefined &&
            this.props.trees[0].editor[0].id !== undefined
          ) {
            //Editor Check
            this.props.trees[0].editor.forEach(editor => {
              return editorId.push(editor.id)
            })
            if (editorId.includes(this.props.user.id) === true) {
              canEdit = true
              canSee = true
            }
          }

          if (
            this.props.trees[0].moderator !== undefined &&
            this.props.trees[0].moderator[0] !== undefined &&
            this.props.trees[0].moderator[0].id !== undefined
          ) {
            //Moderator Check
            this.props.trees[0].moderator.forEach(moderator => {
              return modId.push(moderator.id)
            })
          }
          if (modId.includes(this.props.user.id) === true) {
            isMod = true
            canEdit = true
            canSee = true
          }
        }
      }
    }
    //favorite check
    if (
      this.props.trees !== undefined &&
      this.props.trees[0] !== undefined &&
      this.props.trees[0] !== undefined &&
      this.props.trees[0].favorite !== undefined &&
      this.props.trees[0].favorite[0] !== undefined &&
      this.props.trees[0].favorite[0].id !== undefined
    ) {
      this.props.trees[0].favorite.forEach(user => {
        return favoriteId.push(user.id)
      })
    }
    if (favoriteId.includes(this.props.user.id) === true) {
      favorite = true
    }
    if (favoriteId.length === 0) {
      favorite = false
    }

    //Tags
    if (
      this.props.trees !== undefined &&
      this.props.trees[0] !== undefined &&
      this.props.trees[0].tags !== undefined
    ) {
      this.props.trees[0].tags.forEach(tag => {
        tags += `${tag.title}, `
      })
      tags = tags.slice(0, tags.length - 2)
    }

    if (
      (this.props.user && this.props.user.rank === 'admin') ||
      (this.props.trees !== undefined &&
        this.props.trees[0] !== undefined &&
        this.props.user.id === this.props.trees[0].ownerId)
    ) {
      canSee = true
      canEdit = true
      isMod = true
    }

    return canSee === true ? (
      <React.Fragment>
        <Row>
          <Col xs={12}>
            <Row>
              <Col xs={12}>
                <Row className="justify-content-space-between">
                  {this.props.trees && this.props.trees[0] ? (
                    <h3>{this.props.trees[0].title} </h3>
                  ) : null}
                  {this.props.trees !== undefined &&
                  this.props.trees[0] &&
                  this.props.trees[0] &&
                  this.props.trees[0].id !== undefined &&
                  this.props.user !== undefined &&
                  this.props.user.id !== undefined &&
                  this.props.trees[0].users !== undefined &&
                  this.props.trees[0].users[0] !== undefined &&
                  isMod === false ? (
                    <React.Fragment>
                      <Button variant="submit">
                        <Link
                          to={`/learningTree/${this.props.trees[0].id}/review`}
                          style={{textDecoration: 'none', color: 'black'}}
                        >
                          Rating: {`${rating}/ 5 All Reviews`}
                        </Link>
                      </Button>
                      <ConnectedNewReview />
                      <Button onClick={this.handleCollabShow} variant="submit">
                        Collaborators
                      </Button>
                      {favorite === false ? (
                        <Button
                          variant="submit"
                          onClick={async () => {
                            await this.props.addTreeToFavorites({
                              learningTreeId: this.props.trees[0].id
                            })
                            favorite = true
                          }}
                        >
                          Add to Favorites
                        </Button>
                      ) : (
                        <Button
                          variant="submit"
                          onClick={async () => {
                            await this.props.removeTreeFromFavorites({
                              learningTreeId: this.props.trees[0].id
                            })
                            favorite = false
                          }}
                        >
                          Remove from Favorites
                        </Button>
                      )}
                    </React.Fragment>
                  ) : this.props.trees[0] !== undefined && isMod === true ? (
                    <React.Fragment>
                      <Button variant="submit" onClick={this.handleShowEdit}>
                        Edit
                      </Button>
                      <br />
                      {isMod === true ? (
                        <Button variant="submit" onClick={this.handleShow}>
                          Delete
                        </Button>
                      ) : null}

                      <Button variant="submit">
                        <Link
                          to={`/learningTree/${this.props.trees[0].id}/review`}
                          style={{textDecoration: 'none', color: 'black'}}
                        >
                          Rating: {rating}/ 5 All Reviews
                        </Link>
                      </Button>
                      <Button onClick={this.handleCollabShow} variant="submit">
                        Collaborators
                      </Button>
                      {favorite === false ? (
                        <Button
                          variant="submit"
                          onClick={async () => {
                            await this.props.addTreeToFavorites({
                              learningTreeId: this.props.trees[0].id
                            })
                            favorite = true
                          }}
                        >
                          Add to Favorites
                        </Button>
                      ) : (
                        <Button
                          variant="submit"
                          onClick={async () => {
                            await this.props.removeTreeFromFavorites({
                              learningTreeId: this.props.trees[0].id
                            })
                            favorite = false
                          }}
                        >
                          Remove from Favorites
                        </Button>
                      )}
                      {/* pass the node shape down as props to tree viz so that it creates the correct shape */}
                      <DropdownButton
                        variant="submit"
                        title={`${this.state.nodeTitle}`}
                      >
                        {shapes.map(shape => {
                          return (
                            <Dropdown.Item
                              key={shape.name}
                              onClick={() => {
                                this.setState({
                                  shape: shape.type,
                                  nodeTitle: shape.name
                                })
                              }}
                            >
                              {shape.name}
                            </Dropdown.Item>
                          )
                        })}
                      </DropdownButton>
                      <OverlayTrigger
                        placement="left"
                        trigger="click"
                        overlay={
                          <Popover id="tooltip-left" title="Controls">
                            <ul>
                              <li>To create a node: shift + click </li>
                              <li>
                                {' '}
                                To create an association edge: shift + click (on
                                source node) + drag (to target node)
                              </li>
                              <li>
                                To delete a node/edge: select the node and then
                                press backspace/delete on your keyboard
                              </li>
                            </ul>
                          </Popover>
                        }
                      >
                        <Button variant="submit">Controls Info</Button>
                      </OverlayTrigger>
                    </React.Fragment>
                  ) : null}
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <ConnectedTreeVisualization
                  match={this.props.match}
                  shape={this.state.shape}
                  canEdit={canEdit}
                  canSee={canSee}
                  isMod={isMod}
                />
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Add User as Collaborator Modal */}

        <Form>
          <Modal
            show={this.state.showCollaborator}
            onHide={this.handleCollabClose}
          >
            <Modal.Header closeButton>
              <Modal.Title>Add Collaborator</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Modal.Body>
                {isMod === true || this.props.user.rank === 'admin' ? (
                  <React.Fragment>
                    <Form.Label>Enter Username</Form.Label>
                    <Form.Group controlId="username">
                      <Form.Control
                        name="username"
                        type="username"
                        onChange={this.handleCollabChange}
                        placeholder="Enter username to them as a collaborator"
                      />
                    </Form.Group>
                    <Form.Label>Set Permissions</Form.Label>
                    <Form.Group controlId="permission">
                      <Form.Control
                        as="select"
                        name="permission"
                        type="permission"
                        onChange={this.handleCollabChange}
                      >
                        <option>Select</option>
                        <option>Viewer</option>
                        <option>Editor</option>
                        <option>Moderator</option>
                      </Form.Control>
                      <Form.Text className="text-muted">
                        Viewer allows other users to see the tree if it is set
                        to private
                      </Form.Text>
                    </Form.Group>
                  </React.Fragment>
                ) : null}
                <hr />
                Owner
                <br />
                {this.props.trees[0] &&
                this.props.trees[0] &&
                this.props.trees[0].users &&
                this.props.trees[0].users[0].id !== undefined
                  ? this.props.trees[0].users
                      .filter(owner => {
                        return owner.id === this.props.trees[0].ownerId
                      })
                      .map(user => {
                        return (
                          <li key={user.id} style={{listStyleType: 'none'}}>
                            <Link to={`/user/${user.id}`}>{user.username}</Link>
                          </li>
                        )
                      })
                  : null}
                <hr />
                View (And Recommend) Only
                <br />
                {this.props.trees[0] &&
                this.props.trees[0] &&
                this.props.trees[0].viewer &&
                this.props.trees[0].viewer[0] !== undefined
                  ? this.props.trees[0].viewer.map(user => {
                      return (
                        <li key={user.id} style={{listStyleType: 'none'}}>
                          <Link to={`/user/${user.id}`}>{user.username}</Link>
                          {isMod === true ? (
                            <Button
                              sz="sm"
                              variant="submit"
                              onClick={async () => {
                                await this.props.unassociateUserFromTree({
                                  learningTreeId: Number(
                                    this.props.match.params.id
                                  ),
                                  username: user.username
                                })
                              }}
                            >
                              Remove
                            </Button>
                          ) : null}
                        </li>
                      )
                    })
                  : null}
                <hr />
                Can Edit
                <br />
                {this.props.trees[0] &&
                this.props.trees[0] &&
                this.props.trees[0].editor &&
                this.props.trees[0].editor[0] !== undefined
                  ? this.props.trees[0].editor.map(user => {
                      return (
                        <li key={user.id} style={{listStyleType: 'none'}}>
                          <Link to={`/user/${user.id}`}>{user.username}</Link>
                          {isMod === true ? (
                            <Button
                              sz="sm"
                              variant="submit"
                              onClick={async () => {
                                await this.props.unassociateUserFromTree({
                                  learningTreeId: Number(
                                    this.props.match.params.id
                                  ),
                                  username: user.username
                                })
                              }}
                            >
                              Remove
                            </Button>
                          ) : null}
                        </li>
                      )
                    })
                  : null}
                <hr />
                Moderators
                <br />
                {this.props.trees[0] &&
                this.props.trees[0] &&
                this.props.trees[0].moderator &&
                this.props.trees[0].moderator[0] !== undefined
                  ? this.props.trees[0].moderator.map(user => {
                      return (
                        <li key={user.id} style={{listStyleType: 'none'}}>
                          <Link to={`/user/${user.id}`}>{user.username}</Link>
                          {isMod === true ? (
                            <Button
                              sz="sm"
                              variant="submit"
                              onClick={async () => {
                                await this.props.unassociateUserFromTree({
                                  learningTreeId: Number(
                                    this.props.match.params.id
                                  ),
                                  username: user.username
                                })
                              }}
                            >
                              Remove
                            </Button>
                          ) : null}
                        </li>
                      )
                    })
                  : null}
              </Modal.Body>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="submit" onClick={this.handleCollabClose}>
                Close
              </Button>
              {isMod === true || this.props.user.rank === 'admin' ? (
                <Button variant="submit" onClick={this.handleCollabSubmit}>
                  Submit
                </Button>
              ) : null}
            </Modal.Footer>
          </Modal>
        </Form>

        {/* Edit Form Modal */}
        {this.props.trees &&
          this.props.trees[0] && (
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
                        defaultValue={this.props.trees[0].title}
                        onChange={this.handleChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="description">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        name="description"
                        as="textarea"
                        defaultValue={this.props.trees[0].description}
                        rows="3"
                        onChange={this.handleChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="private">
                      <Form.Label>Private</Form.Label>
                      <Form.Control
                        name="private"
                        as="select"
                        onChange={this.handleChange}
                        defaultValue={this.props.trees[0].isPrivate.toString()}
                      >
                        <option>Select</option>
                        <option value={true}>True</option>
                        <option value={false}>False</option>
                      </Form.Control>
                      <Form.Text className="text-muted">
                        True: Only you and approved users can see this Tree.
                        <br />
                        False (default): Anyone can see this Tree. Approved
                        users may make edits
                      </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="tags">
                      <Form.Label>Tags</Form.Label>
                      <Form.Control
                        name="tags"
                        defaultValue={tags}
                        onChange={this.handleChange}
                      />
                      <Form.Text className="text-muted">
                        Separate with a comma and a space. Ex. 'Machine
                        Learning, TensorFlow, JavaScript
                      </Form.Text>
                    </Form.Group>
                  </Modal.Body>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.handleCloseEdit}>
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    // disabled={!enabled}
                    onClick={this.handleSubmit}
                  >
                    Submit
                  </Button>
                </Modal.Footer>
              </Modal>
            </Form>
          )}

        {/* Delete Check Modal */}
        {this.props.trees ? (
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Delete Tree</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Modal.Body>
                <Form.Text>
                  Are you sure you want to delete{' '}
                  {this.props.trees[0] ? this.props.trees[0].title : ''}?
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
        ) : (
          ''
        )}
      </React.Fragment>
    ) : (
      'You are not authorized to see this tree'
    )
  }
}

const mapState = state => {
  return {
    user: state.currUser,
    trees: state.tree,
    reviews: state.review
  }
}

const mapDispatch = dispatch => {
  return {
    fetchSelectedTree: treeId => dispatch(fetchSelectedTree(treeId)),
    fetchTrees: () => dispatch(fetchTrees()),
    putTree: data => dispatch(putTree(data)),
    delTree: treeId => dispatch(delTree(treeId)),
    me: () => dispatch(me()),
    getReviews: treeId => dispatch(getReviews(treeId)),
    putTag: tag => dispatch(putTag(tag)),
    postTag: tag => dispatch(postTag(tag)),
    associateUserToTree: user => dispatch(associateUserToTree(user)),
    unassociateUserFromTree: user => dispatch(unassociateUserFromTree(user)),
    removeTreeFromFavorites: treeId =>
      dispatch(removeTreeFromFavorites(treeId)),
    addTreeToFavorites: treeId => dispatch(addTreeToFavorites(treeId))
  }
}

export const ConnectedLearningTree = connect(mapState, mapDispatch)(
  LearningTree
)
