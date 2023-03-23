import {Spinner} from "react-bootstrap";

export const Loading = () => {
  return (
    <div className="d-flex justify-content-center align-items-center flex-column" id="loading">
      <Spinner animation="border" role="status" id="spinner" variant="primary" />
      <h2 className="mt-2">Loading...</h2>
    </div>
  );
};
