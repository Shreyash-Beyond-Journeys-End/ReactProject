import { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import GameCard from '../components/GameCard';
import { FaThList, FaTh, FaGamepad, FaCheck, FaClock, FaSort, FaFilter } from 'react-icons/fa';

const Library = () => {
  const { state } = useGameContext();
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredAndSortedGames = [...state.collection]
    .filter(game => statusFilter === 'all' || game.status === statusFilter)
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'date') return new Date(b.released) - new Date(a.released);
      return 0;
    });

  const StatCard = ({ title, count, icon: Icon, color }) => (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white text-sm font-medium opacity-80">{title}</p>
          <h3 className="text-white text-3xl font-bold mt-1">{count}</h3>
        </div>
        <div className={`p-3 bg-white/20 rounded-xl`}>
          <Icon className="text-white text-xl" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 mb-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
        <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
          My Game Library
        </h1>

       
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Games" 
            count={state.collection.length}
            icon={FaGamepad}
            color="from-blue-500 to-blue-600"
          />
          <StatCard 
            title="Playing" 
            count={state.collection.filter(g => g.status === 'Playing').length}
            icon={FaGamepad}
            color="from-green-500 to-green-600"
          />
          <StatCard 
            title="Completed" 
            count={state.collection.filter(g => g.status === 'Completed').length}
            icon={FaCheck}
            color="from-purple-500 to-purple-600"
          />
          <StatCard 
            title="Backlog" 
            count={state.collection.filter(g => g.status === 'Backlog').length}
            icon={FaClock}
            color="from-orange-500 to-red-500"
          />
        </div>
      </div>

      
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border-2 border-gray-200 
                dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer hover:border-purple-400 
                transition-all duration-200 text-gray-700 dark:text-gray-300"
              >
                <option value="all">All Games</option>
                <option value="Playing">Currently Playing</option>
                <option value="Completed">Completed</option>
                <option value="Backlog">Backlog</option>
              </select>
              <FaFilter className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border-2 border-gray-200 
                dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer hover:border-purple-400 
                transition-all duration-200 text-gray-700 dark:text-gray-300"
              >
                <option value="name">Sort by Name</option>
                <option value="date">Sort by Date</option>
              </select>
              <FaSort className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <button
            onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}
            className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 
            hover:border-purple-400 transition-all duration-200 bg-white dark:bg-gray-800"
          >
            {viewMode === 'grid' ? <FaThList className="text-xl" /> : <FaTh className="text-xl" />}
          </button>
        </div>
      </div>

      
      {filteredAndSortedGames.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <FaGamepad className="text-6xl mx-auto mb-4 text-gray-400 dark:text-gray-600" />
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            {statusFilter === 'all' 
              ? "Your library is empty"
              : `No games in ${statusFilter} status`}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {statusFilter === 'all' 
              ? "Start building your collection by adding some games!"
              : "Try changing the filter to see more games."}
          </p>
        </div>
      )}

      <div className={`
        ${viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "flex flex-col gap-4"
        }
        transition-all duration-300
      `}>
        {filteredAndSortedGames.map(game => (
          <GameCard 
            key={game.id} 
            game={game} 
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
};

export default Library;