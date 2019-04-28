import React, {Component} from 'react'
import {Row, Col} from 'react-bootstrap'
import {connect} from 'react-redux'
import {ConnectedTreeVisualization} from '.'
import {fetchSelectedTree} from '../store/learningTree'

class LearningTree extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.fetchSelectedTree(Number(this.props.match.params.id))
  }

  componentDidUpdate(prevProps) {
    const prevTree = prevProps.match.params.id
    const curTree = this.props.match.params.id
    if (prevTree !== curTree) {
      this.props.fetchSelectedTree(Number(this.props.match.params.id))
    }
  }
  render() {
    return (
      <div>
        <Row>
          <Col xs={12}>
            {this.props.selectedTree && this.props.selectedTree.title ? (
              <h1> {this.props.selectedTree.title} </h1>
            ) : (
              <h1 />
            )}
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <ConnectedTreeVisualization tree={this.props.trees} />
          </Col>
        </Row>
      </div>
    )
  }
}

const mapState = state => {
  return {
    user: state.user,
    trees: state.trees,
    selectedTree: state.trees.selectedTree
  }
}

const mapDispatch = dispatch => {
  return {
    fetchSelectedTree: treeId => dispatch(fetchSelectedTree(treeId))
  }
}

export const ConnectedLearningTree = connect(mapState, mapDispatch)(
  LearningTree
)
