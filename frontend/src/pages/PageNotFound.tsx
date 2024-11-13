import { Link } from "react-router-dom"

const PageNotFound = () => {
  return (
    <div className="container">
      <h2>Page not found</h2>
      <Link to='/users'>Go To Main page</Link>
    </div>
  )
}

export default PageNotFound
