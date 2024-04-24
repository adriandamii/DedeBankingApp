import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <>
            <h1>This is the homepage</h1>
            <Link to={`testingPage`}>Go to second page</Link>
            <div>
                <Link to={`users`}>See the users from database</Link>
            </div>
        </>
    );
};

export default HomePage;
