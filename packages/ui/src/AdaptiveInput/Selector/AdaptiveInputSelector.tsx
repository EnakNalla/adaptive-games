import {type InputType} from "../AdaptiveInput.types";
import {images} from "../AdaptiveInput.utils";
import {Card, Col, Row} from "react-bootstrap";

export const AdaptiveInputSelector = ({onSelect}: {onSelect: (type: InputType) => void}) => {
  return (
    <>
      <h2 className="text-center mb-4 h2">Select an input type</h2>
      <Row xs={1} s={2} md={2} lg={4}>
        <style>
          {`
        .grow { 
transition: all .2s ease-in-out; 
}

.grow:hover { 
transform: scale(1.05); 
}
        `}
        </style>
        {[...images].map(([name, imgProps]) => {
          return (
            <Col key={name} className="d-flex justify-content-center gap-2">
              <Card
                onClick={() => onSelect(name)}
                style={{width: "14rem", height: "16rem"}}
                role="button"
                className="grow mb-2"
              >
                <Card.Img variant="top" {...imgProps} />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-center mt-auto">{name}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  );
};
