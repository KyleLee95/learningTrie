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
import axios from 'axios'
import {Button} from 'react-bootstrap'
import {postNode, putNode, getNodes, delNode} from '../store/node'
import {getEdges, putEdge, postEdge, delEdge} from '../store/edge'

const GraphConfig = {
  NodeTypes: {
    empty: {
      // required to show empty nodes
      typeText: '',
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
  constructor(props) {
    super(props)

    this.state = {
      graph: {
        nodes: [],
        edges: []
      },
      selected: {},
      selectedEdge: {}
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
  }

  /* Define custom graph editing methods here */

  async componentDidMount() {
    await this.props.getNodes(Number(this.props.match.params.id))
    await this.props.getEdges(Number(this.props.match.params.id))
  }

  //START NODE HANDLERS

  async createNode() {
    const type = 'empty'
    const viewNode = {
      title: 'A',
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
      title: 'A',
      nodeType: 'Root',
      type,
      x: x,
      y: y,
      treeId: this.props.tree.id
    }
    await this.props.postNode(viewNode)
  }

  async onUpdateNode(node) {
    await this.props.putNode(node)
  }

  onSelectNode(node) {
    this.setState({
      selected: node
    })
  }

  async onDeleteNode(node) {
    this.setState({
      selected: node
    })
    //Need to send the edge id with it so that it deletes the proper edge
    // await this.props.delEdge(this.state.selected)

    await this.props.delNode(this.state.selected)
    await this.props.getEdges(Number(this.props.match.params.id))
  }

  //END NODE HANDLERs

  //START EDGE HANDLERS
  async onSwapEdge(sourceNode, targetNode, edge) {
    edge.target = targetNode.id
    await this.props.putEdge({edge})
  }

  onSelectEdge(selectedEdge) {
    this.setState({
      // selected: selectedEdge,
      selectedEdge: selectedEdge
    })
    console.log('after select edge. this.state.selected', this.state.selected)
    console.log(
      'selected edge. this.state.selectedEdge',
      this.state.selectedEdge
    )
  }

  canDeleteEdge() {
    return true
  }

  async onDeleteEdge(edge) {
    this.setState({
      selectedEdge: edge
    })
    await this.props.delEdge(this.state.selectedEdge)
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
    const graph = this.state.graph
    console.log(viewEdge)
    // Only add the edge when the source node is not the same as the target
    if (viewEdge.source !== viewEdge.target) {
      graph.edges = [...graph.edges, viewEdge]
      this.setState({
        graph,
        selected: viewEdge
      })
    }
    this.props.postEdge(viewEdge)
  }

  //END EDGE HANDLERS

  render() {
    const selected = this.state.selected
    const NodeTypes = GraphConfig.NodeTypes
    const NodeSubtypes = GraphConfig.NodeSubtypes
    const EdgeTypes = GraphConfig.EdgeTypes

    return (
      <ScrollLock>
        <Button onClick={this.createNode}>Add Node</Button>
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
    putEdge: edge => dispatch(putEdge(edge))
  }
}

export const ConnectedTreeVisualization = connect(mapState, mapDispatch)(
  TreeVisualization
)
