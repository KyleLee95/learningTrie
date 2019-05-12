import React, {Component} from 'react'
// import ReactCytoscape from 'react-cytoscape'
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
import {Modal, Button, Popover, Overlay, OverlayTrigger} from 'react-bootstrap'
import {postNode, putNode, getNodes, delNode} from '../store/node'
import {
  getEdges,
  putEdge,
  postEdge,
  delEdge,
  delSelectedEdge
} from '../store/edge'
import {ConnectedNewNode} from './NewNode'

const GraphConfig = {
  NodeTypes: {
    empty: {
      // required to show empty nodes
      typeText: 'Hello',
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
      show: false
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
  }

  //COMPONENT METHODS

  async componentDidMount() {
    await this.props.getNodes(Number(this.props.match.params.id))
    await this.props.getEdges(Number(this.props.match.params.id))
  }

  //END COMPONENT METHODS

  //START NODE HANDLERS

  async createNode(title, description, id) {
    const type = 'empty'
    const viewNode = {
      id,
      title,
      description,
      nodeType: 'Root',
      type,
      x: 0,
      y: 0,
      treeId: this.props.tree.id
    }
    await this.props.postNode(viewNode)
  }

  async onCreateNode(x, y) {
    const type = 'empty'
    const viewNode = {
      id: this.props.nodes.length + 100000,
      title: '',
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
  onSelectNode(node) {
    if (node === null) {
      //'return' prevents null error message when clicking on the grid to deselect a node.
      //by setting selected to an empty object
      this.setState({
        selected: {}
      })
      // return
    } else if (this.state.selected.id === node.id) {
      console.log('B')
      this.handleShow()
    } else if (this.state.selected.id !== node.id) {
      this.setState({
        selected: node
      })
    }
  }

  async onDeleteNode(node) {
    this.setState({
      selected: node
    })

    await this.props.delEdge(this.state.selected)
    await this.props.delNode(this.state.selected)
    await this.setState({
      selected: null
    })

    await this.props.getEdges(Number(this.props.match.params.id))
  }

  //END NODE HANDLERs

  //START EDGE HANDLERS
  async onSwapEdge(sourceNode, targetNode, edge) {
    edge.target = targetNode.id
    await this.props.putEdge({edge})
  }

  onSelectEdge(edge) {
    console.log(edge)
    this.setState({
      selected: null
    })
    //select edge also selects the node that has the same ID as the edge
    this.setState({
      selected: edge
    })
    console.log('selected', this.state.selected)
  }

  canDeleteEdge() {
    return true
  }

  async onDeleteEdge(edge) {
    this.setState({
      selected: edge
    })
    await this.props.delSelectedEdge(this.state.selected)
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
  //

  render() {
    const selected = this.state.selected
    const NodeTypes = GraphConfig.NodeTypes
    const NodeSubtypes = GraphConfig.NodeSubtypes
    const EdgeTypes = GraphConfig.EdgeTypes

    return (
      <ScrollLock>
        <ConnectedNewNode
          // handleShow={this.handleShow}
          // handleClose={this.handleClose}
          createNode={this.createNode}
        />
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
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            TODO: * Eager Load Resources so that they show up here. Possibly
            Catagorize them? * Add an edit/add resources Button *add Tags for
            resources
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
      </ScrollLock>
    )
  }
}

const mapState = state => {
  return {
    user: state.user,
    tree: state.tree,
    //TODO:
    //Figure out how to load nodes and edges. should I eager load them
    //with the tree or load them on their own?
    //Breaks when you use state.node because it doesn't get edges for some reason.
    nodes: state.node,
    edges: state.edge
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
    putEdge: edge => dispatch(putEdge(edge))
  }
}

export const ConnectedTreeVisualization = connect(mapState, mapDispatch)(
  TreeVisualization
)
