import React, { Component } from "react";
import "../../../../css/Panel/CreatePage.css";
import CreateForm from "./CreateForm";
import { CreateOptionsData } from "./CreateOptionsData";

class CreatePage extends Component {
  state = {
    selectedOption: "",
  };
  changeOption = (name) => {
    this.setState({ selectedOption: name });
  };
  render() {
    return (
      <div className="CreatePage">
        <div className="Createoptions">
          <ul className="Optionlist">
            {CreateOptionsData.map((option, key) => {
              return (
                <li key={key} className="row">
                  {" "}
                  <div
                    id="button"
                    name="selectedOption"
                    onClick={() => this.changeOption(option.name)}
                  >
                    {option.name}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <CreateForm option={this.state.selectedOption} />
      </div>
    );
  }
}

export default CreatePage;
