import { Link } from "react-router-dom";

const TestingPage = () => {
  return (
    <>
      <h2>this is a secondary page</h2>
      <Link to={`/`}>The homepage</Link>

    </>
  )
}

export default TestingPage;
