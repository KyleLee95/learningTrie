import React, {Component} from 'react'
import {Row, Col, DropdownButton, Dropdown} from 'react-bootstrap'
import {connect} from 'react-redux'

//Can refactor into function component and get everything from state.
//TODO:
//Thunk + reducer for getting all tries.

class Sidebar extends Component {
  componentDidMount() {
    console.log(this.props.trees)
  }
  render() {
    return (
      <div>
        <DropdownButton id="dropdown-basic-button" title="Learning Tries">
          {this.props.trees
            .filter(tree => tree.userId === this.props.user.id)
            .map(tree => {
              return (
                <Dropdown.Item key={tree.id} href="#/action-1">
                  {tree.title}
                </Dropdown.Item>
              )
            })}

          <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
        </DropdownButton>

        {/* <ul>
          <h3>Learning Tries</h3>
          <li id="learningTriesSidebar"> Machine Learning </li>
          <li id="learningTriesSidebar"> Film Photography Development </li>
          <li id="learningTriesSidebar"> Fighting Game Techniques </li>
        </ul> */}
      </div>
    )
  }
}

const mapState = state => {
  return {
    user: state.user,
    trees: state.trees
  }
}

export const ConnectedSidebar = connect(mapState, null)(Sidebar)
