import React, {Component} from 'react'
import {Row, Col, DropdownButton, Dropdown, SplitButton} from 'react-bootstrap'
import {connect} from 'react-redux'
// import {fetchTrees} from '../store/learningTree'

const Sidebar = props => {
  return (
    <div>
      <SplitButton id="dropdown-split-variants-Primary" title="Learning Trees">
        {props.trees
          ? props.trees
              .filter(tree => tree.userId === props.user.id)
              .map(tree => {
                return (
                  <Dropdown.Item key={tree.id} href={`learningTree/${tree.id}`}>
                    {tree.title}
                  </Dropdown.Item>
                )
              })
          : ''}
      </SplitButton>
    </div>
  )
}

const mapState = state => {
  return {
    user: state.user,
    trees: state.trees
  }
}

export const ConnectedSidebar = connect(mapState, null)(Sidebar)
