import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "../../../css/Pages/accountpage.css";
import { auth_get_request, auth_put_request } from "../../../actions/lib";

import { GET_USER, UPDATE_USER } from "../../../actions/actions";
import withAuthorization from "../../../firebase/withAuthorization";
import Header1 from "../../Layout/Header1";

class AccountPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      name: "",
      surname: "",
      phone: "",
      newPassword: "",
      newPassword2: "",
      user: {},
    };
    this.onUpdateSubmit = this.onUpdateSubmit.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangePasswordSubmit = this.onChangePasswordSubmit.bind(this);
  }

  static propTypes = {
    userReducer: PropTypes.object.isRequired,
    auth_get_request: PropTypes.func.isRequired,
    auth_put_request: PropTypes.func.isRequired,
  };

  componentDidMount() {
    sessionStorage.setItem("selectedTab", "account");
    if (this.props.userReducer.hasLoaded === false) {
      this.get_user();
    } else {
      this.setState({
        name: this.props.userReducer.user.name,
        surname: this.props.userReducer.user.surname,
        phone: this.props.userReducer.user.phone,
        email: this.props.userReducer.user.email,
        user: this.props.userReducer.user,
      });
    }
  }
  async get_user() {
    await this.props.auth_get_request(
      `user/${sessionStorage.getItem("userID")}`,
      GET_USER
    );
    this.setState({
      name: this.props.userReducer.user.name,
      surname: this.props.userReducer.user.surname,
      phone: this.props.userReducer.user.phone,
      email: this.props.userReducer.user.email,
      user: this.props.userReducer.user,
    });
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onChangePasswordSubmit(e) {
    e.preventDefault();
    const data = {
      password: this.state.newPassword,
    };
    this.props.auth_put_request("user/0/update_password", data, UPDATE_USER);
    // this.props.updateUser(data);
  }

  onUpdateSubmit(e) {
    e.preventDefault();
    const data = {
      name: this.state.name,
      surname: this.state.surname,
      phone: this.state.phone,
    };
    this.props.auth_put_request(
      "user/0/update_personal_info",
      data,
      UPDATE_USER
    );
  }

  onSubmit(e) {
    e.preventDefault();
    console.log(this.state);
  }

  render() {
    return (
      <div className="min-h-screen">
        <Header1 />
        <AccountMenu />
        <UserInfoForm
          state={this.state}
          onChange={this.onChange}
          onSubmit={this.onUpdateSubmit}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userReducer: state.userReducer,
});

const condition = (authUser) => !!authUser;
export default withAuthorization(condition)(
  connect(mapStateToProps, { auth_get_request, auth_put_request })(AccountPage)
);

export const AccountMenu = () => {
  let selectedTab = sessionStorage.getItem("selectedTab");
  return (
    <nav className="font-sans flex  text-center  py-4 px-6 bg-white shadow  w-full">
      <div className="w-full h-full bg:flex md:flex sm:flex-col bg:flex-row md:flex-row justify-center items-center">
        <a href="/account" className="hover:no-underline ">
          <div
            className={`flex h-full items-center bg-gray-500   hover:bg-black hover:bg-opacity-50 ${
              selectedTab === "account" && "bg-gray-700"
            }`}
          >
            <div className="mx-4 text-white">Ο λογαριασμός μου</div>
            <div className=" h-8  lg:w-px sm:w-0 md:w-0 bg-gray-300"></div>
          </div>
        </a>
        <a href="/account/orders" className="hover:no-underline">
          <div
            className={`flex h-full items-center bg-gray-500  hover:bg-black hover:bg-opacity-50 ${
              selectedTab === "orders" && "bg-gray-700"
            }`}
          >
            <div className="mx-4 text-white">Οι παραγγελίες μου</div>
            <div className=" h-8  lg:w-px sm:w-0 md:w-0  bg-gray-300"></div>
          </div>
        </a>
        <a href="/account/addresses" className="hover:no-underline">
          <div
            className={`flex h-full items-center bg-gray-500  hover:bg-black hover:bg-opacity-50 ${
              selectedTab === "addresses" && "bg-gray-700"
            }`}
          >
            <div className="mx-4 text-white">Διευθύνσεις</div>
            <div className=" h-8  lg:w-px sm:w-0 md:w-0 bg-gray-300"></div>
          </div>
        </a>
      </div>
    </nav>
  );
};

const UserInfoForm = ({ onChange, onSubmit, state }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="py-6">
        <span className="font-bold">
          <h1>Αλλαγή στοιχείων</h1>
        </span>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="border focus-within:border-blue-500 focus-within:text-blue-500 transition-all duration-500 relative rounded p-1">
          <div className="-mt-4 absolute tracking-wider px-1 uppercase text-xs">
            <p>
              <label htmlFor="name" className="bg-white text-gray-600 px-1">
                Όνομα
              </label>
            </p>
          </div>
          <p>
            <input
              id="name"
              name="name"
              autoComplete="false"
              tabIndex="0"
              value={state.name}
              onChange={onChange}
              type="text"
              className="py-1 px-1 text-gray-900 outline-none block h-full w-full"
            />
          </p>
        </div>
        <div className="border focus-within:border-blue-500 focus-within:text-blue-500 transition-all duration-500 relative rounded p-1">
          <div className="-mt-4 absolute tracking-wider px-1 uppercase text-xs">
            <p>
              <label htmlFor="surname" className="bg-white text-gray-600 px-1">
                Επίθετο
              </label>
            </p>
          </div>
          <p>
            <input
              name="surname"
              id="surname"
              autoComplete="false"
              tabIndex="0"
              onChange={onChange}
              value={state.surname}
              type="text"
              className="py-1 px-1 outline-none block h-full w-full"
            />
          </p>
        </div>
        <div className="border focus-within:border-blue-500 focus-within:text-blue-500 transition-all duration-500 relative rounded p-1">
          <div className="-mt-4 absolute tracking-wider px-1 uppercase text-xs">
            <p>
              <label htmlFor="phone" className="bg-white text-gray-600 px-1">
                Τηλέφωνο Επικοινωνίας
              </label>
            </p>
          </div>
          <p>
            <input
              id="phone"
              name="phone"
              inputprops={{
                pattern: "69[0-9]{8}",
              }}
              tabIndex="0"
              onChange={onChange}
              value={state.phone}
              type="tel"
              placeholder="Τηλέφωνο επικοινωνίας: 69xxxxxxxx"
              className="py-1 px-1 outline-none block h-full w-full"
            />
          </p>
        </div>
        <div className="border f transition-all duration-500  relative rounded p-1">
          <div className="-mt-4 absolute tracking-wider  px-1 uppercase text-xs">
            <p>
              <label htmlFor="email" className="bg-white text-gray-600 px-1">
                Email
              </label>
            </p>
          </div>
          <p>
            <input
              value={state.email}
              id="email"
              autoComplete="false"
              tabIndex="0"
              type="email"
              disabled
              className="py-1 px-1 outline-none block bg-gray-200 h-full w-full"
            />
          </p>
        </div>
      </div>
      <div className="border-t mt-6 pt-3">
        <button
          onClick={onSubmit}
          className="rounded text-gray-100 px-3 py-1 bg-blue-500 hover:shadow-inner hover:bg-blue-700 transition-all duration-300"
        >
          Ενημέρωση
        </button>
      </div>
    </div>
  );
};

