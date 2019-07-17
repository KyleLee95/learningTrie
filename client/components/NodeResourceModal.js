/* eslint-disable complexity */
/* eslint-disable max-statements */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
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
import {
  Modal,
  Button,
  Card,
  Form,
  Row,
  Col,
  OverlayTrigger,
  Popover
} from 'react-bootstrap'
import {postNode, putNode, getNodes, delNode} from '../store/node'
import {
  getEdges,
  putEdge,
  postEdge,
  delEdge,
  delSelectedEdge
} from '../store/edge'
import {
  postRecommendation,
  getRecommendations,
  convertRecommendationToResource
} from '../store/recommendation'
import {
  getResources,
  postResource,
  associateResourceToNode,
  unAssociateResourceFromNode,
  getResourcesByNode
} from '../store/resource'
import {recommendMessage} from '../store/message'
import {upvote, downvote, getVote} from '../store/vote'
import axios from 'axios'
import {ConnectedNodeResourceModalLineItem} from './index'
const GraphConfig = {
  NodeTypes: {
    empty: {
      // required to show empty nodes
      // typeText: 'Hello',
      //USING THIS ONE
      shapeId: '#empty', // relates to the type property of a node
      shape: (
        <symbol viewBox="0 0 100 100" id="empty" key="0">
          <circle cx="50" cy="50" r="45" fill="" />
        </symbol>
      )
    },
    custom: {
      // required to show empty nodes
      typeText: 'node to be associated',
      shapeId: '#custom', // relates to the type property of a node
      shape: (
        <symbol viewBox="0 0 100 100" id="custom" key="0">
          <circle cx="50" cy="50" r="45" fill="red" />
        </symbol>
      )
    },
    target: {
      // required to show empty nodes
      // typeText: 'Hello',
      //USING THIS ONE
      shapeId: '#empty', // relates to the type property of a node
      shape: (
        <symbol viewBox="0 0 100 100" id="empty" key="0">
          <circle cx="50" cy="50" r="45" fill="currentColor" />
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
        <symbol viewBox="0 0 100 100" id="emptyEdge" key="0">
          <circle cx="50" cy="50" r="49" fill="currentColor">
            {''}
          </circle>
        </symbol>
      )
    },
    labeledEdge: {
      shapeId: '#labeledEdge',
      shape: (
        <symbol
          width="200000000000"
          height="20000000000"
          viewBox="0 0 55 25"
          id="labeledEdge"
          key="0"
        >
          <circle cx="25" cy="25" r="25" fill="#000000" />
        </symbol>
      )
    }
  }
}

const NODE_KEY = 'id' // Allows D3 to correctly update DOM

