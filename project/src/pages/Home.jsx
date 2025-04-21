import { useState, useEffect } from 'react';
import { getGames } from '../services/api';
import GameCard from '../components/GameCard';
import { 
  FaSearch, 
  FaChevronLeft, 
  FaChevronRight, 
  FaStar, 
  FaFire, 
  FaGamepad, 
  FaFilter, 
  FaChevronDown 
} from 'react-icons/fa';


const PLATFORMS = [
  { value: '4', label: 'PC' },
  { value: '187', label: 'PlayStation 5' },
  { value: '18', label: 'PlayStation 4' },
  { value: '1', label: 'Xbox One' },
  { value: '186', label: 'Xbox Series S/X' },
  { value: '7', label: 'Nintendo Switch' },
  { value: '3', label: 'iOS' },
  { value: '21', label: 'Android' }
];

const GENRES = [
  { value: '4', label: 'Action' },
  { value: '3', label: 'Adventure' },
  { value: '5', label: 'RPG' },
  { value: '2', label: 'Shooter' },
  { value: '7', label: 'Puzzle' },
  { value: '1', label: 'Racing' },
  { value: '15', label: 'Sports' },
  { value: '10', label: 'Strategy' }
];

const Home = () => {
  
  const [games, setGames] = useState([]);
  const [topRatedGames, setTopRatedGames] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [topRatedPage, setTopRatedPage] = useState(1);
  const [newReleasesPage, setNewReleasesPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [topRatedTotalPages, setTopRatedTotalPages] = useState(0);
  const [newReleasesTotalPages, setNewReleasesTotalPages] = useState(0);
  
  const [activeSection, setActiveSection] = useState('all');
  const [filters, setFilters] = useState({
    search: '',
    platforms: '',
    genres: '',
    dates: ''
  });

  
  const fetchGames = async (page = 1, params = {}) => {
    try {
      setLoading(true);
      const queryParams = {
        page: page,
        page_size: 20,
        search: params.search || '',
      };

      if (params.platforms) {
        queryParams.platforms = params.platforms;
      }

      if (params.genres) {
        queryParams.genres = params.genres;
      }

      if (params.dates) {
        const year = params.dates;
        queryParams.dates = `${year}-01-01,${year}-12-31`;
      }

      const response = await getGames(queryParams);
      setGames(response.results);
      setTotalPages(Math.ceil(response.count / 20));
    } catch (err) {
      setError('Failed to fetch games');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopRatedGames = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getGames({
        ordering: '-rating',
        page: page,
        page_size: 20
      });
      setTopRatedGames(response.results);
      setTopRatedTotalPages(Math.ceil(response.count / 20));
    } catch (err) {
      setError('Failed to fetch top rated games');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNewReleases = async (page = 1) => {
    const currentDate = new Date();
    const threeMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 3));
    try {
      setLoading(true);
      const response = await getGames({
        dates: `${threeMonthsAgo.toISOString().split('T')[0]},${new Date().toISOString().split('T')[0]}`,
        ordering: '-released',
        page: page,
        page_size: 20
      });
      setNewReleases(response.results);
      setNewReleasesTotalPages(Math.ceil(response.count / 20));
    } catch (err) {
      setError('Failed to fetch new releases');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setActiveSection('all');
    fetchGames(1, { ...filters });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  
   
    if (name !== 'search') {
      setCurrentPage(1);
      fetchGames(1, {
        ...filters,
        [name]: value
      });
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (section === 'all') {
      setCurrentPage(1);
      fetchGames(1, filters);
    } else if (section === 'topRated') {
      setTopRatedPage(1);
      fetchTopRatedGames(1);
    } else if (section === 'newReleases') {
      setNewReleasesPage(1);
      fetchNewReleases(1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

 
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
      let pages = [];
      
    
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
     
      if (totalPages > 1) {
        pages.push(totalPages);
      }
      
      return pages;
    };

    return (
      <div className="flex justify-center items-center space-x-3 mt-12">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center px-4 py-2 rounded-xl transition-all duration-300 ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
              : 'bg-white text-gray-700 hover:bg-blue-500 hover:text-white dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-blue-600'
          } shadow-md`}
        >
          <FaChevronLeft className="text-lg" />
        </button>

        <div className="flex space-x-2">
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2 py-2 text-gray-500">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-4 py-2 rounded-xl transition-all duration-300 shadow-md ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-500 hover:text-white'
                }`}
              >
                {page}
              </button>
            )
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center px-4 py-2 rounded-xl transition-all duration-300 ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
              : 'bg-white text-gray-700 hover:bg-blue-500 hover:text-white dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-blue-600'
          } shadow-md`}
        >
          <FaChevronRight className="text-lg" />
        </button>
      </div>
    );
  };

  
  useEffect(() => {
    if (activeSection === 'all') {
      fetchGames(currentPage, filters);
    } else if (activeSection === 'topRated') {
      fetchTopRatedGames(topRatedPage);
    } else if (activeSection === 'newReleases') {
      fetchNewReleases(newReleasesPage);
    }
  }, [currentPage, topRatedPage, newReleasesPage, activeSection]);

 
  if (loading && !games.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading amazing games...</p>
      </div>
    );
  }

  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="p-8 bg-red-50 dark:bg-red-900/20 rounded-xl text-center">
          <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
     
      <div className="relative mb-16 text-center py-20 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 animate-gradient"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-float bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
            Discover Amazing Games
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Explore the latest and greatest games across all platforms
          </p>
        </div>
      </div>

     
      <div className="mb-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
        <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto mb-8">
          <div className="relative flex items-center group">
            <input 
              type="text"
              name="search"
              value={filters.search}
              onChange={handleInputChange}
              placeholder="Search your favorite games..."
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700
              focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20
              dark:bg-gray-800/50 text-lg transition-all duration-300 outline-none
              placeholder-gray-400 dark:placeholder-gray-500"
            />
            <button
              type="submit"
              className="absolute right-4 p-3 text-gray-500 dark:text-gray-400 hover:text-blue-500 
              dark:hover:text-blue-400 transition-all duration-200 hover:scale-110 transform
              bg-gray-100 dark:bg-gray-700 rounded-xl"
            >
              <FaSearch className="text-xl" />
            </button>
          </div>
        </form>

        <div className="flex flex-wrap gap-4 justify-center">
          
          <div className="relative min-w-[200px]">
            <select
              name="platforms"
              value={filters.platforms}
              onChange={handleInputChange}
              className="w-full appearance-none px-6 py-3 pr-12 rounded-xl border-2 border-gray-200 
                dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer hover:border-blue-400 
                focus:border-blue-500 focus:outline-none
                transition-all duration-200 text-gray-700 dark:text-gray-300"
            >
              <option value="">All Platforms</option>
              {PLATFORMS.map(platform => (
                <option key={platform.value} value={platform.value}>
                  {platform.label}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <FaChevronDown className="text-gray-400" />
            </div>
          </div>

         
          <div className="relative min-w-[200px]">
            <select
              name="genres"
              value={filters.genres}
              onChange={handleInputChange}
              className="w-full appearance-none px-6 py-3 pr-12 rounded-xl border-2 border-gray-200 
                dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer hover:border-blue-400 
                focus:border-blue-500 focus:outline-none
                transition-all duration-200 text-gray-700 dark:text-gray-300"
            >
              <option value="">All Genres</option>
              {GENRES.map(genre => (
                <option key={genre.value} value={genre.value}>
                  {genre.label}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <FaChevronDown className="text-gray-400" />
            </div>
          </div>

          <div className="relative min-w-[200px]">
            <select
              name="dates"
              value={filters.dates}
              onChange={handleInputChange}
              className="w-full appearance-none px-6 py-3 pr-12 rounded-xl border-2 border-gray-200 
                dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer hover:border-blue-400 
                focus:border-blue-500 focus:outline-none
                transition-all duration-200 text-gray-700 dark:text-gray-300"
            >
              <option value="">All Years</option>
              {[2023, 2022, 2021, 2020].map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <FaChevronDown className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>

     
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {[
          { id: 'all', icon: FaGamepad, label: 'All Games', color: 'from-blue-500 to-blue-600' },
          { id: 'topRated', icon: FaStar, label: 'Top Rated', color: 'from-yellow-500 to-orange-500' },
          { id: 'newReleases', icon: FaFire, label: 'New Releases', color: 'from-red-500 to-pink-500' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => handleSectionChange(tab.id)}
            className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300
            transform hover:scale-105 hover:shadow-lg ${
              activeSection === tab.id 
                ? `bg-gradient-to-r ${tab.color} text-white shadow-xl`
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <tab.icon className={`text-xl ${activeSection === tab.id ? 'animate-bounce' : ''}`} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {(activeSection === 'all' ? games :
          activeSection === 'topRated' ? topRatedGames :
          newReleases
        ).map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

     
      <Pagination 
        currentPage={
          activeSection === 'all' ? currentPage :
          activeSection === 'topRated' ? topRatedPage :
          newReleasesPage
        }
        totalPages={
          activeSection === 'all' ? totalPages :
          activeSection === 'topRated' ? topRatedTotalPages :
          newReleasesTotalPages
        }
        onPageChange={(page) => {
          if (activeSection === 'all') setCurrentPage(page);
          else if (activeSection === 'topRated') setTopRatedPage(page);
          else setNewReleasesPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
};

export default Home;