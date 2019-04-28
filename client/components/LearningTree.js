import React, {Component} from 'react'
import {Row, Col} from 'react-bootstrap'
import {connect} from 'react-redux'
import {ConnectedTreeVisualization, ConnectedSidebar} from '.'
import {fetchSelectedTree, fetchTrees} from '../store/learningTree'

class LearningTree extends Component {
  constructor(props) {
    super(props)
  }

  async componentDidMount() {
    await this.props.fetchTrees()
    await this.props.fetchSelectedTree(Number(this.props.match.params.id))
  }

  async componentDidUpdate(prevProps) {
    const prevTree = prevProps.match.params.id
    const curTree = this.props.match.params.id
    if (prevTree !== curTree) {
      await this.props.fetchSelectedTree(Number(this.props.match.params.id))
      // await this.props.fetchTrees()
    }
  }
  render() {
    return (
      <div>
        <Row>
          <Col xs={2}>
            <ConnectedSidebar trees={this.props.trees} />
          </Col>
          <Col xs={10}>
            {this.props.selectedTree && this.props.selectedTree.title ? (
              <h1> {this.props.selectedTree.title} </h1>
            ) : (
              <h1 />
            )}

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
    fetchSelectedTree: treeId => dispatch(fetchSelectedTree(treeId)),
    fetchTrees: () => dispatch(fetchTrees())
  }
}

export const ConnectedLearningTree = connect(mapState, mapDispatch)(
  LearningTree
)
