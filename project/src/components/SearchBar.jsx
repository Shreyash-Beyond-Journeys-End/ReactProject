import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <div className="relative flex items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search games..."
          className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
        />
        <button
          type="submit"
          className="absolute right-2 text-gray-500 dark:text-gray-400"
        >
          <FaSearch />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;