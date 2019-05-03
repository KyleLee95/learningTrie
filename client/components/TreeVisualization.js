import React, {Component} from 'react'
// import ReactCytoscape from 'react-cytoscape'
import {connect} from 'react-redux'

import ScrollLock from 'react-scrolllock'

import {
  GraphView, // required
  Edge, // optional
  // type IEdge, // optional
  Node, // optional
  // type INode, // optional
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
      selected: {}
    }
    this.onUpdateNode = this.onUpdateNode.bind(this)
    this.onSelectNode = this.onSelectNode.bind(this)
    this.onDeleteNode = this.onDeleteNode.bind(this)
    this.onSwapEdge = this.onSwapEdge.bind(this)
    this.onCreateEdge = this.onCreateEdge.bind(this)
    this.onCreateNode = this.onCreateNode.bind(this)
    this.canCreateEdge = this.canCreateEdge.bind(this)
  }

  /* Define custom graph editing methods here */

  async componentDidMount() {
    await this.props.getNodes()
    await this.props.getEdges()
  }

  //START NODE HANDLERS
  async onUpdateNode(node) {
    await this.props.putNode(node)
    // console.log(y)
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
    console.log('delete node', this.state.selected)
    await this.props.delNode(this.state.selected)
  }

  //END NODE HANDLERs

  //START EDGE HANDLERS
  async onSwapEdge(sourceNode, targetNode, edge) {
    edge.target = targetNode.id
    await axios.put('/api/edges/', {edge})
  }

  onSelectEdge(selectedEdge) {
    console.log('selected edge', selectedEdge)
  }

  canCreateEdge(startNode, endNode) {
    console.log(startNode, 'start node')
    console.log(endNode, 'endNode')
  }
  onCreateEdge(sourceNode, targetNode) {
    console.log('Source', sourceNode)
    console.log('Source', targetNode)
  }

  //END EDGE HANDLERS

  async onCreateNode(x, y) {
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
  render() {
    const selected = this.state.selected
    const NodeTypes = GraphConfig.NodeTypes
    const NodeSubtypes = GraphConfig.NodeSubtypes
    const EdgeTypes = GraphConfig.EdgeTypes

    return (
      <ScrollLock>
        <Button onClick={this.onCreateNode}>Add Node</Button>
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
            ''
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
    getNodes: () => dispatch(getNodes()),
    delNode: node => dispatch(delNode(node)),
    putNode: node => dispatch(putNode(node)),
    postEdge: edge => dispatch(postEdge(edge)),
    getEdges: () => dispatch(getEdges())
  }
}

export const ConnectedTreeVisualization = connect(mapState, mapDispatch)(
  TreeVisualization
)
