import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);


    const handleSearch = async () => {
        if (!searchQuery) {
            toast.error("Please enter a search term.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/user/search/${searchQuery}`);
            setSearchResults(response.data.results);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Search error:", error);
            toast.error(error.response?.data?.message || "An error occurred while searching.");
        }
    };

    return (
        <div className="flex justify-center items-start h-screen">
            <div className="search-container text-center mt-10">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border rounded p-2 mb-4 w-64"
                />
                <button onClick={handleSearch} className="bg-blue-500 text-white rounded p-2 mb-4">
                    {loading ? "Searching..." : "Search"}
                </button>

                {searchResults.length > 0 && (
                    <div className="search-results">
                        <h2 className="font-bold">Search Results:</h2>
                        <ul>
                            {searchResults.map((result) => (
                                // <li key={result.id} className="my-2">
                                //     <a href={`/profile/${result.id}`} className="text-blue-600 hover:underline">
                                //         {result.name} {/* Adjust according to your result structure */}
                                //     </a>
                                // </li>
                                //     <div key={user._id}>
                                <div className='flex items-center gap-2'>
                                    <Link to={`/profile/${user?._id}`}>
                                        <Avatar>
                                            <AvatarImage src={user?.profilePicture} alt="post_image" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <div>
                                        <h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
                                        <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here...'}</span>
                                    </div>
                                </div>

                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
