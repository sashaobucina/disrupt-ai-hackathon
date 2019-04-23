import React, { Component } from "react";
import { RegionDropdown } from 'react-country-region-selector'
import { Container, Row, Col, Button } from "react-bootstrap";
import scotiaIcon from "../../static/imgs/scotia-icon.png";

export class RegionSelector extends Component {
  render() {
    return(
      <Container>
        <Row>
          <Col lg={{ span: 2 }} md={{ span: 2 }} sm={{ span: 2 }} />
          <Col lg={{ span: 8 }} md={{ span: 8 }} sm={{ span: 8 }}>
            <div className="name-logo">
              <img src={scotiaIcon} alt="header png" />
            </div>
          </Col>
          <Col lg={{ span: 2 }} md={{ span: 2 }} sm={{ span: 2 }} />
        </Row>
        <Row>
          <Col lg={{ span: 6 }} md={{ span: 6 }} sm={{ span: 6 }}>
            <p>Select a Region: </p>
          </Col>
          <Col lg={{ span: 6 }} md={{ span: 6 }} sm={{ span: 6 }}>
            <div className="region-dropdown">
              <RegionDropdown 
                country="Canada"
                value={this.props.region}
                onChange={this.props.selector}/>
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={{ span: 5 }} md={{ span: 5 }} sm={{ span: 5 }} />
          <Col lg={{ span: 2 }} md={{ span: 2 }} sm={{ span: 2 }}>
            <div className="search-btn">
              <Button variant="outline-light" onClick={this.props.onClick}>
                Analyze
              </Button>
            </div>
          </Col>
          <Col lg={{ span: 5 }} md={{ span: 5 }} sm={{ span: 5 }} />
        </Row>
      </Container>
    );
  }
}