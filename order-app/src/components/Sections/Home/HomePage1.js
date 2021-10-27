import React, { Component } from "react";

import { connect } from "react-redux";
import { get_request } from "../../../actions/lib";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import { GridList, GridListTile, GridListTileBar } from "@material-ui/core";
import { GET_CATEGORIES } from "../../../actions/actions";

import Header1 from "../../Layout/Header1";
import Footer1 from "../../Layout/Footer1";

class HomePage1 extends Component {
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
      <div>
        <Header1 />
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Coffee Twist</h1>
          </div>
        </header>
        <main className="min-h-screen">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {/* <!-- Replace with your content --> */}
            <div className="px-4 py-6 sm:px-0">
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
                        <Link to={`/order1/${c.name}`}>
                          <GridListTileBar title={c.name} />
                        </Link>
                      </GridListTile>
                    );
                  })
                ) : (
                  <div>None yet</div>
                )}
              </GridList>
            </div>
            {/* <!-- /End replace --> */}
          </div>
        </main>
        <Footer1 className="footer" />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  productReducer: state.productReducer,
});

export default connect(mapStateToProps, { get_request })(HomePage1);

const GridTile = ({ category }) => {
  return (
    <div class="max-w-lg mx-auto">
      <div class="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm mb-5">
        <a href="">
          <img
            class="rounded-t-lg"
            src="https://flowbite.com/docs/images/blog/image-1.jpg"
            alt=""
          />
        </a>
        <div class="p-5">
          <a href="#">
            <h5 class="text-gray-900 font-bold text-2xl tracking-tight mb-2">
              Noteworthy technology acquisitions 2021
            </h5>
          </a>
          <p class="font-normal text-gray-700 mb-3">
            Here are the biggest enterprise technology acquisitions of 2021 so
            far, in reverse chronological order.
          </p>
          <a
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center"
            href="#"
          >
            Read more
          </a>
        </div>
      </div>
      <p>
        This card component is part of a larger, open-source library of Tailwind
        CSS components. Learn more by going to the official{" "}
        <a
          class="text-blue-600 hover:underline"
          href="https://flowbite.com/docs/getting-started/introduction/"
          target="_blank"
        >
          Flowbite Documentation
        </a>
        .
      </p>
    </div>
  );
};
