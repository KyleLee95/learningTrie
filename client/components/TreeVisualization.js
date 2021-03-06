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
import {
  postRecommendation,
  getRecommendations,
  getRecommendationsByNode
} from '../store/recommendation'
import {
  getResources,
  postResource,
  associateResourceToNode,
  unAssociateResourceFromNode,
  getResourcesByNode
} from '../store/resource'
import {ConnectedNewNode, ConnectedNodeResourceModal} from './index'
import axios from 'axios'
import * as d3 from 'd3'
import {event as currentEvent} from 'd3-selection'

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
      shapeId: '#custom', // relates to the type property of a node
      shape: (
        <symbol viewBox="0 0 100 100" id="custom" key="0">
          <circle cx="50" cy="50" r="45" fill="currentColor" />
        </symbol>
      )
    },
    // target: {
    //   // NOT BEING USED
    //   shapeId: '#empty', // relates to the type property of a node
    //   shape: (
    //     <symbol viewBox="0 0 100 100" id="empty" key="0">
    //       <circle cx="50" cy="50" r="45" fill="currentColor" />
    //     </symbol>
    //   )
    // },
    special: {
      shapeId: '#special',
      shape: (
        <symbol viewBox="-27 0 154 154" id="special" width="154" height="154">
          <rect transform="translate(50) rotate(45)" width="109" height="109" />
        </symbol>
      )
    },
    poly: {
      shapeId: '#poly',
      shape: (
        <symbol viewBox="0 0 88 72" id="poly" width="90" height="88">
          <path d="M 0 36 18 0 70 0 88 36 70 72 18 72Z" />
        </symbol>
      )
    },
    skinny: {
      shapeId: '#skinny',
      shape: (
        <symbol viewBox="0 0 154 54" width="154" height="54" id="skinny">
          <rect x="0" y="0" rx="2" ry="2" width="154" height="54" />
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
      shape: 'empty',
      target: {},
      drawing: false,
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
    this.onUpdateNode = this.onUpdateNode.bind(this)
    this.onSelectNode = this.onSelectNode.bind(this)
    this.onDeleteNode = this.onDeleteNode.bind(this)
    this.onCreateNode = this.onCreateNode.bind(this)
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
    //toggleDraw
    // this.toggleDraw = this.toggleDraw.bind(this)
  }

  //COMPONENT METHODS

  async componentDidMount() {
    await this.props.getNodes(Number(this.props.match.params.id))
    await this.props.getEdges(Number(this.props.match.params.id))
    // await this.props.nodes.forEach(node => {
    //   if (node.type !== 'empty') {
    //     this.props.putNode({
    //       id: node.id,
    //       type: 'empty'
    //     })
    //   }
    // })
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.nodes !== undefined &&
      prevProps.nodes.length !== 0 &&
      prevProps.nodes.length + 1 === this.props.nodes.length
    ) {
      this.state.objects.push(this.props.nodes[this.props.nodes.length - 1])
    } else if (
      prevProps.edges !== undefined &&
      prevProps.edges.length !== 0 &&
      prevProps.edges.length + 1 === this.props.edges.length
    )
      //pushes new node into objects array so that you can undo the action

      this.state.objects.push(this.props.edges[this.props.edges.length - 1])
    if (
      this.props.shape !== prevProps.shape &&
      this.props.shape !== 'Node Shape'
    ) {
      this.setState({
        shape: this.props.shape
      })
    }
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

  async onCreateNode(x, y) {
    if (this.props.canEdit === true) {
      // const type = 'empty'
      // let id = Date.now()
      // const viewNode = {
      //   //prevents the node and edge with the same ID from being selected
      //   id: id,
      //   title: 'Double Click To Edit',
      //   nodeType: 'Root',
      //   type,
      //   x: x,
      //   y: y,
      //   treeId: this.props.trees[0].id
      // }
      await this.props.postNode({
        title: 'Double Click To Edit',
        question: '',
        nodeType: 'Root',
        type: this.state.shape,
        x: x,
        y: y,
        treeId: this.props.trees[0].id
      })
    } else {
      return ''
    }
  }

  async onUpdateNode(node) {
    if (this.props.canEdit === true) {
      // if (node.id === this.state.target.id) {
      //   await this.props.putNode({
      //     id: this.state.target.id,
      //     title: this.state.target.title,
      //     description: this.state.target.description,
      //     nodeType: this.state.target.nodeType,
      //     type: 'custom',
      //     x: node.x,
      //     y: node.y
      //   })
      // } else
      // if (node.id === this.state.selected.id) {
      await this.props.putNode({
        id: node.id,
        title: node.title,
        description: node.description,
        question: node.question,
        nodeType: node.nodeType,
        type: node.type,
        x: node.x,
        y: node.y
      })
      // }
      // } else {
      //   return ''
      // }
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
        y: this.state.target.y
        // type: 'empty'
      })
      this.setState({
        target: node
      })
      await this.props.putNode({
        id: this.state.target.id,
        x: this.state.target.x,
        y: this.state.target.y
        // type: 'custom'
      })
      return ''
      // } else if (
      //   this.state.selected.id !== undefined &&
      //   node !== null &&
      //   node.id !== this.state.selected.id &&
      //   this.state.target.id === undefined
      //   //selects a target node
      // ) {
      //   this.setState({
      //     target: node
      //   })
      //   //updates target node to be red
      //   await this.props.putNode({
      //     id: this.state.target.id,
      //     x: this.state.target.x,
      //     y: this.state.target.y,
      //     type: 'custom'
      //   })
      //   return ''
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
      await this.props.getResourcesByNode(this.state.selected)
      await this.props.getRecommendationsByNode(this.state.selected)
    } else if (node === null) {
      if (this.state.target.id !== undefined) {
        await this.props.putNode({
          id: this.state.target.id,
          title: this.state.target.title,
          description: this.state.target.description,
          question: this.state.target.question,
          nodeType: this.state.target.nodeType
          // type: 'empty'
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
    if (this.props.canEdit === true) {
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
    if (this.props.canEdit === true) {
      return true
    } else {
      return false
    }
  }

  async onDeleteEdge() {
    if (this.props.canEdit === true) {
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
    if (this.props.canEdit === true) {
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
      question: this.state.question,
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
    await this.props.getResourcesByNode(this.state.selected)
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

  // toggleDraw(event) {
  //   d3.event.sourceEvent.shiftKey = true
  //   // const circles = d3.select('svg').selectAll('circle')
  //   // console.log(circles)
  //   // circles[0].setState({
  //   //   drawingEdge: true
  //   // })
  // }
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
    if (
      authId.includes(this.props.user.id) === true ||
      this.props.user.rank === 'admin'
    ) {
      auth = true
    }
    return (
      <ScrollLock>
        {/* TABS */}

        <div id="graph" style={{width: '120vw', height: '90vh'}}>
          {this.props.nodes &&
          this.props.nodes[0] !== undefined &&
          this.props.edges &&
          this.props.edges[0] !== undefined ? (
            <GraphView
              ref="GraphView"
              style={{width: '100vw', height: '200vh'}}
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
              style={{width: '100vw', height: '200vh'}}
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
          {/* </div> */}
          {/* </Col> */}

          {/* ------- */}
          {/* Node Resource Modal */}
          <ConnectedNodeResourceModal
            nodes={this.props.nodes}
            trees={this.props.trees}
            resource={this.props.resources}
            recommendation={this.props.resources}
            show={this.state.show}
            handleClose={this.handleClose}
            selected={this.state.selected}
            target={this.state.target}
            canEdit={this.props.canEdit}
            isMod={this.props.isMod}
          />
          {/* ------- */}
          {/* Edge Label Modal */}
          <Form>
            <Modal
              show={this.state.edgeLabelShow}
              onHide={this.handleEdgeLabelClose}
            >
              <Modal.Header closeButton>
                <Modal.Title>Association Label</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group>
                  {/* Title */}
                  <Form.Label>Association Label</Form.Label>
                  <Form.Control
                    name="handleText"
                    type="handleText"
                    placeholder="Enter Association Label"
                    defaultValue={this.state.selected.handleText}
                    onChange={this.handleEdgeLabelChange}
                  />
                  <Form.Text className="text-muted">
                    Association labels describe how the idea/concept of the
                    source node is related to the idea/concept of the target
                    node
                  </Form.Text>
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
        </div>
        {/* End Edge Label Modal */}
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
    getResources: node => dispatch(getResources(node)),
    postResource: resource => dispatch(postResource(resource)),
    postRecommendation: recommendation =>
      dispatch(postRecommendation(recommendation)),
    getRecommendations: () => dispatch(getRecommendations()),
    associateResourceToNode: resource =>
      dispatch(associateResourceToNode(resource)),
    unAssociateResourceFromNode: resource =>
      dispatch(unAssociateResourceFromNode(resource)),
    getResourcesByNode: node => dispatch(getResourcesByNode(node)),
    getRecommendationsByNode: node => dispatch(getRecommendationsByNode(node))
  }
}

export const ConnectedTreeVisualization = connect(mapState, mapDispatch)(
  TreeVisualization
)
