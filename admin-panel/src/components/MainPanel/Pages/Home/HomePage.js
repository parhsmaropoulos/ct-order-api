import React, { Component } from "react";
import { Carousel, Container } from "react-bootstrap";
import { connect } from "react-redux";

// Images
import crepe from "../../../../assets/Images/crepe.jpg";
import pan from "../../../../assets/Images/pancakes.jpg";
import club from "../../../../assets/Images/club.jpg";

class HomePage extends Component {
  render() {
    return (
      <Container className="homePageContainer">
        <Carousel>
          <Carousel.Item>
            <img
              className="d-block w-100"
              // height={250}
              src={crepe}
              alt="First slide"
            />
            <Carousel.Caption>
              <h3>First slide label</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              // height={250}
              src={club}
              alt="Third slide"
            />

            <Carousel.Caption>
              <h3>Second slide label</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              // height={250}
              src={pan}
              alt="Third slide"
            />

            <Carousel.Caption>
              <h3>Third slide label</h3>
              <p>
                Praesent commodo cursus magna, vel scelerisque nisl consectetur.
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </Container>
    );
  }
}

export default connect()(HomePage);
