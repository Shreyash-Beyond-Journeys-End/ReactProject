import { useState } from 'react';

const FilterBar = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    platform: '',
    genre: '',
    year: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    onFilter({ ...filters, [name]: value });
  };

  return (
    <div className="flex flex-wrap gap-4 p-4">
      <select
        name="platform"
        value={filters.platform}
        onChange={handleChange}
        className="px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
      >
        <option value="">All Platforms</option>
        <option value="pc">PC</option>
        <option value="playstation">PlayStation</option>
        <option value="xbox">Xbox</option>
        <option value="nintendo">Nintendo</option>
      </select>

      <select
        name="genre"
        value={filters.genre}
        onChange={handleChange}
        className="px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
      >
        <option value="">All Genres</option>
        <option value="action">Action</option>
        <option value="rpg">RPG</option>
        <option value="strategy">Strategy</option>
        <option value="shooter">Shooter</option>
      </select>

      <select
        name="year"
        value={filters.year}
        onChange={handleChange}
        className="px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
      >
        <option value="">All Years</option>
        <option value="2023">2023</option>
        <option value="2022">2022</option>
        <option value="2021">2021</option>
        <option value="2020">2020</option>
      </select>
    </div>
  );
};

export default FilterBar;