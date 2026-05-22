/**
 * Career Prediction Page - AI-powered career recommendations
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { careerAPI } from '../services/api';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';

const CareerPredictPage = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [predictions, setPredictions] = useState(null);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [useProfile, setUseProfile] = useState(true);

  const [formData, setFormData] = useState({
    age: user?.age || '',
    education_level: user?.education_level || '',
    stream: user?.stream || '',
    marks_12th: user?.marks_12th || '',
    cgpa: user?.cgpa || '',
    domain_preference: user?.domain_preference || '',
    skills: '',
    interests: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPredictions(null);

    try {
      // Parse skills and interests from comma-separated strings to arrays
      const parseCommaSeparated = (str) => {
        // Handle already-parsed arrays
        if (Array.isArray(str)) return str.filter(item => item && item.trim() !== '');
        // Handle objects/dicts (convert to array of values or keys)
        if (typeof str === 'object' && str !== null) {
          return Object.values(str).filter(item => item && typeof item === 'string' && item.trim() !== '');
        }
        // Handle strings
        if (!str || typeof str !== 'string' || str.trim() === '') return [];
        return str.split(',').map(item => item.trim()).filter(item => item !== '');
      };

      const userProfile = useProfile && user
        ? {
            user_id: String(user.id || user.username || 'anonymous'),
            age: parseInt(user.age) || 20,
            education_level: user.education_level || 'Undergraduate',
            stream: user.stream || null,
            marks_12th: parseFloat(user.marks_12th) || null,
            cgpa: parseFloat(user.cgpa) || null,
            skills: parseCommaSeparated(formData.skills || user.skills || 'Problem solving, Communication'),
            interests: parseCommaSeparated(formData.interests || user.interests || 'Technology, Innovation'),
            quiz_score: user.quiz_score || null,
          }
        : {
            user_id: String(user?.id || user?.username || 'anonymous'),
            age: parseInt(formData.age) || 20,
            education_level: formData.education_level || 'Undergraduate',
            stream: formData.stream || null,
            marks_12th: parseFloat(formData.marks_12th) || null,
            cgpa: parseFloat(formData.cgpa) || null,
            skills: parseCommaSeparated(formData.skills || 'Problem solving'),
            interests: parseCommaSeparated(formData.interests || 'Technology'),
            quiz_score: null,
          };

      // Backend expects data wrapped in user_profile
      const data = {
        user_profile: userProfile,
        top_n: 3
      };

      const response = await careerAPI.predictCareer(data);
      setPredictions(response);
    } catch (err) {
      // Handle validation errors from FastAPI
      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        // Format validation errors into readable message
        const errorMessages = detail.map(error => error.msg || 'Validation error').join(', ');
        setError(errorMessages);
      } else if (typeof detail === 'string') {
        setError(detail);
      } else {
        setError('Failed to get career predictions. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'bg-green-100 text-green-800 border-green-300';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  const getConfidenceBadge = (confidence) => {
    if (confidence >= 80) return 'High Match';
    if (confidence >= 60) return 'Good Match';
    return 'Potential Match';
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Career Prediction
          </h1>
          <p className="text-gray-600">
            Get AI-powered career recommendations based on your profile
          </p>
        </div>

        {error && <Alert type="error" message={error} className="mb-6" />}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Your Information
              </h2>

              {user && (
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={useProfile}
                      onChange={(e) => setUseProfile(e.target.checked)}
                      className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Use my profile data</span>
                  </label>
                </div>
              )}

              <form onSubmit={handlePredict} className="space-y-4">
                {!useProfile && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Age *
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Education Level *
                      </label>
                      <select
                        name="education_level"
                        value={formData.education_level}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select...</option>
                        <option value="10th">10th</option>
                        <option value="12th">12th</option>
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Postgraduate">Postgraduate</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Stream
                      </label>
                      <select
                        name="stream"
                        value={formData.stream}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select...</option>
                        <option value="MPC">MPC</option>
                        <option value="BiPC">BiPC</option>
                        <option value="Commerce">Commerce</option>
                        <option value="Arts">Arts/Humanities</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Preferred Domain *
                      </label>
                      <select
                        name="domain_preference"
                        value={formData.domain_preference}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select...</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Healthcare & Medicine">Healthcare & Medicine</option>
                        <option value="Design & Creative Arts">Design & Creative Arts</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Business & Management">Business & Management</option>
                        <option value="Finance & Accounting">Finance & Accounting</option>
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Skills (comma-separated)
                  </label>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="e.g., Python, Communication, Problem Solving"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Interests (comma-separated)
                  </label>
                  <textarea
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    placeholder="e.g., Technology, Innovation, Leadership"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  fullWidth
                >
                  Get Career Predictions
                </Button>
              </form>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {loading ? (
              <Card>
                <LoadingSpinner size="lg" text="Analyzing your profile and generating career predictions..." />
              </Card>
            ) : predictions ? (
              <div className="space-y-6">
                <Card>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Your Top Career Matches
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Based on your profile, skills, and interests
                  </p>

                  <div className="space-y-4">
                    {predictions.careers?.slice(0, 5).map((career, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedCareer(career)}
                        className="border-2 border-gray-200 rounded-lg p-5 hover:border-primary-500 hover:shadow-md transition cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {career.career_title || career.career || `Career ${index + 1}`}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {career.description || 'Click to view details'}
                            </p>
                          </div>
                          <div className="ml-4">
                            <div
                              className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getConfidenceColor(
                                career.confidence || 75
                              )}`}
                            >
                              {career.confidence || 75}% Match
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${career.confidence || 75}%` }}
                          ></div>
                        </div>

                        {career.required_skills && (
                          <div className="mt-3">
                            <p className="text-sm font-semibold text-gray-700 mb-2">
                              Key Skills Required:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {career.required_skills.slice(0, 5).map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>

                {predictions.summary && (
                  <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      AI Summary
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{predictions.summary}</p>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Ready to Discover Your Career Path?
                  </h3>
                  <p className="text-gray-600">
                    Fill in your information and click "Get Career Predictions" to get started
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Career Detail Modal */}
      {selectedCareer && (
        <Modal
          isOpen={!!selectedCareer}
          onClose={() => setSelectedCareer(null)}
          title={selectedCareer.career_title || selectedCareer.career}
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-gray-700">
                {selectedCareer.description || 'No description available'}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Match Score</h4>
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary-600 h-3 rounded-full"
                      style={{ width: `${selectedCareer.confidence || 75}%` }}
                    ></div>
                  </div>
                </div>
                <span className="ml-4 font-bold text-primary-600">
                  {selectedCareer.confidence || 75}%
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {getConfidenceBadge(selectedCareer.confidence || 75)}
              </p>
            </div>

            {selectedCareer.required_skills && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCareer.required_skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedCareer.learning_path && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Recommended Learning Path</h4>
                <p className="text-gray-700">{selectedCareer.learning_path}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CareerPredictPage;
