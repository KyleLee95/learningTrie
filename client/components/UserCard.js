import React, {Component} from 'react'
import {Row, Col, Modal, Button, Form, Card, Tabs, Tab} from 'react-bootstrap'

export const UserCard = props => (
  <Card key={props.follower.id}>
    <Card.Img
      variant="top"
      src={props.follower.avatar}
      style={{width: '18rem'}}
      fluid="true"
      alt="IMAGE"
    />
    <Card.Body>
      <Card.Title>
        {props.follower.firstName} {props.follower.lastName}
      </Card.Title>
      <Card.Text style={{width: '18rem'}}>
        {`${props.follower.bio.slice(0, 250)}...`}
      </Card.Text>
    </Card.Body>
  </Card>
)
