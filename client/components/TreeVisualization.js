/* eslint-disable complexity */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import ScrollLock from 'react-scrolllock'
import {
  GraphView, // required
  Edge, // optional
  // type IEdge, // optional
  Node, // optional
  INode,
  // type LayoutEngineType, // required to change the layoutEngineType, otherwise optional
  BwdlTransformer, // optional, Example JSON transformer
  GraphUtils // optional, useful utility functions
} from 'react-digraph'
import {Modal, Button, Form, Row, Col, Tab} from 'react-bootstrap'
import {postNode, putNode, getNodes, delNode} from '../store/node'
import {
  getEdges,
  putEdge,
  postEdge,
  delEdge,
  delSelectedEdge
} from '../store/edge'
import {getResources, postResource} from '../store/resource'
import {ConnectedNewNode, ConnectedResource, ConnectedNewReview} from './index'

const GraphConfig = {
  NodeTypes: {
    empty: {
      // required to show empty nodes
      // typeText: 'Hello',
      shapeId: '#empty', // relates to the type property of a node
      shape: (
        <symbol viewBox="0 0 100 100" id="empty" key="0">
          <circle cx="50" cy="50" r="45" />
        </symbol>
      )
    },
    custom: {
      // required to show empty nodes
      typeText: 'Custom',
      shapeId: '#custom', // relates to the type property of a node
      shape: (
        <symbol viewBox="0 0 50 25" id="custom" key="0">
          <ellipse cx="50" cy="25" rx="50" ry="25" />
        </symbol>
      )
    }
  },
  NodeSubtypes: {},
  EdgeTypes: {
    emptyEdge: {
      // required to show empty edges
      shapeId: '#emptyEdge',
      shape: (
        <symbol viewBox="0 0 50 50" id="emptyEdge" key="0">
          <circle cx="25" cy="25" r="8" fill="currentColor">
            {' '}
          </circle>
        </symbol>
      )
    }
  }
}

const NODE_KEY = 'id' // Allows D3 to correctly update DOM

