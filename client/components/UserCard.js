import React, {Component} from 'react'
import {Row, Col, Modal, Button, Form, Card, Tabs, Tab} from 'react-bootstrap'

export const UserCard = props => (
  <Card key={props.follower.id}>
    <Card.Img variant="top" src="holder.js/100px180" alt="IMAGE" />
    <Card.Body>
      <Card.Title>
        {props.follower.firstName} {props.follower.lastName}
      </Card.Title>
      <Card.Text>{props.follower.bio}</Card.Text>
    </Card.Body>
  </Card>
)
