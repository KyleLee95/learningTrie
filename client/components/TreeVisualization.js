/* eslint-disable complexity */
/* eslint-disable max-statements */
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
import {Modal, Button, Card, Form, Row, Col, Tabs, Tab} from 'react-bootstrap'
import {postNode, putNode, getNodes, delNode} from '../store/node'
import {
  getEdges,
  putEdge,
  postEdge,
  delEdge,
  delSelectedEdge
} from '../store/edge'
import {postRecommendation, getRecommendations} from '../store/recommendation'
import {getResources, postResource} from '../store/resource'
import {ConnectedNewNode, ConnectedResource, ConnectedNewReview} from './index'

const GraphConfig = {
  NodeTypes: {
    empty: {
      // required to show empty nodes
      // typeText: 'Hello',
      //USING THIS ONE
      shapeId: '#empty', // relates to the type property of a node
      shape: (
        <symbol viewBox="0 0 100 100" id="empty" key="0">
          <circle cx="50" cy="50" r="45" fill="" />
        </symbol>
      )
    },
    custom: {
      // required to show empty nodes
      typeText: 'target',
      shapeId: '#custom', // relates to the type property of a node
      shape: (
        <symbol viewBox="0 0 100 100" id="custom" key="0">
          <circle cx="50" cy="50" r="45" fill="currentColor" />
        </symbol>
      )
    },
    target: {
      // required to show empty nodes
      // typeText: 'Hello',
      //USING THIS ONE
      shapeId: '#empty', // relates to the type property of a node
      shape: (
        <symbol viewBox="0 0 100 100" id="empty" key="0">
          <circle cx="50" cy="50" r="45" fill="currentColor" />
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
        <symbol viewBox="0 0 100 100" id="emptyEdge" key="0">
          <circle cx="50" cy="50" r="49" fill="currentColor">
            {''}
          </circle>
        </symbol>
      )
    },
    labeledEdge: {
      shapeId: '#labeledEdge',
      shape: (
        <symbol
          width="200000000000"
          height="20000000000"
          viewBox="0 0 55 25"
          id="labeledEdge"
          key="0"
        >
          <circle cx="25" cy="25" r="25" fill="#000000" />
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
      resourceShow: false,
      recommendShow: false,
      edgeLabelShow: false,
      target: {},
      shiftDown: false
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
    //Recommend Resource Modal
    this.handleRecommendShow = this.handleRecommendShow.bind(this)
    this.handleRecommendClose = this.handleRecommendClose.bind(this)
    this.handleRecommendSubmit = this.handleRecommendSubmit.bind(this)
    this.handleRecommendChange = this.handleRecommendChange.bind(this)
    //Edge Label Modal
    this.handleEdgeLabelShow = this.handleEdgeLabelShow.bind(this)
    this.handleEdgeLabelClose = this.handleEdgeLabelClose.bind(this)
    this.handleEdgeLabelSubmit = this.handleEdgeLabelSubmit.bind(this)
    this.handleEdgeLabelChange = this.handleEdgeLabelChange.bind(this)
    //key sim
    this.KeySimulation = this.KeySimulation.bind(this)
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
      x: 796.4899291992188,
      y: 407.50421142578125,
      treeId: this.props.trees[0].id,
      resource
    }
    await this.props.postNode(viewNode)
  }

  async onCreateNode(x, y) {
    if (this.props.user.id === this.props.trees[0].ownerId) {
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
        // 796.4899291992188,,
        y: y,
        // 407.50421142578125,
        treeId: this.props.trees[0].id
      }
      await this.props.postNode(viewNode)
    } else {
      return ''
    }
  }

  async onUpdateNode(node) {
    if (this.props.user.id === this.props.trees[0].ownerId) {
      // const id = node.id
      // const selectedX = this.state.selected.x
      // const selectedY = this.state.selected.y
      // console.log(selectedX)
      // console.log(id)
      // if (id === this.state.selected.id) {
      // if (node.x !== selectedX || node.y !== selectedY) {
      await this.props.putNode(node)
      //   }
      // }
    } else {
      return ''
    }
    // if (this.state.selected.id === undefined) {
    //   return ''
    // } else if (
    //   this.state.selected.id !== undefined &&
    //   this.state.target.id === undefined
    // ) {
    //   for (let key in node) {
    //     if (node[key] !== this.state.selected[key]) {
    //       await this.props.putNode(node)
    //     }
    //   }
    // } else if (
    //   this.state.selected.id !== undefined &&
    //   this.state.target.id === undefined
    // ) {
    //   return ''
    // } else if (
    //   this.state.selected.id !== undefined &&
    //   this.state.target.id !== undefined
    // ) {
    //   for (let key in this.state.target) {
    //     if (this.state.target[key] !== this.state.target[key]) {
    //       console.log('A')
    //       await this.props.putNode(this.state.target)
    //     }
    //   }
    // }
  }

  //Kinda works. Once a node is selected you can click it again to trigger the modal.
  //This works for now but we can do better.
  async onSelectNode(node) {
    // if (
    //   this.state.selected.id !== undefined &&
    //   node !== null &&
    //   node.id !== this.state.selected.id
    //selects a target node
    // ) {
    //   this.setState({
    //     target: node
    //   })

    // this.state.target.type = 'custom'

    // console.log('target', this.state.target)
    // console.log('selected', this.state.selected)
    // return ''
    // } else
    if (node !== null && this.state.selected.id === node.id) {
      //shows modal for selected node
      this.handleShow()
    } else if (node !== null && this.state.selected.id !== node.id) {
      //set selected node
      this.setState({
        selected: node
      })
      await this.props.getResources()
      await this.props.getRecommendations()
    } else if (node === null) {
      //deselect node
      //'return' prevents null error message when clicking on the grid to deselect a node.
      //by setting selected to an empty object
      // this.state.target.type = 'empty'
      // console.log(this.state.target.type)
      // console.log('after', this.state.target)
      this.setState({
        selected: {}
        // target: {}
      })
    }
  }

  async onDeleteNode(node) {
    if (this.props.user.id === this.props.trees[0].ownerId) {
      await this.setState({
        selected: {}
      })
      await this.props.delNode(node)
      await this.props.delEdge(node)
    } else {
      return ''
    }
  }

  //END NODE HANDLERs

  //START EDGE HANDLERS
  async onSwapEdge(sourceNode, targetNode, edge) {
    edge.target = targetNode.id
    await this.props.putEdge({edge})
  }

  onSelectEdge(edge) {
    //select edge also selects the node that has the same ID as the edge
    if (edge !== null && this.state.selected.id !== edge.id) {
      //set selected node
      this.setState({
        selected: edge
      })
    } else if (edge !== null && this.state.selected.id === edge.id) {
      //set selected node
      if (this.props.user.id === this.props.trees[0].ownerId) {
        this.handleEdgeLabelShow()
      } else {
        return ''
      }
    }
  }

  canDeleteEdge() {
    if (this.props.user.id === this.props.trees[0].ownerId) {
      return true
    } else {
      return false
    }
  }

  async onDeleteEdge() {
    if (this.props.user.id === this.props.trees[0].ownerId) {
      await this.props.delSelectedEdge(this.state.selected)
      this.setState({
        selected: {}
      })
    } else {
      return false
    }
  }

  canCreateEdge(startNode, endNode) {
    if (this.props.user.id === this.props.trees[0].ownerId) {
      return true
    } else {
      return false
    }
  }

  async onCreateEdge(sourceNode, targetNode) {
    const type = 'emptyEdge'
    const viewEdge = {
      type,
      source: sourceNode,
      targetNode: targetNode,
      treeId: this.props.trees[0].id,
      handleText: this.state.handleText
    }
    await this.props.postEdge(viewEdge)
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

  //RECOMMEND RESOURCE HANDLERS
  handleRecommendShow() {
    this.setState({
      recommendShow: true
    })
  }
  handleRecommendClose() {
    this.setState({
      recommendShow: false
    })
  }
  async handleRecommendSubmit(e) {
    e.preventDefault()
    await this.props.postRecommendation({
      title: this.state.title,
      description: this.state.description,
      type: this.state.type,
      link: this.state.link,
      nodeId: this.state.selected.id
    })
    this.handleRecommendClose()
  }
  handleRecommendChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  //EDGE LABEL MODAL HANDLERS

  handleEdgeLabelShow() {
    this.setState({
      edgeLabelShow: true
    })
  }
  handleEdgeLabelClose() {
    this.setState({
      edgeLabelShow: false
    })
  }
  async handleEdgeLabelSubmit(e) {
    e.preventDefault()
    await this.props.putEdge({
      edge: {
        id: this.state.selected.id,
        target: this.state.selected.target,
        handleText: this.state.handleText
      }
    })
    this.handleEdgeLabelClose()
  }
  handleEdgeLabelChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  // shift key sim

  KeySimulation() {
    var e = document.createEvent('KeyboardEvent')
    if (e.initKeyboardEvent) {
      // Chrome, IE
      e.initKeyboardEvent(
        'keydown',
        true,
        true,
        document.defaultView,
        'Shift',
        0,
        '',
        false,
        ''
      )
    } else {
      // FireFox
      e.initKeyEvent(
        'keyup',
        true,
        true,
        document.defaultView,
        false,
        false,
        false,
        false,
        13,
        0
      )
    }
    document.getElementById('empty').dispatchEvent(e)
    console.log('A')
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

    let isAuthorized = false
    let authId = []
    if (
      this.props.trees !== undefined &&
      this.props.trees[0] !== undefined &&
      this.props.trees[0] !== undefined &&
      this.props.trees[0].users !== undefined &&
      this.props.trees[0].users[0] !== undefined &&
      this.props.trees[0].users[0].id !== undefined
    ) {
      this.props.trees[0].users.forEach(user => {
        return authId.push(user.id)
      })
    }
    if (authId.includes(this.props.user.id) === true) {
      isAuthorized = true
    }
    return (
      <ScrollLock>
        {/* TABS */}
        <Row>
          {this.props.trees[0] &&
          this.props.user &&
          this.props.user.id !== undefined &&
          this.props.trees[0].users !== undefined &&
          this.props.user.id === this.props.trees[0].users[0].id ? (
            <React.Fragment>
              <Col xs={1}>
                <ConnectedNewNode createNode={this.createNode} />
                <br />
                <Button
                  onClick={async () => {
                    const node = {
                      id: this.state.selected.id,
                      title: this.state.selected.title,
                      description: this.state.selected.description,
                      nodeType: this.state.selected.nodeType,
                      type: this.state.selected.type,
                      x: this.state.selected.x,
                      y: this.state.selected.y
                    }
                    this.setState({
                      selected: {}
                    })
                    await this.props.delEdge(node)
                    await this.props.delNode(node)
                  }}
                >
                  Delete Node
                </Button>
                <br />
                <br />
                <Button
                  variant="primary"
                  onClick={this.KeySimulation}
                  //   () => {
                  //   this.setState({
                  //     shiftDown: !this.state.shiftDown
                  //   })
                  //   if (this.state.shiftDown === true) {
                  //     let node = document.getElementById('empty')
                  //     node.dispatchEvent()
                  //     console.log(node)
                  //   }
                  // }
                >
                  Add Edge
                </Button>
                {/* <br />
                <br />
                <Button
                  variant="primary"
                  onClick={() =>
                    this.setState({
                      selected: {},
                      target: {}
                    })
                  }
                >
                  Clear Selected Nodes
                </Button> */}
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
              </Col>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Col xs={12}>
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
              </Col>
            </React.Fragment>
          )}

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
                            </Link>{' '}
                            ({resource.type})
                          </li>
                        )
                      })
                  : ''}
              </ul>
            </Modal.Body>
            <Modal.Body>
              <strong>Resources Recommended by other Users:</strong>
              <ul>
                {this.props.recommendations &&
                this.props.recommendations[0] &&
                this.props.recommendations[0].id !== undefined
                  ? this.props.recommendations
                      .filter(recommendation => {
                        return (
                          recommendation.nodeId === this.state.selected.id ||
                          recommendation.nodeId === null
                        )
                      })
                      .map(recommendation => {
                        return (
                          <li key={recommendation.id}>
                            <Link to={`/recommendation/${recommendation.id}`}>
                              {recommendation.title}
                            </Link>{' '}
                            ({recommendation.type})
                          </li>
                        )
                      })
                  : ''}
              </ul>
            </Modal.Body>
            {/* RENDERS NODE RESOURCE CONTROLS */}
            <Modal.Footer>
              {(this.props.trees[0] &&
                this.props.trees[0].ownerId &&
                this.props.user.id === this.props.trees[0].ownerId) ||
              isAuthorized === true ? (
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
              ) : this.props.user.id !== undefined ? (
                <Button variant="submit" onClick={this.handleRecommendShow}>
                  Recommend Resource
                </Button>
              ) : (
                ''
              )}
              {/* END RENDERS NODE RESOURCE CONTROLS */}
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
                {(this.props.trees[0] &&
                  this.props.trees[0].ownerId &&
                  this.props.user.id === this.props.trees[0].ownerId) ||
                isAuthorized === true ? (
                  <React.Fragment>
                    <Button variant="submit" onClick={this.handleResourceClose}>
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
          {/* End Add Resource Modal */}

          {/* Recommend Resource Modal */}
          <Form>
            <Modal
              show={this.state.recommendShow}
              onHide={this.handleRecommendClose}
            >
              <Modal.Header closeButton>
                <Modal.Title>Recommend Resource</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group>
                  {/* Title */}
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    name="title"
                    type="title"
                    placeholder="Enter title"
                    onChange={this.handleRecommendChange}
                  />
                  <Form.Label>Link</Form.Label>
                  <Form.Control
                    name="link"
                    type="link"
                    placeholder="Enter link"
                    onChange={this.handleRecommendChange}
                  />
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    name="description"
                    type="description"
                    as="textarea"
                    rows="3"
                    placeholder="Enter description"
                    onChange={this.handleRecommendChange}
                  />
                  <Form.Label>Type</Form.Label>
                  <Form.Control
                    as="select"
                    name="type"
                    onChange={this.handleRecommendChange}
                  >
                    {options.map(option => {
                      return <option key={option}>{option}</option>
                    })}
                  </Form.Control>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <React.Fragment>
                  <Button variant="submit" onClick={this.handleRecommendClose}>
                    Close
                  </Button>
                  <Button variant="submit" onClick={this.handleRecommendSubmit}>
                    Submit
                  </Button>
                </React.Fragment>
              </Modal.Footer>
            </Modal>
          </Form>
          {/* End Recommend Resource Modal */}
          {/* Edge Label Modal */}
          <Form>
            <Modal
              show={this.state.edgeLabelShow}
              onHide={this.handleEdgeLabelClose}
            >
              <Modal.Header closeButton>
                <Modal.Title>Associtation Label</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group>
                  {/* Title */}
                  <Form.Label>Associtation Label</Form.Label>
                  <Form.Control
                    name="handleText"
                    type="handleText"
                    placeholder="Enter Assocation Label"
                    onChange={this.handleEdgeLabelChange}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <React.Fragment>
                  <Button variant="submit" onClick={this.handleEdgeLabelClose}>
                    Close
                  </Button>
                  <Button variant="submit" onClick={this.handleEdgeLabelSubmit}>
                    Submit
                  </Button>
                </React.Fragment>
              </Modal.Footer>
            </Modal>
          </Form>
          {/* End Edge Label Modal */}
        </Row>
      </ScrollLock>
    )
  }
}

const mapState = state => {
  return {
    user: state.currUser,
    trees: state.tree,
    nodes: state.node,
    edges: state.edge,
    resources: state.resource,
    recommendations: state.recommendation
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
    postResource: resource => dispatch(postResource(resource)),
    postRecommendation: recommendation =>
      dispatch(postRecommendation(recommendation)),
    getRecommendations: () => dispatch(getRecommendations())
  }
}

export const ConnectedTreeVisualization = connect(mapState, mapDispatch)(
  TreeVisualization
)
