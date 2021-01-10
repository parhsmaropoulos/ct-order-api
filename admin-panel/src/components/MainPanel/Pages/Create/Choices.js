import React from "react";
import { Button, Col, Form, FormGroup } from "react-bootstrap";
const ChoiceList = (props) => {
  return props.choiceList.map((choice, key) => {
    console.log(choice);
    return (
      <div key={key}>
        <Form.Group>
          <Form.Label>Choice Name</Form.Label>
          <Form.Control value={choice.name} disabled />
        </Form.Group>
        <Form.Group>
          <Form.Label>Choice description</Form.Label>
          <Form.Control value={choice.description} disabled />
        </Form.Group>
        <Form.Group>
          <Form.Label>Options</Form.Label>
          {choice.options.map((option, index) => {
            return (
              <Form.Group key={index}>
                <Form.Label>
                  {option.name} : {option.price}
                </Form.Label>
              </Form.Group>
            );
          })}
        </Form.Group>
        <Button variant="danger" onClick={() => props.delete(key)}>
          Delete
        </Button>
      </div>
    );
  });
};

export default ChoiceList;
