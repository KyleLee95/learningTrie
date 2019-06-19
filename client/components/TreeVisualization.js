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
import {
  Modal,
  Button,
  Card,
  Form,
  Row,
  Col,
  OverlayTrigger,
  Popover
} from 'react-bootstrap'
import {postNode, putNode, getNodes, delNode} from '../store/node'
import {
  getEdges,
  putEdge,
  postEdge,
  delEdge,
  delSelectedEdge
} from '../store/edge'
import {postRecommendation, getRecommendations} from '../store/recommendation'
import {
  getResources,
  postResource,
  associateResourceToNode,
  unAssociateResourceFromNode
} from '../store/resource'
import {ConnectedNewNode} from './index'
import {ConnectedSearchPopover} from './SearchPopover'
import axios from 'axios'
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
      typeText: 'node to be associated',
      shapeId: '#custom', // relates to the type property of a node
      shape: (
        <symbol viewBox="0 0 100 100" id="custom" key="0">
          <circle cx="50" cy="50" r="45" fill="red" />
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
let auth = false
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
      searchExistingResource: false,
      //handles results view
      searchExistResourceSearch: false,
      searchExistingResourceResults: [],
      resourceSearchShow: false,
      search: false,
      recommend: false,
      searchResults: [],
      target: {},

      actions: [],
      objects: []
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
    //Resource Search
    this.handleResourceSearchSubmit = this.handleResourceSearchSubmit.bind(this)
    this.handleResourceSearchShow = this.handleResourceSearchShow.bind(this)
    this.handleResourceSearchChange = this.handleResourceSearchChange.bind(this)
    //Existing Resource Search
    this.handleExistingSearchSubmit = this.handleExistingSearchSubmit.bind(this)
    this.handleExistingSearchShow = this.handleExistingSearchShow.bind(this)
    this.handleExistingSearchChange = this.handleExistingSearchChange.bind(this)
    //Undo
    this.onUndo = this.onUndo.bind(this)
  }

  //COMPONENT METHODS

  async componentDidMount() {
    await this.props.getNodes(Number(this.props.match.params.id))
    await this.props.getEdges(Number(this.props.match.params.id))
    await this.props.nodes.forEach(node => {
      if (node.type !== 'empty') {
        this.props.putNode({
          id: node.id,
          type: 'empty'
        })
      }
    })
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.nodes !== undefined &&
      prevProps.nodes.length !== 0 &&
      prevProps.nodes.length + 1 === this.props.nodes.length
    ) {
      this.state.objects.push(this.props.nodes[this.props.nodes.length - 1])
      // console.log('objects', this.state.objects)
      // console.log('actions', this.state.actions)
    } else if (
      prevProps.edges !== undefined &&
      prevProps.edges.length !== 0 &&
      prevProps.edges.length + 1 === this.props.edges.length
    )
      //pushes new node into objects array so that you can undo the action

      this.state.objects.push(this.props.edges[this.props.edges.length - 1])
    // console.log('objects', this.state.objects)
    // console.log('actions', this.state.actions)
  }

  //END COMPONENT METHODS

  //UNDO

  async onUndo() {
    if (this.state.actions[0] === 'deleteNode') {
      await this.props.postNode(this.state.objects[0])
      await this.props.postEdge(this.state.objects[1])
      this.setState({
        objects: this.state.objects.slice(0, 2),
        actions: this.state.actions.slice(0, 2)
      })
    }
    if (this.state.actions[0] === 'postNode') {
      await this.props.delNode(this.state.objects[0])

      this.setState({
        objects: this.state.objects.slice(0, 1),
        actions: this.state.actions.slice(0, 1)
      })
    }
    if (this.state.actions[0] === 'deleteEdge') {
      await this.props.postEdge(this.state.objects[0])
      this.setState({
        objects: this.state.objects.slice(0, 1),
        actions: this.state.actions.slice(0, 1)
      })
    }
    if (this.state.actions[0] === 'postEdge') {
      await this.props.delEdge(this.state.objects[0])
      this.setState({
        objects: this.state.objects.slice(0, 1),
        actions: this.state.actions.slice(0, 1)
      })
    }
  }

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
      this.state.actions.push('postNode')
      await this.props.postNode(viewNode)
    } else {
      return ''
    }
  }

  async onUpdateNode(node) {
    if (this.props.user.id === this.props.trees[0].ownerId) {
      if (node.id === this.state.target.id) {
        await this.props.putNode({
          id: this.state.target.id,
          title: this.state.target.title,
          description: this.state.target.description,
          nodeType: this.state.target.nodeType,
          type: 'custom',
          x: node.x,
          y: node.y
        })
      } else if (node.id === this.state.selected.id) {
        await this.props.putNode({
          id: node.id,
          title: node.title,
          description: node.description,
          nodeType: node.nodeType,
          type: node.type,
          x: node.x,
          y: node.y
        })
      }
    } else {
      return ''
    }
  }

  async onSelectNode(node) {
    if (
      node !== null &&
      this.state.target.id !== undefined &&
      this.state.selected.id !== undefined &&
      node.id !== this.state.target.id &&
      node.id !== this.state.selected.id
    ) {
      await this.props.putNode({
        id: this.state.target.id,
        x: this.state.target.x,
        y: this.state.target.y,
        type: 'empty'
      })
      this.setState({
        target: node
      })
      await this.props.putNode({
        id: this.state.target.id,
        x: this.state.target.x,
        y: this.state.target.y,
        type: 'custom'
      })
      return ''
    } else if (
      this.state.selected.id !== undefined &&
      node !== null &&
      node.id !== this.state.selected.id &&
      this.state.target.id === undefined
      //selects a target node
    ) {
      this.setState({
        target: node
      })
      //updates target node to be red
      await this.props.putNode({
        id: this.state.target.id,
        x: this.state.target.x,
        y: this.state.target.y,
        type: 'custom'
      })
      return ''
    } else if (node !== null && this.state.selected.id === node.id) {
      //shows modal for selected node
      this.handleShow()
    } else if (
      node !== null &&
      this.state.selected.id !== node.id &&
      node.id !== this.state.target.id
    ) {
      //set selected node
      this.setState({
        selected: node
      })
      await this.props.getResources()
      await this.props.getRecommendations()
    } else if (node === null) {
      if (this.state.target.id !== undefined) {
        await this.props.putNode({
          id: this.state.target.id,
          title: this.state.target.title,
          description: this.state.target.description,
          nodeType: this.state.target.nodeType,
          type: 'empty'
          // x: this.state.target.x,
          // y: this.state.target.y
        })
      }

      this.setState({
        selected: {},
        target: {}
      })
    }
  }

  async onDeleteNode(node) {
    if (this.props.user.id === this.props.trees[0].ownerId) {
      this.setState({
        selected: {}
      })
      this.state.actions.push('deleteNode')
      this.state.objects.push(node)
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
      this.state.actions.push('deleteEdge')
      this.state.objects.push(this.state.selected)
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
    this.state.actions.push('postEdge')
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
    const tags = this.state.tags.split(', ')
    await this.props.postResource({
      title: this.state.title,
      description: this.state.description,
      type: this.state.type,
      link: this.state.link,
      nodeId: this.state.selected.id,
      tags: tags
    })

    this.setState({
      resourceShow: false,
      resourceSearchShow: false,
      search: false
    })
    await this.props.getResources()
  }

  //RECOMMEND RESOURCE HANDLERS
  handleRecommendShow() {
    this.setState({
      // recommendShow: true,
      recommend: true,
      resourceSearchShow: true
    })
  }
  handleRecommendClose() {
    this.setState({
      recommendShow: false,
      recommend: false,
      resourceSearchShow: false
    })
  }
  async handleRecommendSubmit(e) {
    const tags = this.state.tags.split(', ')
    e.preventDefault()
    await this.props.postRecommendation({
      title: this.state.title,
      description: this.state.description,
      type: this.state.type,
      link: this.state.link,
      nodeId: this.state.selected.id,
      tags: tags,
      ownerId: this.props.trees[0].ownerId
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

  //RESOURCE SEARCH

  async handleResourceSearchSubmit() {
    const res = await axios.get(`/api/resources/link?link=${this.state.link}`)
    this.setState({
      searchResults: res.data,
      search: true
    })
  }
  handleResourceSearchShow() {
    this.setState({
      resourceSearchShow: !this.state.resourceSearchShow
    })
  }
  handleResourceSearchChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  //EXISTING RESOURCE SEARCH

  async handleExistingSearchSubmit() {
    const res = await axios.get(
      `/api/resources/search?search=${this.state.searchExisting}`
    )
    this.setState({
      searchExistingResourceResults: res.data,
      searchExistingResourceSearch: true
      // searchExisting: true
    })
  }
  handleExistingSearchShow() {
    this.setState({
      searchExistingResource: !this.state.searchExistingResource
    })
  }
  handleExistingSearchChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
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
      auth = true
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
                  onClick={() =>
                    this.onCreateEdge(this.state.selected, this.state.target)
                  }
                >
                  Add Edge
                </Button>
                <br />
                <br />
                <Button
                  variant="primary"
                  onClick={async () => {
                    await this.props.putNode({
                      id: this.state.target.id,
                      type: 'empty'
                    })
                    this.setState({
                      selected: {},
                      target: {}
                    })
                  }}
                >
                  Clear Selected
                </Button>
                <br />
                <br />
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
                      onUndo={this.onUndo}
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
                      onUndo={this.onUndo}
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
                      onUndo={this.onUndo}
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
                      onUndo={this.onUndo}
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
                          resource.nodeId === this.state.selected.id &&
                          resource.nodeId !== null
                        )
                      })
                      .map(resource => {
                        return (
                          <li key={resource.id}>
                            <Link to={`/resource/${resource.id}`}>
                              {resource.title}
                            </Link>{' '}
                            ({resource.type})
                            <Button
                              variant="submit"
                              size="sm"
                              onClick={async () => {
                                await this.props.unAssociateResourceFromNode({
                                  node: this.state.selected,
                                  resource: resource
                                })
                                await this.props.getResources()
                              }}
                            >
                              Remove
                            </Button>
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
              auth === true ? (
                <React.Fragment>
                  <Button variant="submit" onClick={this.handleClose}>
                    Close
                  </Button>

                  <Button variant="submit" onClick={this.handleEditShow}>
                    Edit
                  </Button>
                  <Button
                    variant="submit"
                    onClick={this.handleResourceSearchShow}
                  >
                    Add Resource
                  </Button>
                  <Button
                    variant="submit"
                    onClick={this.handleExistingSearchShow}
                  >
                    Search Resources
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

          {/* Check if Resource Exists */}
          <Form>
            <Modal
              show={this.state.resourceSearchShow}
              onHide={this.handleResourceSearchShow}
            >
              <Modal.Header closeButton>
                <Modal.Title>Search Resource</Modal.Title>
              </Modal.Header>
              <React.Fragment>
                <Modal.Body>
                  {' '}
                  <Form.Group>
                    <Form.Label>
                      <strong>Link</strong>
                    </Form.Label>
                    <Form.Control
                      name="link"
                      type="link"
                      placeholder="Enter link"
                      onChange={this.handleResourceSearchChange}
                    />
                    <Form.Text>
                      Enter the URL for the resource you want to add. If it does
                      not already exist in our database you will have the
                      opportunity to add it.
                    </Form.Text>
                  </Form.Group>
                  {/* <ul> */}
                  {this.state.searchResults.length > 0 ? (
                    this.state.searchResults.map(result => {
                      return (
                        <li key={result.id}>
                          {this.state.selected.id !== result.nodeId ? (
                            <React.Fragment>
                            <Link to={`/resource/${result.id}`}>
                              {result.title}{' '}
                              </Link>
                              <Button
                                size="sm"
                                variant="submit"
                                onClick={this.handleResourceSubmit}
                              >
                                Add to Node
                              </Button>
                              </React.Fragment>
                          ) : (
                            <React.Fragment>
                              <Link to={`/resource/${result.id}`}>
                                {result.title}{' '}
                              </Link>
                              <Button
                                size="sm"
                                variant="submit"
                                onClick={async () => {
                                  await this.props.unAssociateResourceFromNode({
                                    node: this.state.selected,
                                    resource: result
                                  })
                                  await this.props.getResources()
                                }}
                              >
                                Remove from Node
                              </Button>
                            </React.Fragment>
                          )}
                        </li>
                      )
                    })
                  ) : this.state.searchResults.length === 0 &&
                  this.state.search === true ? (
                    <React.Fragment>
                      None found. Would you like to add it to the database?
                      {/* <Form.Group> */}
                      {/* Title */}
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        name="title"
                        type="title"
                        placeholder="Enter title"
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
                      <Form.Label>Tags</Form.Label>
                      <Form.Control
                        name="tags"
                        type="tags"
                        placeholder="Enter tags"
                        onChange={this.handleResourceChange}
                      />
                      {/* </Form.Group> */}
                    </React.Fragment>
                  ) : this.state.searchResults.length === 0 &&
                  this.state.search === true &&
                  this.state.recommend === true ? (
                    <React.Fragment>
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
                    </React.Fragment>
                  ) : null}
                  {/* </ul> */}
                </Modal.Body>
                <Modal.Footer>
                  {this.state.search === true &&
                  this.state.recommend === false &&
                  this.state.searchResults.length === 0 ? (
                    <React.Fragment>
                      <Button
                        variant="submit"
                        onClick={this.handleResourceSearchShow}
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
                  ) : this.state.search === true &&
                  this.state.recommend === true &&
                  this.state.searchResults.length === 0 ? (
                    <React.Fragment>
                      <Button
                        variant="submit"
                        onClick={this.handleResourceSearchShow}
                      >
                        Close
                      </Button>
                      <Button
                        variant="submit"
                        onClick={this.handleRecommendSubmit}
                      >
                        Submit
                      </Button>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Button
                        variant="submit"
                        onClick={this.handleResourceShow}
                      >
                        Close
                      </Button>
                      <Button
                        variant="submit"
                        onClick={this.handleResourceSearchSubmit}
                      >
                        Submit
                      </Button>
                    </React.Fragment>
                  )}
                </Modal.Footer>
              </React.Fragment>
            </Modal>
          </Form>

          {/* Search Existing Resource Modal */}
          <Form>
            <Modal
              show={this.state.searchExistingResource}
              onHide={this.handleExistingSearchShow}
            >
              <Modal.Header closeButton>
                <Modal.Title>Search</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group>
                  {/* Title */}
                  <Form.Label>Search</Form.Label>
                  <Form.Control
                    name="searchExisting"
                    placeholder="Search for a Resource"
                    onChange={this.handleExistingSearchChange}
                  />
                </Form.Group>
              </Modal.Body>
              {this.state.searchExistingResourceResults.length >= 0 ? (
                <Modal.Body>
                  Search Results
                  {this.state.searchExistingResourceResults.length > 0 &&
                  this.state.searchExistingResourceSearch === true ? (
                    this.state.searchExistingResourceResults.map(result => {
                      return (
                        <React.Fragment key={result.link}>
                          <li>
                            <Link to={`/resource/${result.id}`}>
                              {result.title}
                            </Link>

                            <Button
                              variant="submit"
                              sz="sm"
                              onClick={async () => {
                                await this.props.associateResourceToNode({
                                  node: this.state.selected,
                                  resource: result
                                })
                                await this.props.getResources()
                              }}
                            >
                              Add to Node
                            </Button>
                          </li>
                        </React.Fragment>
                      )
                    })
                  ) : this.state.searchExistingResourceSearch === true &&
                  this.state.searchExistingResourceResults.length === 0 ? (
                    <Row>
                      <Col>none found</Col>
                    </Row>
                  ) : null}
                </Modal.Body>
              ) : null}

              <Modal.Footer>
                <React.Fragment>
                  <Button
                    variant="submit"
                    onClick={this.handleExistingSearchShow}
                  >
                    Close
                  </Button>
                  <Button
                    variant="submit"
                    onClick={this.handleExistingSearchSubmit}
                  >
                    Submit
                  </Button>
                </React.Fragment>
              </Modal.Footer>
            </Modal>
          </Form>
          {/* End Edge Label Modal */}

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
    getRecommendations: () => dispatch(getRecommendations()),
    associateResourceToNode: resource =>
      dispatch(associateResourceToNode(resource)),
    unAssociateResourceFromNode: resource =>
      dispatch(unAssociateResourceFromNode(resource))
  }
}

export const ConnectedTreeVisualization = connect(mapState, mapDispatch)(
  TreeVisualization
)
