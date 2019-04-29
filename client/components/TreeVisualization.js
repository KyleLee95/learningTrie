import React, {Component} from 'react'
// import ReactCytoscape from 'react-cytoscape'
import {connect} from 'react-redux'
// import cytoscape from 'cytoscape'
import CytoscapeComponent from 'react-cytoscapejs'
// import cola from 'cytoscape-cola'
import ScrollLock from 'react-scrolllock'

class TreeVisualization extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const elements = [
      {data: {id: 'one', label: 'Root'}, position: {x: 550, y: 350}},
      {data: {id: 'two', label: 'Node '}, position: {x: 500, y: 300}},
      {data: {source: 'one', target: 'two', label: 'Edge from Node1 to Node2'}}
    ]

    return (
      <ScrollLock>
        <CytoscapeComponent
          elements={elements}
          style={{width: '100vw', height: '100vw', backgroundColor: 'fffcfc'}}
          // layout={{name: 'dagre'}}
        />
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