class TreeVisualization extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      graph: {
        nodes: [],
        edges: []
      },
      selected: {},
      show: false,
      editShow: false,
      resourceShow: false
    }
    //Edge method bindings
    this.onSwapEdge = this.onSwapEdge.bind(this)
    this.onSelectEdge = this.onSelectEdge.bind(this)
    this.onCreateEdge = this.onCreateEdge.bind(this)
    this.canDeleteEdge = this.canDeleteEdge.bind(this)
    this.canCreateEdge = this.canCreateEdge.bind(this)
    this.onDeleteEdge = this.onDeleteEdge.bind(this)
    //Node method bindings
    this.onCreateNode = this.onCreateNode.bind(this)
    this.onUpdateNode = this.onUpdateNode.bind(this)
    this.onSelectNode = this.onSelectNode.bind(this)
    this.onDeleteNode = this.onDeleteNode.bind(this)
    this.createNode = this.createNode.bind(this)
    //Modal method bindings
    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
    //Edit Modal
    this.handleEditSubmit = this.handleEditSubmit.bind(this)
    this.handleEditShow = this.handleEditShow.bind(this)
    this.handleEditClose = this.handleEditClose.bind(this)
    this.handleEditChange = this.handleEditChange.bind(this)
    //Resource Modal
    this.handleResourceShow = this.handleResourceShow.bind(this)
    this.handleResourceClose = this.handleResourceClose.bind(this)
    this.handleResourceSubmit = this.handleResourceSubmit.bind(this)
    this.handleResourceChange = this.handleResourceChange.bind(this)
  }

  //COMPONENT METHODS

  async componentDidMount() {
    await this.props.getNodes(Number(this.props.match.params.id))
    await this.props.getEdges(Number(this.props.match.params.id))
  }

  //END COMPONENT METHODS

  //START NODE HANDLERS
  async createNode(title, description, id, resource) {
    //passed to new Node component
    const type = 'empty'

    const viewNode = {
      id,
      title,
      description,
      nodeType: 'Root',
      type,
      x: 0,
      y: 0,
      treeId: this.props.tree.id,
      resource
    }
    await this.props.postNode(viewNode)
  }

  async onCreateNode(x, y) {
    const type = 'empty'
    // const counter = 1000
    let id = Date.now()
    // if (this.props.nodes.length === 0) {
    //   id = Date.now()
    // } else {
    //   id = Date.now()
    // }
    const viewNode = {
      //prevents the node and edge with the same ID from being selected
      id: id,
      title: 'Double Click To Edit',
      nodeType: 'Root',
      type,
      x: x,
      y: y,
      treeId: this.props.tree.id
    }
    await this.props.postNode(viewNode)
  }

  async onUpdateNode(node) {
    // this.handleShow()
    await this.props.putNode(node)
  }

  //Kinda works. Once a noce is selected you can click it again to trigger the modal.
  //This works for now but we can do better.
  async onSelectNode(node) {
    if (node === null) {
      //'return' prevents null error message when clicking on the grid to deselect a node.
      //by setting selected to an empty object
      this.setState({
        selected: {}
      })
      // return
    } else if (this.state.selected.id === node.id) {
      this.handleShow()
    } else if (this.state.selected.id !== node.id) {
      this.setState({
        selected: node
      })
      await this.props.getResources()
    }
  }

  async onDeleteNode(node) {
    await this.setState({
      selected: {}
    })
    await this.props.delEdge(node)
    await this.props.delNode(node)

    await this.props.getEdges(Number(this.props.match.params.id))
  }

  //END NODE HANDLERs

  //START EDGE HANDLERS
  async onSwapEdge(sourceNode, targetNode, edge) {
    edge.target = targetNode.id
    await this.props.putEdge({edge})
  }

  onSelectEdge(edge) {
    //select edge also selects the node that has the same ID as the edge
    this.setState({
      selected: edge
    })
  }

  canDeleteEdge() {
    return true
  }

  async onDeleteEdge() {
    await this.props.delSelectedEdge(this.state.selected)
    this.setState({
      selected: {}
    })
  }

  canCreateEdge(startNode, endNode) {
    return true
  }

  onCreateEdge(sourceNode, targetNode) {
    const type = 'emptyEdge'
    const viewEdge = {
      type,
      source: sourceNode,
      targetNode: targetNode,
      treeId: this.props.tree.id
    }
    this.props.postEdge(viewEdge)
  }

  //END EDGE HANDLERS

  //MODAL HANDLERS
  handleClose() {
    this.setState({show: false})
  }

  handleShow() {
    this.setState({show: true})
  }

  //EDIT MODAL HANDLERS
  handleEditShow() {
    this.setState({editShow: true})
  }

  handleEditClose() {
    this.setState({editShow: false})
  }

  handleEditChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  async handleEditSubmit() {
    this.setState({editShow: false})
    await this.props.putNode({
      title: this.state.title,
      description: this.state.description,
      id: this.state.selected.id,
      x: this.state.selected.x,
      y: this.state.selected.y
      //prevents the node and edge with the same ID from being selected
    })
  }

  //ADD RESOURCE HANDLERS

  handleResourceShow() {
    this.setState({resourceShow: true})
  }
  handleResourceClose() {
    this.setState({resourceShow: false})
  }
  handleResourceChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  async handleResourceSubmit() {
    await this.props.postResource({
      title: this.state.title,
      description: this.state.description,
      type: this.state.type,
      link: this.state.link,
      nodeId: this.state.selected.id
    })
    this.setState({resourceShow: false})
  }

  render() {
    const selected = this.state.selected
    const NodeTypes = GraphConfig.NodeTypes
    const NodeSubtypes = GraphConfig.NodeSubtypes
    const EdgeTypes = GraphConfig.EdgeTypes
    const options = [
      'Select Type',
      'Paper',
      'Essay',
      'Video',
      'Full Course',
      'Blog',
      'Website',
      'Article',
      'Podcast',
      'Graph',
      'Textbook',
      'Book',
      'Practice Problem Set',
      'Exercise'
    ]
    return (
      <ScrollLock>
        <Row>
          <Col xs={1}>
            {this.props.tree &&
            this.props.tree.userId &&
            this.props.user.id === this.props.tree.userId ? (
              <ConnectedNewNode createNode={this.createNode} />
            ) : (
              <ConnectedNewReview />
            )}
          </Col>
          <Col xs={11}>
            <div id="graph" style={{width: '100%', height: '40vw'}}>
              {this.props.nodes &&
              this.props.nodes[0] !== undefined &&
              this.props.edges &&
              this.props.edges[0] !== undefined ? (
                <GraphView
                  ref="GraphView"
                  nodeKey={NODE_KEY}
                  nodes={this.props.nodes}
                  edges={this.props.edges}
                  selected={selected}
                  nodeTypes={NodeTypes}
                  nodeSubtypes={NodeSubtypes}
                  edgeTypes={EdgeTypes}
                  onSelectNode={this.onSelectNode}
                  onCreateNode={this.onCreateNode}
                  onUpdateNode={this.onUpdateNode}
                  onDeleteNode={this.onDeleteNode}
                  onSelectEdge={this.onSelectEdge}
                  onCreateEdge={this.onCreateEdge}
                  onSwapEdge={this.onSwapEdge}
                  onDeleteEdge={this.onDeleteEdge}
                  canCreateEdge={this.canCreateEdge}
                  renderNode={this.renderNode}
                />
              ) : (
                <GraphView
                  ref="GraphView"
                  nodeKey={NODE_KEY}
                  nodes={this.props.nodes}
                  edges={this.props.edges}
                  selected={selected}
                  nodeTypes={NodeTypes}
                  nodeSubtypes={NodeSubtypes}
                  edgeTypes={EdgeTypes}
                  onSelectNode={this.onSelectNode}
                  onCreateNode={this.onCreateNode}
                  onUpdateNode={this.onUpdateNode}
                  onDeleteNode={this.onDeleteNode}
                  onSelectEdge={this.onSelectEdge}
                  onCreateEdge={this.onCreateEdge}
                  onSwapEdge={this.onSwapEdge}
                  onDeleteEdge={this.onDeleteEdge}
                  canCreateEdge={this.canCreateEdge}
                />
              )}
            </div>

            {/* Node Resource Modal */}
            <Modal show={this.state.show} onHide={this.handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>{this.state.selected.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <strong>Description:</strong>
                {this.props.nodes &&
                this.state.selected.id !== undefined &&
                this.state.selected.description !== undefined
                  ? this.props.nodes.find(node => {
                      return node.id === this.state.selected.id
                    }).description
                  : ''}
              </Modal.Body>
              <Modal.Body>
                <strong>Resources:</strong>
                <ul>
                  {this.props.resources &&
                  this.props.resources[0] &&
                  this.props.resources[0].id !== undefined
                    ? this.props.resources
                        .filter(resource => {
                          return (
                            resource.nodeId === this.state.selected.id ||
                            resource.nodeId === null
                          )
                        })
                        .map(resource => {
                          return (
                            <li key={resource.id}>
                              <Link to={`/resource/${resource.id}`}>
                                {resource.title}
                              </Link>
                            </li>
                          )
                        })
                    : ''}
                </ul>
              </Modal.Body>
              <Modal.Footer>
                {this.props.tree &&
                this.props.tree.userId &&
                this.props.user.id === this.props.tree.userId ? (
                  // || is an approved ID
                  <React.Fragment>
                    <Button variant="submit" onClick={this.handleClose}>
                      Close
                    </Button>

                    <Button variant="submit" onClick={this.handleEditShow}>
                      Edit
                    </Button>
                    <Button variant="submit" onClick={this.handleResourceShow}>
                      Add Resource
                    </Button>
                  </React.Fragment>
                ) : (
                  ''
                )}
              </Modal.Footer>
            </Modal>
            {/* End Resource Modal */}

            {/* Node Edit Modal */}
            <Form>
              <Modal show={this.state.editShow} onHide={this.handleEditClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit Node</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form.Group>
                    {/* Title */}
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      name="title"
                      type="title"
                      placeholder="Enter title"
                      onChange={this.handleEditChange}
                    />
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      name="description"
                      type="description"
                      placeholder="Enter description"
                      onChange={this.handleEditChange}
                    />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="submit" onClick={this.handleEditClose}>
                    Close
                  </Button>
                  <Button variant="submit" onClick={this.handleEditSubmit}>
                    Submit
                  </Button>
                </Modal.Footer>
              </Modal>
            </Form>
            {/* Add Resource Modal  */}
            <Form>
              <Modal
                show={this.state.resourceShow}
                onHide={this.handleResourceClose}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Add Resource</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form.Group>
                    {/* Title */}
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      name="title"
                      type="title"
                      placeholder="Enter title"
                      onChange={this.handleResourceChange}
                    />
                    <Form.Label>Link</Form.Label>
                    <Form.Control
                      name="link"
                      type="link"
                      placeholder="Enter link"
                      onChange={this.handleResourceChange}
                    />
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      name="description"
                      type="description"
                      as="textarea"
                      rows="3"
                      placeholder="Enter description"
                      onChange={this.handleResourceChange}
                    />
                    <Form.Label>Type</Form.Label>
                    <Form.Control
                      as="select"
                      name="type"
                      onChange={this.handleEditChange}
                    >
                      {options.map(option => {
                        return <option key={option}>{option}</option>
                      })}
                    </Form.Control>
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  {this.props.tree &&
                  this.props.tree.userId &&
                  this.props.user.id === this.props.tree.userId ? (
                    <React.Fragment>
                      <Button
                        variant="submit"
                        onClick={this.handleResourceClose}
                      >
                        Close
                      </Button>
                      <Button
                        variant="submit"
                        onClick={this.handleResourceSubmit}
                      >
                        Submit
                      </Button>
                    </React.Fragment>
                  ) : (
                    ''
                  )}
                </Modal.Footer>
              </Modal>
            </Form>
            {/* End Edit Description */}
          </Col>
        </Row>
      </ScrollLock>
    )
  }
}

const mapState = state => {
  return {
    user: state.user,
    tree: state.tree,
    nodes: state.node,
    edges: state.edge,
    resources: state.resource
  }
}

const mapDispatch = dispatch => {
  return {
    postNode: node => dispatch(postNode(node)),
    getNodes: treeId => dispatch(getNodes(treeId)),
    delNode: node => dispatch(delNode(node)),
    putNode: node => dispatch(putNode(node)),
    postEdge: edge => dispatch(postEdge(edge)),
    getEdges: treeId => dispatch(getEdges(treeId)),
    delEdge: edge => dispatch(delEdge(edge)),
    delSelectedEdge: edgeId => dispatch(delSelectedEdge(edgeId)),
    putEdge: edge => dispatch(putEdge(edge)),
    getResources: () => dispatch(getResources()),
    postResource: resource => dispatch(postResource(resource))
  }
}

export const ConnectedTreeVisualization = connect(mapState, mapDispatch)(
  TreeVisualization
)
