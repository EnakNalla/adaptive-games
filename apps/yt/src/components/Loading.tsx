import {Spinner} from "react-bootstrap";

export const Loading = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center flex-column"
      style={{height: "90vh"}}
    >
      <Spinner
        animation="border"
        role="status"
        style={{width: "4rem", height: "4rem"}}
        variant="primary"
      />
      <h2 className="mt-2">Loading...</h2>
    </div>
  );
};
