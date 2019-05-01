import React, {Component} from 'react'
// import ReactCytoscape from 'react-cytoscape'
import {connect} from 'react-redux'
import cytoscape from 'cytoscape'
import CytoscapeComponent from 'react-cytoscapejs'
import cola from 'cytoscape-cola'
import ScrollLock from 'react-scrolllock'
// import {Graph} from './Graph'
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
        // [
        //   {
        //     id: 1,
        //     title: 'Node A',
        //     x: 258.3976135253906,
        //     y: 331.9783248901367,
        //     type: 'empty'
        //   },
        //   {
        //     id: 2,
        //     title: 'Node B',
        //     x: 593.9393920898438,
        //     y: 260.6060791015625,
        //     type: 'empty'
        //   },
        //   {
        //     id: 3,
        //     title: 'Node C',
        //     x: 237.5757598876953,
        //     y: 61.81818389892578,
        //     type: 'custom'
        //   },
        //   {
        //     id: 4,
        //     title: 'Node C',
        //     x: 600.5757598876953,
        //     y: 600.81818389892578,
        //     type: 'custom'
        //   }
        // ]
        edges: []
        // [
        //   {
        //     source: 1,
        //     target: 4,
        //     type: 'emptyEdge'
        //   },
        //   {
        //     source: 2,
        //     target: 4,
        //     type: 'emptyEdge'
        //   }
        // ]
      },
      selected: {}
    }
    this.onUpdateNode = this.onUpdateNode.bind(this)
    this.onSelectNode = this.onSelectNode.bind(this)
    this.onSwapEdge = this.onSwapEdge.bind(this)
    this.onCreateEdge = this.onCreateEdge.bind(this)
    this.onCreateNode = this.onCreateNode.bind(this)
  }

  /* Define custom graph editing methods here */

  async componentDidMount() {
    await this.props.getNodes()
  }

  onUpdateNode(node) {
    console.log('update node', node)
    // console.log(y)
  }
  onSelectNode(node) {
    console.log('SELECT NODE', node)
  }
  async onSwapEdge(sourceNode, targetNode, edge) {
    //find targetNode
    // console.log('before', this.state.graphs.edges[0])
    // console.log('source', sourceNode)
    // console.log('target', targetNode)
    // console.log('edge', edge)
    edge.target = targetNode.id
    await axios.put('/api/edges/', {edge})
    //TODO:
    //Create API route to post edge information to database
    //Write axios update call
    // console.log('after source', sourceNode)
    // console.log('after target', targetNode)
    // console.log('after edge', edge)
    // console.log('after', this.state.graphs.edges[0])
  }

  onSelectEdge(selectedEdge) {
    console.log('selected edge', selectedEdge)
  }

  onCreateEdge(sourceNode, targetNode) {
    console.log('Source', sourceNode)
    console.log('Source', targetNode)
  }

  async onCreateNode(x, y) {
    //TODO:
    //Create axios POST request for new node
    //Set to state?
    //PROBLEM:
    //How do I initialize the id?
    //Keep count
    //Node ID by date.now()

    const graph = this.state.graph

    // This is just an example - any sort of logic
    // could be used here to determine node type
    // There is also support for subtypes. (see 'sample' above)
    // The subtype geometry will underlay the 'type' geometry for a node
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

    graph.nodes = [...graph.nodes, viewNode]
    this.setState({graph})
  }
  render() {
    console.log(this.props)
    const nodes = this.state.graph.nodes
    const edges = this.state.graph.edges
    const selected = this.state.selected
    console.log(this.props)
    const NodeTypes = GraphConfig.NodeTypes
    const NodeSubtypes = GraphConfig.NodeSubtypes
    const EdgeTypes = GraphConfig.EdgeTypes

    return (
      <ScrollLock>
        <Button onClick={this.onCreateNode}>Hello World</Button>
        {/* <CytoscapeComponent
          elements={elements}
          style={{width: '68vw', height: '100vw', backgroundColor: '#607393'}}
          // layout={{name: 'dagre'}}
        /> */}
        {/* <Graph style={{width: '68vw', height: '40vw'}} /> */}
        <div id="graph" style={{width: '100%', height: '40vw'}}>
          {this.props.nodes && this.props.nodes[0] !== undefined ? (
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
              nodes={[]}
              edges={[]}
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
    nodes: state.node
    // edges: state.edge
  }
}

const mapDispatch = dispatch => {
  return {
    postNode: node => dispatch(postNode(node)),
    getNodes: () => dispatch(getNodes())
  }
}

export const ConnectedTreeVisualization = connect(mapState, mapDispatch)(
  TreeVisualization
)
