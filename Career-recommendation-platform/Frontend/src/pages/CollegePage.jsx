/**
 * College Search Page - Find and compare colleges
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collegeAPI } from '../services/api';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';

const CollegePage = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    state: '',
    type: '',
    min_fees: '',
    max_fees: '',
  });
  const [states, setStates] = useState([]);
  const [types, setTypes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Load initial data
  useEffect(() => {
    loadColleges();
    loadFiltersData();
  }, []);

  const loadFiltersData = async () => {
    try {
      const [statesData, typesData] = await Promise.all([
        collegeAPI.getStates(),
        collegeAPI.getCollegeTypes(),
      ]);
      setStates(statesData);
      setTypes(typesData);
    } catch (err) {
      console.error('Failed to load filter data:', err);
    }
  };

  const loadColleges = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await collegeAPI.getAllColleges({ limit: 50 });
      setColleges(response);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load colleges. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadColleges();
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await collegeAPI.searchColleges(searchQuery);
      setColleges(response);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to search colleges. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    setLoading(true);
    setError('');

    try {
      const filterData = {};
      if (filters.state) filterData.state = filters.state;
      if (filters.type) filterData.college_type = filters.type;
      if (filters.min_fees) filterData.min_fees = parseFloat(filters.min_fees);
      if (filters.max_fees) filterData.max_fees = parseFloat(filters.max_fees);

      const response = await collegeAPI.filterColleges(filterData);
      setColleges(response);
      setShowFilters(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to filter colleges. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      state: '',
      type: '',
      min_fees: '',
      max_fees: '',
    });
    loadColleges();
  };

  const handleViewDetails = async (collegeId) => {
    try {
      const response = await collegeAPI.getCollegeById(collegeId);
      setSelectedCollege(response);
    } catch (err) {
      setError('Failed to load college details');
    }
  };

  const formatFees = (fees) => {
    if (!fees) return 'Not available';
    return `₹${fees.toLocaleString('en-IN')} per year`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/dashboard" className="text-2xl font-bold text-primary-700">
              Career Guidance AI
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {user?.full_name || user?.username}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Perfect College
          </h1>
          <p className="text-gray-600">
            Search and compare colleges across India
          </p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />}

        {/* Search and Filter Section */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search colleges by name, location, or program..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button onClick={handleSearch} loading={loading}>
                  Search
                </Button>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State
                  </label>
                  <select
                    value={filters.state}
                    onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All States</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Types</option>
                    {types.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Min Fees (₹)
                  </label>
                  <input
                    type="number"
                    value={filters.min_fees}
                    onChange={(e) => setFilters({ ...filters, min_fees: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Max Fees (₹)
                  </label>
                  <input
                    type="number"
                    value={filters.max_fees}
                    onChange={(e) => setFilters({ ...filters, max_fees: e.target.value })}
                    placeholder="1000000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button onClick={handleFilter} loading={loading}>
                  Apply Filters
                </Button>
                <Button variant="secondary" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Results Count */}
        {colleges.length > 0 && (
          <div className="mb-4">
            <p className="text-gray-600">
              Found <span className="font-semibold">{colleges.length}</span> colleges
            </p>
          </div>
        )}

        {/* Colleges Grid */}
        {loading ? (
          <Card>
            <LoadingSpinner size="lg" text="Loading colleges..." />
          </Card>
        ) : colleges.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college) => (
              <Card
                key={college.id}
                hoverable
                onClick={() => handleViewDetails(college.id)}
                className="cursor-pointer"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {college.name}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {college.location || college.state}
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-semibold text-gray-900">{college.college_type || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Fees:</span>
                    <span className="font-semibold text-gray-900">
                      {formatFees(college.fees_per_year)}
                    </span>
                  </div>
                  {college.rating && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Rating:</span>
                      <span className="font-semibold text-yellow-600">
                        ⭐ {college.rating}/5
                      </span>
                    </div>
                  )}
                </div>

                {college.programs_offered && college.programs_offered.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Programs:</p>
                    <div className="flex flex-wrap gap-1">
                      {college.programs_offered.slice(0, 3).map((program, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                        >
                          {program}
                        </span>
                      ))}
                      {college.programs_offered.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          +{college.programs_offered.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Colleges Found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filters
              </p>
              <Button onClick={loadColleges}>
                View All Colleges
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* College Detail Modal */}
      {selectedCollege && (
        <Modal
          isOpen={!!selectedCollege}
          onClose={() => setSelectedCollege(null)}
          title={selectedCollege.name}
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Location</p>
                <p className="text-gray-900">{selectedCollege.location || selectedCollege.state}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Type</p>
                <p className="text-gray-900">{selectedCollege.college_type || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Fees Per Year</p>
                <p className="text-gray-900">{formatFees(selectedCollege.fees_per_year)}</p>
              </div>
              {selectedCollege.rating && (
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Rating</p>
                  <p className="text-gray-900">⭐ {selectedCollege.rating}/5</p>
                </div>
              )}
            </div>

            {selectedCollege.programs_offered && selectedCollege.programs_offered.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">Programs Offered</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCollege.programs_offered.map((program, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                    >
                      {program}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedCollege.description && (
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">About</p>
                <p className="text-gray-700">{selectedCollege.description}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CollegePage;
