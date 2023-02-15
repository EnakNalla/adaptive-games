import Link from "next/link";
import {useRouter} from "next/router";
import {Alert} from "react-bootstrap";
import {HouseFill} from "react-bootstrap-icons";

const Error = () => {
  const {query} = useRouter();

  return (
    <Alert className="text-center" variant="danger">
      <h1 className="mb-5 text-danger">Oh no! We encountered an error...</h1>

      <h2 className="mt-2">{query.error}</h2>

      <p className="fw-bold">
        Please try again. If the problem persists contact the system administrator.
      </p>

      <Link href="/" as="button" role="link" className="btn btn-primary" aria-label="Go home">
        <HouseFill size={24} />
      </Link>
    </Alert>
  );
};

export default Error;
