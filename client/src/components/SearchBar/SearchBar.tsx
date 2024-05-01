import React from 'react';
import './SearchBar.scss'

interface SearchBarProps {
    searchTerm: string;
    type: 'text' | 'number' | 'email';
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar = ({ searchTerm, type, handleInputChange }: SearchBarProps) => {

    return (
        <div className='search-bar'>
            <input
                className='search-bar__input'
                type={type}
                value={searchTerm}
                onChange={handleInputChange}
            />
        </div>
    )
}

export default SearchBar;
