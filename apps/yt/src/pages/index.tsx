import Link from "next/link";
import {Alert} from "react-bootstrap";

const Home = () => (
  <Alert className="text-center">
    <h1>Welcome to Adaptive Games YT!</h1>
    <p>
      To learn how to use this app, view the{" "}
      <Link href="http://localhost:3001" target="_blank" className="text-white">
        user guide.
      </Link>
    </p>
  </Alert>
);

export default Home;
