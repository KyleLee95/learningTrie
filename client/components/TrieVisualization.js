import React, {Component} from 'react'
import ReactCytoscape from 'react-cytoscape'
import cytoscape from 'cytoscape'
import CytoscapeComponent from 'react-cytoscapejs'
import cola from 'cytoscape-cola'
cytoscape.use(cola)
export class TrieVisualization extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const elements = [
      {data: {id: 'one', label: 'Root'}, position: {x: 0, y: 0}},
      {data: {id: 'two', label: 'Node '}, position: {x: 100, y: 0}},
      {data: {source: 'one', target: 'two', label: 'Edge from Node1 to Node2'}}
    ]

    return (
      <CytoscapeComponent
        elements={elements}
        style={{width: '100vw', height: '100vw'}}
        layout={{name: 'dagre'}}
      />
    )
  }
}
