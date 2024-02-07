import React, { useState } from 'react';

interface SearchBarProps {
    handleSubmit: (search: string) => void;
}

const SearchBar = ({ handleSubmit }: SearchBarProps) => {
    const [searchTerm, setSearchTerm] = useState('')

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value)
    };

    return (
        <div>
            <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Search..."
            />
            <button onClick={() => handleSubmit(searchTerm)}>Search</button>
        </div>
    )
}

export default SearchBar;
