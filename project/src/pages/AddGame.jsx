import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';
import { toast } from 'react-toastify';
import { 
  FaImage, 
  FaGamepad, 
  FaSave, 
  FaTimes, 
  FaCalendar, 
  FaStar, 
  FaTag,
  FaDesktop,
  FaInfoCircle,
  FaTrash
} from 'react-icons/fa';

const AddGame = () => {
  const navigate = useNavigate();
  const { dispatch } = useGameContext();
  const [formData, setFormData] = useState({
    title: '',
    platform: '',
    status: 'Playing',
    releaseDate: '',
    description: '',
    genre: '',
    rating: '',
    publisher: '',
    developer: ''
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const genres = [
    'Action', 'Adventure', 'RPG', 'Strategy', 'Shooter', 
    'Sports', 'Racing', 'Puzzle', 'Horror', 'Other'
  ];

  const platforms = [
    { value: 'PC', label: 'PC' },
    { value: 'PlayStation', label: 'PlayStation' },
    { value: 'Xbox', label: 'Xbox' },
    { value: 'Nintendo', label: 'Nintendo' },
    { value: 'Mobile', label: 'Mobile' }
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.platform) newErrors.platform = 'Platform is required';
    if (!formData.releaseDate) newErrors.releaseDate = 'Release date is required';
    if (!formData.genre) newErrors.genre = 'Genre is required';
    if (formData.rating && (formData.rating < 0 || formData.rating > 5)) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }
    return newErrors;
  };

  const handleImageChange = (file) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) { 
        toast.error('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      setSelectedImage(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageChange(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        let imageUrl = '/default-game-image.jpg';
        
        if (selectedImage) {
          imageUrl = URL.createObjectURL(selectedImage);
        }

        dispatch({
          type: 'ADD_TO_COLLECTION',
          payload: {
            id: Date.now(),
            name: formData.title,
            background_image: imageUrl,
            released: formData.releaseDate,
            rating: parseFloat(formData.rating) || 0,
            ...formData
          }
        });
        toast.success('Game added to collection successfully!');
        navigate('/library');
      } catch (error) {
        console.error('Error adding game:', error);
        toast.error('Failed to add game. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(newErrors);
      toast.error('Please fill in all required fields');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      platform: '',
      status: 'Playing',
      releaseDate: '',
      description: '',
      genre: '',
      rating: '',
      publisher: '',
      developer: ''
    });
    setSelectedImage(null);
    setErrors({});
    toast.info('Form has been reset');
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-t-3xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Add New Game
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Fill in the details to add a new game to your collection
              </p>
            </div>
            <button
              onClick={() => navigate('/library')}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <FaTimes className="text-xl text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
  
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-b-3xl shadow-xl border border-t-0 border-gray-200/50 dark:border-gray-700/50 p-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
           
            <div className="space-y-6">
             
              <div className="form-group">
                <label className="form-label">
                  <FaGamepad className="inline-block mr-2" />
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`form-input ${errors.title ? 'error' : ''}`}
                  placeholder="Enter game title"
                />
                {errors.title && <p className="error-message">{errors.title}</p>}
              </div>
  
            
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">
                    <FaDesktop className="inline-block mr-2" />
                    Platform *
                  </label>
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                    className={`form-select ${errors.platform ? 'error' : ''}`}
                  >
                    <option value="">Select Platform</option>
                    {platforms.map(platform => (
                      <option key={platform.value} value={platform.value}>
                        {platform.label}
                      </option>
                    ))}
                  </select>
                  {errors.platform && <p className="error-message">{errors.platform}</p>}
                </div>
  
                <div className="form-group">
                  <label className="form-label">
                    <FaTag className="inline-block mr-2" />
                    Genre *
                  </label>
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    className={`form-select ${errors.genre ? 'error' : ''}`}
                  >
                    <option value="">Select Genre</option>
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                  {errors.genre && <p className="error-message">{errors.genre}</p>}
                </div>
              </div>
  
          
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">
                    <FaInfoCircle className="inline-block mr-2" />
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="Playing">Playing</option>
                    <option value="Completed">Completed</option>
                    <option value="Backlog">Backlog</option>
                    <option value="Dropped">Dropped</option>
                  </select>
                </div>
  
                <div className="form-group">
                  <label className="form-label">
                    <FaStar className="inline-block mr-2" />
                    Rating
                  </label>
                  <input
                    type="number"
                    name="rating"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleChange}
                    className={`form-input ${errors.rating ? 'error' : ''}`}
                    placeholder="0.0"
                  />
                  {errors.rating && <p className="error-message">{errors.rating}</p>}
                </div>
              </div>
  
             
              <div className="form-group">
                <label className="form-label">
                  <FaCalendar className="inline-block mr-2" />
                  Release Date *
                </label>
                <input
                  type="date"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  className={`form-input ${errors.releaseDate ? 'error' : ''}`}
                />
                {errors.releaseDate && <p className="error-message">{errors.releaseDate}</p>}
              </div>
            </div>
  
           
            <div className="space-y-6">
              
              <div className="form-group">
                <label className="form-label">
                  <FaImage className="inline-block mr-2" />
                  Game Image
                </label>
                <div
                  className={`relative h-48 bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden 
                    border-2 border-dashed transition-all duration-300
                    ${isDragging 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                      : 'border-gray-300 dark:border-gray-600'
                    } ${!selectedImage ? 'hover:border-blue-500 dark:hover:border-blue-400' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !selectedImage && document.getElementById('imageInput').click()}
                >
                  {selectedImage ? (
                    <div className="relative h-full group">
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage();
                          }}
                          className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full 
                            hover:bg-red-600 transition-all duration-300 transform hover:scale-110"
                        >
                          <FaTrash className="text-lg" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                      <FaImage className="text-4xl mb-2" />
                      <span>Click or drag image here</span>
                      <span className="text-sm mt-1">JPG, PNG, GIF up to 5MB</span>
                    </div>
                  )}
                  <input
                    type="file"
                    id="imageInput"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e.target.files[0])}
                  />
                </div>
              </div>
  
            
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="form-textarea"
                  placeholder="Enter game description"
                />
              </div>
            </div>
  
         
            <div className="col-span-full flex gap-4 mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2
                shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Adding Game...</span>
                  </>
                ) : (
                  <>
                    <FaSave className="text-xl" />
                    <span>Add to Collection</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300
                shadow-md hover:shadow-lg"
              >
                Reset Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddGame;