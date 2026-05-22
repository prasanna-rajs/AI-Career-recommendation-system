/**
 * Learning Roadmap Page - Personalized learning paths
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { careerAPI } from '../services/api';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/LoadingSpinner';

const RoadmapPage = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roadmap, setRoadmap] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const [formData, setFormData] = useState({
    career: '',
    current_skills: '',
    time_commitment: 'medium',
    learning_style: 'practical',
  });

  const careers = [
    'Software Developer',
    'Data Scientist',
    'Web Developer',
    'Machine Learning Engineer',
    'DevOps Engineer',
    'Mobile App Developer',
    'UI/UX Designer',
    'Cloud Architect',
    'Cybersecurity Specialist',
    'Product Manager',
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenerateRoadmap = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRoadmap(null);
    setCompletedSteps(new Set());

    try {
      const response = await careerAPI.generateRoadmap({
        target_career: formData.career,
        current_skills: formData.current_skills.split(',').map(s => s.trim()).filter(s => s),
        time_commitment: formData.time_commitment,
        learning_style: formData.learning_style,
      });

      setRoadmap(response);
    } catch (err) {
      // Handle validation errors from FastAPI
      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        // Format validation errors into readable message
        const errorMessages = detail.map(error => {
          const field = error.loc ? error.loc[error.loc.length - 1] : 'field';
          return `${field}: ${error.msg || 'Validation error'}`;
        }).join(', ');
        setError(errorMessages);
      } else if (typeof detail === 'string') {
        setError(detail);
      } else {
        setError('Failed to generate roadmap. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleStepCompletion = (phaseIndex, stepIndex) => {
    const key = `${phaseIndex}-${stepIndex}`;
    const newCompleted = new Set(completedSteps);

    if (newCompleted.has(key)) {
      newCompleted.delete(key);
    } else {
      newCompleted.add(key);
    }

    setCompletedSteps(newCompleted);
  };

  const getPhaseProgress = (phaseIndex) => {
    const phases = roadmap?.phases || [];
    if (!phases[phaseIndex]?.topics) return 0;

    const totalSteps = phases[phaseIndex].topics.length;
    const completedCount = phases[phaseIndex].topics.filter((_, stepIndex) =>
      completedSteps.has(`${phaseIndex}-${stepIndex}`)
    ).length;

    return Math.round((completedCount / totalSteps) * 100);
  };

  const getTotalProgress = () => {
    const phases = roadmap?.phases || [];
    if (phases.length === 0) return 0;

    const totalSteps = phases.reduce((sum, phase) => sum + (phase.topics?.length || 0), 0);
    const completedCount = completedSteps.size;

    return totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;
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
            Learning Roadmap
          </h1>
          <p className="text-gray-600">
            Get a personalized learning path to achieve your career goals
          </p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Your Learning Goals
              </h2>

              <form onSubmit={handleGenerateRoadmap} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Target Career *
                  </label>
                  <select
                    name="career"
                    value={formData.career}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select a career...</option>
                    {careers.map((career) => (
                      <option key={career} value={career}>
                        {career}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Skills (comma-separated)
                  </label>
                  <textarea
                    name="current_skills"
                    value={formData.current_skills}
                    onChange={handleChange}
                    placeholder="e.g., Python, HTML, CSS"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time Commitment
                  </label>
                  <select
                    name="time_commitment"
                    value={formData.time_commitment}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="light">Light (1-2 hours/day)</option>
                    <option value="medium">Medium (3-4 hours/day)</option>
                    <option value="intensive">Intensive (5+ hours/day)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Learning Style
                  </label>
                  <select
                    name="learning_style"
                    value={formData.learning_style}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="practical">Practical (Hands-on projects)</option>
                    <option value="theoretical">Theoretical (Concept-focused)</option>
                    <option value="balanced">Balanced (Mix of both)</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  fullWidth
                >
                  Generate Roadmap
                </Button>
              </form>
            </Card>

            {roadmap && (
              <Card className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Overall Progress
                </h3>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-primary-600">
                    {getTotalProgress()}%
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {completedSteps.size} steps completed
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${getTotalProgress()}%` }}
                  ></div>
                </div>
              </Card>
            )}
          </div>

          {/* Roadmap Display */}
          <div className="lg:col-span-2">
            {loading ? (
              <Card>
                <LoadingSpinner size="lg" text="Generating your personalized learning roadmap..." />
              </Card>
            ) : roadmap ? (
              <div className="space-y-6">
                {/* Summary */}
                {roadmap.final_outcome && (
                  <Card>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                      Roadmap Overview
                    </h2>
                    <p className="text-gray-700">{roadmap.final_outcome}</p>
                    {roadmap.total_duration && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-900">
                          <strong>Estimated Duration:</strong> {roadmap.total_duration}
                        </p>
                      </div>
                    )}
                  </Card>
                )}

                {/* Roadmap Phases */}
                {roadmap.phases && roadmap.phases.length > 0 && (
                  <div className="space-y-4">
                    {roadmap.phases.map((phase, phaseIndex) => (
                      <Card key={phaseIndex}>
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-gray-900">
                              Phase {phase.phase_number || phaseIndex + 1}: {phase.phase_name}
                            </h3>
                            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                              {getPhaseProgress(phaseIndex)}%
                            </span>
                          </div>
                          {phase.duration && (
                            <p className="text-sm text-gray-600">
                              Duration: {phase.duration}
                            </p>
                          )}
                        </div>

                        {/* Progress Bar for Phase */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                          <div
                            className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${getPhaseProgress(phaseIndex)}%` }}
                          ></div>
                        </div>

                        {/* Topics */}
                        {phase.topics && phase.topics.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Topics to Learn:</h4>
                            <div className="space-y-2">
                              {phase.topics.map((topic, topicIndex) => {
                                const isCompleted = completedSteps.has(`${phaseIndex}-${topicIndex}`);
                                return (
                                  <div
                                    key={topicIndex}
                                    className={`p-3 border-2 rounded-lg transition ${
                                      isCompleted
                                        ? 'border-green-300 bg-green-50'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                                  >
                                    <div className="flex items-center">
                                      <button
                                        onClick={() => toggleStepCompletion(phaseIndex, topicIndex)}
                                        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 transition ${
                                          isCompleted
                                            ? 'border-green-500 bg-green-500'
                                            : 'border-gray-300 hover:border-primary-500'
                                        }`}
                                      >
                                        {isCompleted && (
                                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                        )}
                                      </button>
                                      <span className={`text-sm ${isCompleted ? 'text-green-900 line-through' : 'text-gray-900'}`}>
                                        {topic}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Resources */}
                        {phase.resources && phase.resources.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Resources:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                              {phase.resources.map((resource, resIndex) => (
                                <li key={resIndex}>{resource}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Milestones */}
                        {phase.milestones && phase.milestones.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Milestones:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                              {phase.milestones.map((milestone, mIndex) => (
                                <li key={mIndex}>{milestone}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                )}

                {/* Additional Tips */}
                {roadmap.additional_tips && roadmap.additional_tips.length > 0 && (
                  <Card>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Additional Tips
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {roadmap.additional_tips.map((tip, index) => (
                        <li key={index} className="text-sm">{tip}</li>
                      ))}
                    </ul>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🗺️</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Start Your Learning Journey
                  </h3>
                  <p className="text-gray-600">
                    Fill in your goals and preferences to generate a personalized learning roadmap
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
