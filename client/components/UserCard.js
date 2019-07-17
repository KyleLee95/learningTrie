import React, {Component} from 'react'
import {Row, Col, Modal, Button, Form, Card, Tabs, Tab} from 'react-bootstrap'
import {Link} from 'react-router-dom'
export const UserCard = props => (
  <React.Fragment>
    <Card key={props.follower.id}>
      <Card.Body>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12} xl={10}>
            <h4>
              <Link to={`/user/${props.follower.id}`} style={{color: 'black'}}>
                {props.follower.username}
              </Link>
            </h4>
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs={12}>{props.follower.bio.slice(0, 255)}...</Col>
        </Row>
      </Card.Body>
    </Card>
  </React.Fragment>
)