// const UserPasswordResetForm = ({ onChange, onSubmit, state }) => {
//   return (
//     <div className="bg-white shadow rounded-lg p-6">
//       <div className="py-6">
//         <span className="font-bold">
//           <h1>Αλλαγή στοιχείων</h1>
//         </span>
//       </div>
//       <div className="grid lg:grid-cols-2 gap-6">
//         <div className="border focus-within:border-blue-500 focus-within:text-blue-500 transition-all duration-500 relative rounded p-1">
//           <div className="-mt-4 absolute tracking-wider px-1 uppercase text-xs">
//             <p>
//               <label htmlFor="name" className="bg-white text-gray-600 px-1">
//                 Όνομα
//               </label>
//             </p>
//           </div>
//           <p>
//             <input
//               id="name"
//               name="name"
//               autoComplete="false"
//               tabIndex="0"
//               value={state.name}
//               onChange={onChange}
//               type="text"
//               className="py-1 px-1 text-gray-900 outline-none block h-full w-full"
//             />
//           </p>
//         </div>
//         <div className="border focus-within:border-blue-500 focus-within:text-blue-500 transition-all duration-500 relative rounded p-1">
//           <div className="-mt-4 absolute tracking-wider px-1 uppercase text-xs">
//             <p>
//               <label htmlFor="surname" className="bg-white text-gray-600 px-1">
//                 Επίθετο
//               </label>
//             </p>
//           </div>
//           <p>
//             <input
//               name="surname"
//               id="surname"
//               autoComplete="false"
//               tabIndex="0"
//               onChange={onChange}
//               value={state.surname}
//               type="text"
//               className="py-1 px-1 outline-none block h-full w-full"
//             />
//           </p>
//         </div>
//         <div className="border focus-within:border-blue-500 focus-within:text-blue-500 transition-all duration-500 relative rounded p-1">
//           <div className="-mt-4 absolute tracking-wider px-1 uppercase text-xs">
//             <p>
//               <label htmlFor="phone" className="bg-white text-gray-600 px-1">
//                 Τηλέφωνο Επικοινωνίας
//               </label>
//             </p>
//           </div>
//           <p>
//             <input
//               id="phone"
//               name="phone"
//               inputprops={{
//                 pattern: "69[0-9]{8}",
//               }}
//               tabIndex="0"
//               onChange={onChange}
//               value={state.phone}
//               type="tel"
//               placeholder="Τηλέφωνο επικοινωνίας: 69xxxxxxxx"
//               className="py-1 px-1 outline-none block h-full w-full"
//             />
//           </p>
//         </div>
//         <div className="border f transition-all duration-500  relative rounded p-1">
//           <div className="-mt-4 absolute tracking-wider  px-1 uppercase text-xs">
//             <p>
//               <label htmlFor="email" className="bg-white text-gray-600 px-1">
//                 Email
//               </label>
//             </p>
//           </div>
//           <p>
//             <input
//               value={state.email}
//               id="email"
//               autoComplete="false"
//               tabIndex="0"
//               type="email"
//               disabled
//               className="py-1 px-1 outline-none block bg-gray-200 h-full w-full"
//             />
//           </p>
//         </div>
//       </div>
//       <div className="border-t mt-6 pt-3">
//         <button
//           onClick={onSubmit}
//           className="rounded text-gray-100 px-3 py-1 bg-blue-500 hover:shadow-inner hover:bg-blue-700 transition-all duration-300"
//         >
//           Ενημέρωση
//         </button>
//       </div>
//     </div>
//   );
// };