class NodeResourceModal extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      selected: {},
      show: false,
      editShow: false,
      resourceShow: false,
      recommendShow: false,
      edgeLabelShow: false,
      searchExistingResource: false,
      //handles results view
      searchExistResourceSearch: false,
      searchExistingResourceResults: [],
      resourceSearchShow: false,
      search: false,
      recommend: false,
      searchResults: [],
      target: {}
    }

    //Modal method bindings
    // this.handleShow = this.handleShow.bind(this)
    // this.handleClose = this.handleClose.bind(this)
    //Edit Modal
    this.handleEditSubmit = this.handleEditSubmit.bind(this)
    this.handleEditShow = this.handleEditShow.bind(this)
    this.handleEditClose = this.handleEditClose.bind(this)
    this.handleEditChange = this.handleEditChange.bind(this)
    //Resource Modal
    this.handleResourceShow = this.handleResourceShow.bind(this)
    this.handleResourceClose = this.handleResourceClose.bind(this)
    this.handleResourceSubmit = this.handleResourceSubmit.bind(this)
    this.handleResourceChange = this.handleResourceChange.bind(this)
    //Recommend Resource Modal
    this.handleRecommendShow = this.handleRecommendShow.bind(this)
    this.handleRecommendClose = this.handleRecommendClose.bind(this)
    this.handleRecommendSubmit = this.handleRecommendSubmit.bind(this)
    this.handleRecommendChange = this.handleRecommendChange.bind(this)
    //Edge Label Modal
    this.handleEdgeLabelShow = this.handleEdgeLabelShow.bind(this)
    this.handleEdgeLabelClose = this.handleEdgeLabelClose.bind(this)
    this.handleEdgeLabelSubmit = this.handleEdgeLabelSubmit.bind(this)
    this.handleEdgeLabelChange = this.handleEdgeLabelChange.bind(this)
    //Resource Search
    this.handleResourceSearchSubmit = this.handleResourceSearchSubmit.bind(this)
    this.handleResourceSearchShow = this.handleResourceSearchShow.bind(this)
    this.handleResourceSearchChange = this.handleResourceSearchChange.bind(this)
    //Existing Resource Search
    this.handleExistingSearchSubmit = this.handleExistingSearchSubmit.bind(this)
    this.handleExistingSearchShow = this.handleExistingSearchShow.bind(this)
    this.handleExistingSearchChange = this.handleExistingSearchChange.bind(this)
  }

  //COMPONENT METHODS

  //EDIT MODAL HANDLERS
  handleEditShow() {
    this.setState({editShow: true})
  }

  handleEditClose() {
    this.setState({editShow: false})
  }

  handleEditChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  async handleEditSubmit() {
    this.setState({editShow: false})
    await this.props.putNode({
      title: this.state.title,
      description: this.state.description,
      question: this.state.question,
      id: this.props.selected.id,
      x: this.props.selected.x,
      y: this.props.selected.y
      //prevents the node and edge with the same ID from being selected
    })
  }

  //ADD RESOURCE HANDLERS

  handleResourceShow() {
    this.setState({resourceShow: true})
  }
  handleResourceClose() {
    this.setState({resourceShow: false})
  }
  handleResourceChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  async handleResourceSubmit() {
    const tags = this.state.tags.split(', ')
    await this.props.postResource({
      title: this.state.title,
      description: this.state.description,
      type: this.state.type,
      link: this.state.link,
      nodeId: this.props.selected.id,
      tags: tags
    })

    this.setState({
      resourceShow: false,
      resourceSearchShow: false,
      search: false
    })
    await this.props.getResourcesByNode(this.props.selected)
  }

  //RECOMMEND RESOURCE HANDLERS
  handleRecommendShow() {
    this.setState({
      // recommendShow: true,
      recommend: true,
      resourceSearchShow: true
    })
  }
  handleRecommendClose() {
    this.setState({
      recommendShow: false,
      recommend: false,
      resourceSearchShow: false
    })
  }
  async handleRecommendSubmit(e) {
    const tags = this.state.tags.split(', ')
    e.preventDefault()
    await this.props.postRecommendation({
      nodeTitle: this.props.selected.title,
      title: this.state.title,
      description: this.state.description,
      type: this.state.type,
      link: this.state.link,
      nodeId: this.props.selected.id,
      tags: tags,
      ownerId: this.props.trees[0].ownerId
    })

    await this.props.recommendMessage({
      description: this.state.description,
      type: this.state.type,
      link: this.state.link,
      nodeId: this.props.selected.id,
      title: this.state.title,
      treeName: this.props.trees[0].title,
      nodeTitle: this.props.selected.title,
      ownerId: this.props.trees[0].ownerId,
      isSender: true,
      tree: this.props.trees[0].title,
      treeId: this.props.trees[0].id
    })
    this.handleRecommendClose()
  }
  handleRecommendChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  //EDGE LABEL MODAL HANDLERS

  handleEdgeLabelShow() {
    this.setState({
      edgeLabelShow: true
    })
  }
  handleEdgeLabelClose() {
    this.setState({
      edgeLabelShow: false
    })
  }
  async handleEdgeLabelSubmit(e) {
    e.preventDefault()
    await this.props.putEdge({
      edge: {
        id: this.props.selected.id,
        target: this.props.selected.target,
        handleText: this.state.handleText
      }
    })
    this.handleEdgeLabelClose()
  }
  handleEdgeLabelChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  //RESOURCE SEARCH

  async handleResourceSearchSubmit() {
    const res = await axios.get(`/api/resources/link?link=${this.state.link}`)
    this.setState({
      searchResults: res.data,
      search: true
    })
  }
  handleResourceSearchShow() {
    this.setState({
      resourceSearchShow: !this.state.resourceSearchShow
    })
  }
  handleResourceSearchChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  //EXISTING RESOURCE SEARCH

  async handleExistingSearchSubmit() {
    const res = await axios.get(
      `/api/resources/search?search=${this.state.searchExisting}`
    )
    this.setState({
      searchExistingResourceResults: res.data,
      searchExistingResourceSearch: true
      // searchExisting: true
    })
  }
  handleExistingSearchShow() {
    this.setState({
      searchExistingResource: !this.state.searchExistingResource
    })
  }
  handleExistingSearchChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  toggleDraw(event) {
    d3
      .select('svg')
      .selectAll('circle')
      .dispatchEvent(d3.event.sourceEvent.shiftKey)
    this.setState({
      drawing: true
    })
  }
  render() {
    const selected = this.props.selected
    const NodeTypes = GraphConfig.NodeTypes
    const NodeSubtypes = GraphConfig.NodeSubtypes
    const EdgeTypes = GraphConfig.EdgeTypes
    const options = [
      'Select Type',
      'Paper',
      'Essay',
      'Video',
      'Full Course',
      'Blog',
      'Website',
      'Article',
      'Podcast',
      'Graph',
      'Textbook',
      'Book',
      'Practice Problem Set',
      'Exercise'
    ]

    //disable check

    return (
      <React.Fragment>
        {/* Node Resource Modal */}
        <Modal show={this.props.show} onHide={this.props.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{this.props.selected.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <strong>Description:</strong>{' '}
            {this.props.nodes &&
            this.props.selected.id !== undefined &&
            this.props.selected.description !== undefined
              ? this.props.nodes.find(node => {
                  return node.id === this.props.selected.id
                }).description
              : ''}
          </Modal.Body>
          <Modal.Body>
            <strong>Focus Question:</strong>{' '}
            {this.props.nodes &&
            this.props.selected.id !== undefined &&
            this.props.selected.question !== undefined
              ? this.props.nodes.find(node => {
                  return node.id === this.props.selected.id
                }).question
              : ''}
          </Modal.Body>
          <Modal.Body>
            <strong>Resources:</strong> <hr />
            {/* <ul> */}
            {this.props.resources &&
            this.props.resources[0] &&
            this.props.resources[0].id !== undefined
              ? this.props.resources.map(resource => {
                  //refactor into its own component so that I can call a componentDidMount on
                  return (
                    <React.Fragment key={resource.id}>
                      <ConnectedNodeResourceModalLineItem
                        resource={resource}
                        selected={this.props.selected}
                        canEdit={this.props.canEdit}
                        isMod={this.props.isMod}
                      />
                      <hr />
                    </React.Fragment>
                  )
                })
              : ''}
            {/* </ul> */}
          </Modal.Body>
          <Modal.Body>
            {/* Recommendation*/}
            <strong>Resources Recommended by other Users:</strong>
            <ul>
              {this.props.recommendations &&
              this.props.recommendations[0] &&
              this.props.recommendations[0].id !== undefined
                ? this.props.recommendations.map(recommendation => {
                    return (
                      <li key={recommendation.id}>
                        <Link to={`/recommendation/${recommendation.id}`}>
                          {recommendation.title}
                        </Link>{' '}
                        ({recommendation.type}) by{' '}
                        <Link to={`/user/${recommendation.owner.id}`}>
                          {recommendation.owner}
                        </Link>
                        {this.props.canEdit === true ? (
                          <Button
                            variant="submit"
                            sz="sm"
                            onClick={async () => {
                              await this.props.convertRecommendationToResource({
                                id: recommendation.id,
                                link: recommendation.link,
                                title: recommendation.title,
                                type: recommendation.type,
                                ResourceTags: recommendation.ResourceTags,
                                description: recommendation.description,
                                nodeId: this.props.selected.id
                              })
                              await this.props.getResourcesByNode(
                                this.props.selected
                              )
                            }}
                          >
                            Add to Node
                          </Button>
                        ) : null}
                      </li>
                    )
                  })
                : ''}
            </ul>
          </Modal.Body>
          {/* RENDERS NODE RESOURCE CONTROLS */}
          <Modal.Footer>
            {this.props.canEdit === true ? (
              <React.Fragment>
                {/* Controls for the general resource modal */}
                <Button variant="submit" onClick={this.props.handleClose}>
                  Close
                </Button>

                <Button variant="submit" onClick={this.handleEditShow}>
                  Edit
                </Button>
                <Button
                  variant="submit"
                  onClick={this.handleResourceSearchShow}
                >
                  Add Resource
                </Button>
                <Button
                  variant="submit"
                  onClick={this.handleExistingSearchShow}
                >
                  Search Resources
                </Button>
                {/* Renders the Recommend Resource Button for admins */}
                {this.props.user.rank === 'admin' ||
                this.props.user.rank === 'moderator' ? (
                  <Button variant="submit" onClick={this.handleRecommendShow}>
                    Recommend Resource
                  </Button>
                ) : null}
              </React.Fragment>
            ) : this.props.user.id !== undefined ? (
              <Button variant="submit" onClick={this.handleRecommendShow}>
                Recommend Resource
              </Button>
            ) : null}
            {/* END RENDERS NODE RESOURCE CONTROLS */}
          </Modal.Footer>
        </Modal>
        {/* End Resource Modal */}

        {/* Node Edit Modal */}
        <Form>
          <Modal show={this.state.editShow} onHide={this.handleEditClose}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Node</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                {/* Title */}
                <Form.Label>Title</Form.Label>
                <Form.Control
                  name="title"
                  type="title"
                  placeholder="Enter title"
                  defaultValue={this.props.selected.title}
                  onChange={this.handleEditChange}
                />
                {/* Focus Question */}
                <Form.Label>Focus Question</Form.Label>
                <Form.Control
                  name="question"
                  type="question"
                  placeholder="Add Focus Question"
                  defaultValue={this.props.selected.question}
                  onChange={this.handleEditChange}
                />
                <Form.Text className="text-muted">
                  Focus Questions can help you figure out what you're supposed
                  to learn from a concept and direct your learning. For example,
                  if you were learning about baking bread you might ask: 'What
                  does yeast do in the process of baking bread?'
                </Form.Text>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  name="description"
                  type="description"
                  placeholder="Enter description"
                  defaultValue={this.props.selected.description}
                  onChange={this.handleEditChange}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="submit" onClick={this.handleEditClose}>
                Close
              </Button>
              <Button variant="submit" onClick={this.handleEditSubmit}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
        </Form>

        {/* Check if Resource Exists */}
        <Form>
          <Modal
            show={this.state.resourceSearchShow}
            onHide={this.handleResourceSearchShow}
          >
            <Modal.Header closeButton>
              <Modal.Title>Search Resource</Modal.Title>
            </Modal.Header>
            <React.Fragment>
              <Modal.Body>
                {' '}
                <Form.Group>
                  <Form.Label>
                    <strong>Link</strong>
                  </Form.Label>
                  <Form.Control
                    name="link"
                    type="link"
                    placeholder="Enter link"
                    onChange={this.handleResourceSearchChange}
                  />
                  <Form.Text>
                    Enter the URL for the resource you want to add. If it does
                    not already exist in our database you will have the
                    opportunity to add it.
                  </Form.Text>
                </Form.Group>
                {/* <ul> */}
                {/* Renders Search Results for Search Resources */}
                {this.state.searchResults.length > 0 ? (
                  this.state.searchResults.map(result => {
                    // Conditionally render add/remove button based on if the resource is added to the node
                    return (
                      <li key={result.id}>
                        {this.props.canEdit === true ||
                        this.props.isMod === true ? (
                          <React.Fragment>
                            <Link to={`/resource/${result.id}`}>
                              {result.title}{' '}
                            </Link>
                            <Button
                              size="sm"
                              variant="submit"
                              onClick={async () => {
                                await this.props.associateResourceToNode({
                                  node: this.props.selected,
                                  resource: result
                                })
                                // await this.props.getResourcesByNode(
                                //   this.props.selected
                                // )
                              }}
                            >
                              Add to Node
                            </Button>
                            {this.props.user.rank === 'admin' ||
                            this.props.user.rank === 'mod' ? (
                              <Button
                                variant="submit"
                                sz="sm"
                                onClick={async () => {
                                  await this.props.postRecommendation({
                                    id: result.id,
                                    link: result.link,
                                    title: result.title,
                                    type: result.type,
                                    ResourceTags: result.ResourceTags,
                                    description: result.description,
                                    nodeId: this.props.selected.id,
                                    nodeTitle: this.props.selected.title,
                                    treeName: this.props.trees[0].title,
                                    ownerId: this.props.trees[0].ownerId
                                  })

                                  await this.props.recommendMessage({
                                    id: result.id,
                                    link: result.link,
                                    title: result.title,
                                    type: result.type,
                                    ResourceTags: result.ResourceTags,
                                    description: result.description,
                                    nodeId: this.props.selected.id,
                                    nodeTitle: this.props.selected.title,
                                    isSender: true,
                                    messageType: 'recommendation',
                                    tree: this.props.trees[0].title,
                                    treeId: this.props.trees[0].id,
                                    treeName: this.props.trees[0].title,
                                    ownerId: this.props.trees[0].ownerId
                                  })
                                }}
                              >
                                Recommend
                              </Button>
                            ) : null}
                          </React.Fragment>
                        ) : this.props.canEdit === true ||
                        this.props.isMod === true ? (
                          <React.Fragment>
                            <Link to={`/resource/${result.id}`}>
                              {result.title}{' '}
                            </Link>
                            <Button
                              size="sm"
                              variant="submit"
                              onClick={async () => {
                                await this.props.unAssociateResourceFromNode({
                                  node: this.props.selected,
                                  resource: result
                                })
                                await this.props.getResourcesByNode(
                                  this.props.selected
                                )
                              }}
                            >
                              Remove from Node
                            </Button>
                          </React.Fragment>
                        ) : (
                          //RECOMMENDATION LINE ITEMS
                          <React.Fragment>
                            <Link to={`/resource/${result.id}`}>
                              {result.title}{' '}
                            </Link>
                            <Button
                              variant="submit"
                              sz="sm"
                              onClick={async () => {
                                await this.props.postRecommendation({
                                  id: result.id,
                                  link: result.link,
                                  title: result.title,
                                  type: result.type,
                                  ResourceTags: result.ResourceTags,
                                  description: result.description,
                                  nodeId: this.props.selected.id,
                                  nodeTitle: this.props.selected.title,
                                  treeName: this.props.trees[0].title,
                                  ownerId: this.props.trees[0].ownerId
                                })

                                await this.props.recommendMessage({
                                  id: result.id,
                                  link: result.link,
                                  title: result.title,
                                  type: result.type,
                                  ResourceTags: result.ResourceTags,
                                  description: result.description,
                                  nodeId: this.props.selected.id,
                                  nodeTitle: this.props.selected.title,
                                  isSender: true,
                                  treeName: this.props.trees[0].title,
                                  messageType: 'recommendation',
                                  tree: this.props.trees[0].title,
                                  treeId: this.props.trees[0].id,
                                  ownerId: this.props.trees[0].ownerId
                                })
                              }}
                            >
                              Recommend
                            </Button>
                          </React.Fragment>
                        )}
                      </li>
                    )
                  })
                ) : this.state.searchResults.length === 0 &&
                this.state.search === true ? (
                  <React.Fragment>
                    None found. Would you like to add it to the database?
                    {/* <Form.Group> */}
                    {/* Title */}
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      name="title"
                      type="title"
                      placeholder="Enter title"
                      onChange={this.handleResourceChange}
                    />
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      name="description"
                      type="description"
                      as="textarea"
                      rows="3"
                      placeholder="Enter description"
                      onChange={this.handleResourceChange}
                    />
                    <Form.Label>Type</Form.Label>
                    <Form.Control
                      as="select"
                      name="type"
                      onChange={this.handleEditChange}
                    >
                      {options.map(option => {
                        return <option key={option}>{option}</option>
                      })}
                    </Form.Control>
                    <Form.Label>Tags</Form.Label>
                    <Form.Control
                      name="tags"
                      type="tags"
                      placeholder="Enter tags"
                      onChange={this.handleResourceChange}
                    />
                    <Form.Text className="text-muted">
                      Separate with a comma and a space. Ex. 'Machine Learning,
                      TensorFlow, JavaScript
                    </Form.Text>
                    {/* </Form.Group> */}
                  </React.Fragment>
                ) : this.state.searchResults.length === 0 &&
                this.state.search === true &&
                this.state.recommend === true ? (
                  //Recommendation form if no results are found
                  <React.Fragment>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      name="title"
                      type="title"
                      placeholder="Enter title"
                      onChange={this.handleRecommendChange}
                    />
                    <Form.Label>Link</Form.Label>
                    <Form.Control
                      name="link"
                      type="link"
                      placeholder="Enter link"
                      onChange={this.handleRecommendChange}
                    />
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      name="description"
                      type="description"
                      as="textarea"
                      rows="3"
                      placeholder="Enter description"
                      onChange={this.handleRecommendChange}
                    />
                    <Form.Label>Type</Form.Label>
                    <Form.Control
                      as="select"
                      name="type"
                      onChange={this.handleRecommendChange}
                    >
                      {options.map(option => {
                        return <option key={option}>{option}</option>
                      })}
                    </Form.Control>
                  </React.Fragment>
                ) : null}
                {/* </ul> */}
              </Modal.Body>
              <Modal.Footer>
                {/* Search Resources controls */}
                {this.state.search === true &&
                this.state.recommend === false &&
                this.state.searchResults.length === 0 ? (
                  <React.Fragment>
                    <Button
                      variant="submit"
                      onClick={this.handleResourceSearchShow}
                    >
                      Close
                    </Button>
                    <Button
                      variant="submit"
                      onClick={() => {
                        this.setState({
                          search: false,
                          searchResults: []
                        })
                      }}
                    >
                      Reset Search
                    </Button>
                    {/* Disable submit button until all fields are filled out */}
                    {this.state.title !== undefined &&
                    this.state.description !== undefined &&
                    this.state.type !== undefined &&
                    this.state.tags !== undefined ? (
                      <Button
                        variant="submit"
                        onClick={this.handleResourceSubmit}
                      >
                        Submit
                      </Button>
                    ) : (
                      <Button
                        variant="submit"
                        disabled
                        onClick={this.handleResourceSubmit}
                      >
                        Submit
                      </Button>
                    )}
                  </React.Fragment>
                ) : this.state.search === true &&
                this.state.recommend === true &&
                this.state.searchResults.length === 0 ? (
                  // Recommend Resource
                  <React.Fragment>
                    <Button
                      variant="submit"
                      onClick={this.handleResourceSearchShow}
                    >
                      Close
                    </Button>
                    <Button
                      variant="submit"
                      onClick={() => {
                        this.setState({
                          recommend: false,
                          search: false,
                          searchResults: []
                        })
                      }}
                    >
                      Cancel
                    </Button>
                    {this.state.title !== undefined &&
                    this.state.description !== undefined &&
                    this.state.type !== undefined &&
                    this.state.tags !== undefined ? (
                      <Button
                        variant="submit"
                        onClick={this.handleRecommendSubmit}
                      >
                        Submit
                      </Button>
                    ) : (
                      <Button
                        variant="submit"
                        disabled
                        onClick={this.handleRecommendSubmit}
                      >
                        Submit
                      </Button>
                    )}
                  </React.Fragment>
                ) : (
                  //Add Resource
                  <React.Fragment>
                    <Button
                      variant="submit"
                      onClick={this.handleResourceSearchShow}
                    >
                      Close
                    </Button>
                    <Button
                      variant="submit"
                      onClick={this.handleResourceSearchSubmit}
                    >
                      Submit
                    </Button>
                  </React.Fragment>
                )}
              </Modal.Footer>
            </React.Fragment>
          </Modal>
        </Form>

        {/* Search Existing Resource Modal */}
        <Form>
          <Modal
            show={this.state.searchExistingResource}
            onHide={this.handleExistingSearchShow}
          >
            <Modal.Header closeButton>
              <Modal.Title>Search</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <Form.Control
                  name="searchExisting"
                  placeholder="Search for a Resource"
                  onChange={this.handleExistingSearchChange}
                />
              </Form.Group>
            </Modal.Body>
            {this.state.searchExistingResourceResults.length >= 0 ? (
              <Modal.Body>
                Search Results
                {this.state.searchExistingResourceResults.length > 0 &&
                this.state.searchExistingResourceSearch === true ? (
                  this.state.searchExistingResourceResults.map(result => {
                    return (
                      <React.Fragment key={result.link}>
                        <li>
                          <Link to={`/resource/${result.id}`}>
                            {result.title}
                          </Link>
                          {this.props.canEdit === true ||
                          this.props.isMod === true ? (
                            <Button
                              variant="submit"
                              sz="sm"
                              onClick={async () => {
                                await this.props.associateResourceToNode({
                                  node: this.props.selected,
                                  resource: result
                                })
                                await this.props.getResourcesByNode(
                                  this.props.selected
                                )
                              }}
                            >
                              Add to Node
                            </Button>
                          ) : null}
                        </li>
                      </React.Fragment>
                    )
                  })
                ) : this.state.searchExistingResourceSearch === true &&
                this.state.searchExistingResourceResults.length === 0 ? (
                  <Row>
                    <Col>none found</Col>
                  </Row>
                ) : null}
              </Modal.Body>
            ) : null}
            <Modal.Footer>
              <React.Fragment>
                <Button
                  variant="submit"
                  onClick={this.handleExistingSearchShow}
                >
                  Close
                </Button>
                <Button
                  variant="submit"
                  onClick={this.handleExistingSearchSubmit}
                >
                  Submit
                </Button>
              </React.Fragment>
            </Modal.Footer>
          </Modal>
        </Form>
      </React.Fragment>
    )
  }
}

const mapState = state => {
  return {
    user: state.currUser,
    trees: state.tree,
    nodes: state.node,
    edges: state.edge,
    resources: state.resource,
    recommendations: state.recommendation,
    vote: state.vote
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
    delSelectedEdge: edgeId => dispatch(delSelectedEdge(edgeId)),
    putEdge: edge => dispatch(putEdge(edge)),
    getResources: node => dispatch(getResources(node)),
    postResource: resource => dispatch(postResource(resource)),
    postRecommendation: recommendation =>
      dispatch(postRecommendation(recommendation)),
    getRecommendations: () => dispatch(getRecommendations()),
    associateResourceToNode: resource =>
      dispatch(associateResourceToNode(resource)),
    unAssociateResourceFromNode: resource =>
      dispatch(unAssociateResourceFromNode(resource)),
    getResourcesByNode: node => dispatch(getResourcesByNode(node)),
    upvote: resource => dispatch(upvote(resource)),
    downvote: resource => dispatch(downvote(resource)),
    getVote: resource => dispatch(getVote(resource)),
    convertRecommendationToResource: recommendation =>
      dispatch(convertRecommendationToResource(recommendation)),
    recommendMessage: message => dispatch(recommendMessage(message))
  }
}

export const ConnectedNodeResourceModal = connect(mapState, mapDispatch)(
  NodeResourceModal
)
