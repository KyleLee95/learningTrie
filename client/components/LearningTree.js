import React, {Component} from 'react'
import {Row, Col, Dropdown} from 'react-bootstrap'
import {connect} from 'react-redux'
import {
  ConnectedTreeVisualization,
  ConnectedSidebar,
  ConnectedEditTree
} from '.'
import {
  fetchSelectedTree,
  fetchTrees,
  putTree,
  delTree
} from '../store/learningTree'

class LearningTree extends Component {
  constructor(props) {
    super(props)
  }

  async componentDidMount() {
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
    const id = Number(this.props.match.params.id)
    return (
      <div>
        <Row>
          <Col xs={2}>
            <ConnectedSidebar />
          </Col>
          <Col xs={10}>
            {this.props.tree && this.props.tree.title ? (
              <div>
                <h1>
                  {this.props.tree.title}{' '}
                  <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                      Options
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => this.props.delTree(id)}>
                        {' '}
                        Delete Tree
                      </Dropdown.Item>
                      <ConnectedEditTree />
                    </Dropdown.Menu>
                  </Dropdown>
                </h1>
              </div>
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
    fetchTrees: () => dispatch(fetchTrees()),
    putTree: data => dispatch(putTree(data)),
    delTree: treeId => dispatch(delTree(treeId))
  }
}

export const ConnectedLearningTree = connect(mapState, mapDispatch)(
  LearningTree
)
