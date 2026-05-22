/**
 * Home Page (Landing Page) - Enhanced Professional Design
 */
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: '🎯',
      title: 'AI Career Predictions',
      description: 'Get personalized career recommendations powered by advanced AI algorithms',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    },
    {
      icon: '📝',
      title: 'Smart Skill Assessment',
      description: 'Take domain-specific quizzes and get detailed feedback on your strengths',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
    },
    {
      icon: '🎓',
      title: 'College Recommendations',
      description: 'Find the perfect colleges that match your profile and career goals',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
    },
    {
      icon: '📄',
      title: 'Resume Analysis',
      description: 'Upload your resume for AI-powered insights and job matching',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
    },
    {
      icon: '🗺️',
      title: 'Learning Roadmaps',
      description: 'Get personalized learning paths with curated resources and timelines',
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'bg-gradient-to-br from-indigo-50 to-blue-50',
    },
    {
      icon: '💡',
      title: 'AI-Powered Guidance',
      description: 'Receive intelligent career guidance based on your unique profile',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Students Guided' },
    { value: '500+', label: 'Career Paths' },
    { value: '1,000+', label: 'Colleges' },
    { value: '95%', label: 'Success Rate' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b-2 border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">C</span>
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900">
                Career Guidance AI
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-6 py-3 text-gray-700 hover:text-gray-900 font-bold transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-block mb-6">
            <span className="px-6 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 rounded-full text-sm font-semibold border border-primary-200">
              🚀 AI-Powered Career Intelligence Platform
            </span>
          </div>

          <h2 className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your AI-Powered
            </span>
            <br />
            <span className="text-gray-900">Career Companion</span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed max-w-3xl mx-auto">
            Get personalized career guidance, skill assessments, and learning roadmaps powered by
            <span className="font-bold text-blue-600"> advanced AI technology</span>
          </p>

          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/signup"
                className="px-10 py-5 bg-blue-600 text-white text-lg font-bold rounded-xl hover:bg-blue-700 shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
              >
                Start Your Journey →
              </Link>
              <Link
                to="/login"
                className="px-10 py-5 bg-white text-gray-900 text-lg font-bold rounded-xl hover:bg-gray-50 shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 border-2 border-gray-300"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-20">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-3xl md:text-4xl font-extrabold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-700 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h3>
            <p className="text-xl text-gray-600">
              Everything you need to plan and achieve your career goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${feature.bgColor} p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 group`}
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl">{feature.icon}</span>
                </div>
                <h4 className={`text-2xl font-bold mb-3 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                  {feature.title}
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        {!isAuthenticated && (
          <div className="mt-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-12 md:p-16 text-center shadow-xl">
            <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Ready to Transform Your Career?
            </h3>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto font-medium">
              Join thousands of students who have found their perfect career path with our AI-powered platform
            </p>
            <Link
              to="/signup"
              className="inline-block px-12 py-5 bg-white text-gray-900 text-lg font-bold rounded-xl hover:bg-gray-50 shadow-2xl hover:shadow-3xl transition-all duration-200 transform hover:scale-105"
            >
              Get Started for Free
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">C</span>
                </div>
                <h4 className="text-2xl font-bold">Career Guidance AI</h4>
              </div>
              <p className="text-gray-400">
                Empowering students with AI-powered career guidance and personalized learning paths.
              </p>
            </div>
            <div>
              <h5 className="text-lg font-bold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-bold mb-4">Contact</h5>
              <p className="text-gray-400">
                Have questions? Reach out to us!
                <br />
                <a href="mailto:support@careerguidance.ai" className="hover:text-white transition-colors">
                  support@careerguidance.ai
                </a>
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Career Guidance AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
