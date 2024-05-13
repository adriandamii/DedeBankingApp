import { useState } from 'react';
import axios from 'axios';
import GoBackRoute from '../../../../components/utils/GoBackRoute';

interface User {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
}

interface ErrorResponse {
    message: string;
}

const SearchPage = () => {
    const [identityId, setIdentityId] = useState('');
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!identityId) {
            setError('Identity ID is required.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await axios.get<User>(`http://localhost:5000/admin/search`, {
                params: { identityId },
                withCredentials: true
            });
            console.log(response.data.lastName);
            setUser(response.data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            const errorResponse = err as { response?: { data: ErrorResponse } };
            setError(errorResponse.response?.data.message || 'Failed to fetch user');
            setUser(null);
        }
    };

    return (
        <div>
            <h1>Search for a User</h1>
            <GoBackRoute />
            <input
                type="text"
                value={identityId}
                onChange={(e) => setIdentityId(e.target.value)}
                placeholder="Enter Identity ID"
            />
            <button onClick={handleSearch} disabled={loading}>
                Search
            </button>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {user && (
                <div>
                    <h2>User Details:</h2>
                    <p>Name: {user.firstName} {user.lastName}</p>
                    <p>Email: {user.email}</p>
                </div>
            )}
        </div>
    );
};

export default SearchPage;
