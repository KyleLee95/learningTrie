import React, {Component} from 'react'
// import ReactCytoscape from 'react-cytoscape'
import {connect} from 'react-redux'
import cytoscape from 'cytoscape'
import CytoscapeComponent from 'react-cytoscapejs'
import cola from 'cytoscape-cola'
import ScrollLock from 'react-scrolllock'
import {Graph} from './Graph'

class TreeVisualization extends Component {
  constructor(props) {
    super(props)

    // this.addNode = this.addNode.bind(this)
  }

  // addNode() {
  //   cy.add({

  //   })
  // }

  render() {
    const elements = [
      {data: {id: 'one', label: 'Root'}, position: {x: 550, y: 350}},
      {data: {id: 'two', label: 'Node '}, position: {x: 500, y: 300}},
      {data: {source: 'one', target: 'two', label: 'Edge from Node1 to Node2'}}
    ]

    return (
      <ScrollLock>
        {/* <CytoscapeComponent
          elements={elements}
          style={{width: '68vw', height: '100vw', backgroundColor: '#607393'}}
          // layout={{name: 'dagre'}}
        /> */}
        <Graph style={{width: '68vw', height: '40vw'}} />
      </ScrollLock>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

export const ConnectedTreeVisualization = connect(mapStateToProps, null)(
  TreeVisualization
)
