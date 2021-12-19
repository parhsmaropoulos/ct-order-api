import React, { Component } from "react";
import { connect } from "react-redux";
import { get_request, post_request } from "../../../actions/lib";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { GET_CATEGORIES, SUBSCRIBE_USER } from "../../../actions/actions";

import Header1 from "../../Layout/Header1";
import moment from "moment-timezone";
import Footer2 from "../../Layout/Footer2";
import { current_url } from "../../../utils/util";
moment.tz.setDefault("Europe/Athens");
const startTime = 8;
const endTime = 24;

class HomePage1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      showAddressModal: false,
      showBanner: false,
      id: "",
    };
    this.onSubscribe = this.onSubscribe.bind(this);
  }

  static propTypes = {
    get_request: PropTypes.func.isRequired,
    productReducer: PropTypes.object.isRequired,
  };
  componentDidMount() {
    let now = moment();
    let showBanner = false;
    if (now.hour() < startTime || now.hour() > endTime) {
      showBanner = true;
    }

    if (this.props.productReducer.categories.length === 0) {
      this.get_categories();
    }
    this.setState({
      id: uuidv4(),
      showBanner: showBanner,
    });
  }
  async get_categories() {
    await this.props.get_request("product_category/all", GET_CATEGORIES);
  }
  onSubscribe = async (data) => {
    await post_request("subscribes/new", data, SUBSCRIBE_USER);
  };
  render() {
    return (
      <div>
        <div
          className={`text-center flex flex-col p-4 md:text-left md:flex-row md:items-center md:justify-between md:p-12 bg-purple-100 rounded-md ${
            this.state.showBanner === false && "hidden"
          }  `}
        >
          <div className="text-2xl font-semibold">
            <div className="text-gray-900">
              Το κατάστημα λειτουργεί 8 το πρωί με 12 το βράδυ !
            </div>
          </div>
        </div>
        <Header1 />
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Coffee Twist</h1>
          </div>
        </header>
        <main className="min-h-screen">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {/* <!-- Replace Tile --> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {this.props.productReducer.categories.length > 0 ? (
                this.props.productReducer.categories.map((c, indx) => {
                  return <CategoryBlock category={c} key={indx} />;
                })
              ) : (
                <div>None yet</div>
              )}
            </div>
            {/* <!-- /End replace --> */}
          </div>
        </main>
        <Footer2
          className="footer"
          onSubscribe={(data) => this.onSubscribe(data)}
        />
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
    <div className="max-w-lg mx-auto">
      <div className="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm mb-5">
        <a href={`/order`}>
          {!!category.image === true ? (
            <img
              className="rounded-t-lg w-100 h-50"
              // src="https://flowbite.com/docs/images/blog/image-1.jpg"
              src={`assets/img/${category.image}`}
              alt=""
            />
          ) : (
            <div className="rounded-t-lg w-100 h-50 bg-gray"></div>
          )}
        </a>
        <div className="p-5">
          <a href={`/order`}>
            <h5 className="text-gray-900 font-bold text-2xl tracking-tight mb-2">
              {category.name}
            </h5>
          </a>
          <p className="font-normal text-gray-700 mb-3">
            {category.description}
          </p>
        </div>
      </div>
    </div>
  );
};

const CategoryBlock = ({ category }) => {
  return (
    <div className="w-full h-full py-5 flex justify-center items-center">
      <div className="relative pl-1 flex justify-center rounded-xl hover:scale-105 duration-500 transform transition cursor-pointer">
        <a href={`/order/${category.name}`}>
          <div className="w-52 pb-2 bg-white rounded-xl shadow-xl z-10">
            <div className="relative">
              {/* <!-- :src="image.largeImageURL"     --> */}
              <img
                // src="https://cdn.pixabay.com/photo/2010/12/13/10/05/berries-2277_640.jpg"
                src={
                  category.image
                    ? `${current_url}assets/img/${category.image}`
                    : `${current_url}assets/img/ct-logo.jpeg`
                }
                className="max-h-60 max-w-100 object-cover rounded-t-xl"
                alt=""
              />
            </div>
            <div className="px-2 py-1">
              {/* <!-- Product Title --> */}
              <div className="text-sm md:text-base font-bold pr-2">
                {category.name}
              </div>
              <p className="pb-1 md:pb-2 text-xs md:text-sm text-gray-500">
                {category.description}
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};
