import React, { Component } from "react";
import { Container } from "react-bootstrap";
import { connect } from "react-redux";
import { get_request } from "../../../actions/lib";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import { GridList, GridListTile, GridListTileBar } from "@material-ui/core";
import { GET_CATEGORIES } from "../../../actions/actions";
import Header from "../../Layout/Header";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      showAddressModal: false,
      id: "",
    };
  }

  static propTypes = {
    get_request: PropTypes.func.isRequired,
    productReducer: PropTypes.object.isRequired,
  };
  componentDidMount() {
    // console.log(this.props);
    if (this.props.productReducer.categories.length === 0) {
      this.get_categories();
    }
    this.setState({
      id: uuidv4(),
    });
  }
  async get_categories() {
    await this.props.get_request("product_category/all", GET_CATEGORIES);
  }
  render() {
    return (
      <Container className="homePageContainer" style={{ minHeight: "70vh" }}>
        <Header />
        <GridList
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            overflow: "hidden",
          }}
          spacing={10}
          cellHeight={160}
          cols={2}
        >
          {this.props.productReducer.categories.length > 0 ? (
            this.props.productReducer.categories.map((c, indx) => {
              return (
                <GridListTile key={c.ID} cols={1}>
                  <img
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      height: "auto",
                    }}
                    src={`assets/images/${c.image}`}
                    alt={c.name}
                  />
                  <Link to={`/order/${c.name}`}>
                    <GridListTileBar title={c.name} />
                  </Link>
                </GridListTile>
              );
            })
          ) : (
            <div>None yet</div>
          )}
        </GridList>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  productReducer: state.productReducer,
});

export default connect(mapStateToProps, { get_request })(HomePage);
