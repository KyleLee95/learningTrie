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
    // await this.props.fetchTrees()
    await this.props.fetchSelectedTree(Number(this.props.match.params.id))
  }

  async componentDidUpdate(prevProps) {
    const prevTree = prevProps.match.params.id
    const curTree = this.props.match.params.id
    if (prevTree !== curTree) {
      await this.props.fetchSelectedTree(Number(this.props.match.params.id))
    }
  }
  render() {
    return (
      <div>
        <Row>
          <Col xs={2}>
            <ConnectedSidebar />
          </Col>
          <Col xs={10}>
            {this.props.tree && this.props.tree.title ? (
              <h1> {this.props.tree.title} </h1>
            ) : (
              <h1 />
            )}

            <ConnectedTreeVisualization />
          </Col>
        </Row>
      </div>
    )
  }
}

const mapState = state => {
  return {
    user: state.user,
    tree: state.tree
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
