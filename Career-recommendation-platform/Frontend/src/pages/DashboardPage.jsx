/**
 * Main Dashboard Page - Enhanced Professional Design
 */
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  const dashboardCards = [
    {
      title: 'Career Prediction',
      description: 'Get AI-powered career recommendations',
      link: '/career/predict',
      icon: '🎯',
      gradient: 'from-blue-500 to-cyan-500',
      bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    },
    {
      title: 'Take Quiz',
      description: 'Test your skills with domain quizzes',
      link: '/quiz',
      icon: '📝',
      gradient: 'from-green-500 to-emerald-500',
      bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
      iconBg: 'bg-gradient-to-br from-green-500 to-emerald-500',
    },
    {
      title: 'Find Colleges',
      description: 'Discover colleges that match your profile',
      link: '/colleges',
      icon: '🎓',
      gradient: 'from-purple-500 to-pink-500',
      bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
      iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500',
    },
    {
      title: 'Resume Analysis',
      description: 'Upload and analyze your resume',
      link: '/resume',
      icon: '📄',
      gradient: 'from-orange-500 to-red-500',
      bg: 'bg-gradient-to-br from-orange-50 to-red-50',
      iconBg: 'bg-gradient-to-br from-orange-500 to-red-500',
    },
    {
      title: 'Learning Roadmap',
      description: 'Get personalized learning paths',
      link: '/roadmap',
      icon: '🗺️',
      gradient: 'from-indigo-500 to-blue-500',
      bg: 'bg-gradient-to-br from-indigo-50 to-blue-50',
      iconBg: 'bg-gradient-to-br from-indigo-500 to-blue-500',
    },
    {
      title: 'My Profile',
      description: 'View and update your profile',
      link: '/profile',
      icon: '👤',
      gradient: 'from-pink-500 to-rose-500',
      bg: 'bg-gradient-to-br from-pink-50 to-rose-50',
      iconBg: 'bg-gradient-to-br from-pink-500 to-rose-500',
    },
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
              <span className="text-gray-700 font-semibold">
                Welcome, <span className="text-blue-600 font-bold">{user?.full_name || user?.username}</span>
              </span>
              <button
                onClick={logout}
                className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-10 mb-12 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-extrabold mb-3">
                Welcome Back, {user?.full_name || user?.username}! 👋
              </h2>
              <p className="text-xl text-white font-medium">
                Ready to continue your career journey? Choose any option below to get started
              </p>
            </div>
            <div className="hidden md:block text-8xl">
              🚀
            </div>
          </div>
        </div>

        {/* Profile Completion Alert */}
        {!user?.education_level && (
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-8 mb-12 shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0 text-5xl mr-6">
                ⚡
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
                  Complete Your Profile
                </h3>
                <p className="text-gray-800 mb-5 text-lg font-medium">
                  Add your educational details and interests to get better, personalized recommendations
                </p>
                <Link
                  to="/profile/complete"
                  className="inline-block px-8 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Complete Profile Now →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Cards Grid */}
        <div className="mb-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">🎓</span>
            Your Career Tools
          </h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dashboardCards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className={`${card.bg} border-2 border-gray-200 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 hover:border-gray-300 group`}
            >
              <div className={`w-20 h-20 ${card.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                <span className="text-5xl">{card.icon}</span>
              </div>
              <h3 className={`text-2xl font-bold mb-3 bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                {card.title}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {card.description}
              </p>
              <div className="flex items-center text-primary-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                Get Started
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-gray-700">Profile Completion</h4>
              <span className="text-3xl">✨</span>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
              {user?.education_level ? '80%' : '40%'}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-primary-600 to-secondary-600 h-3 rounded-full transition-all duration-500"
                style={{ width: user?.education_level ? '80%' : '40%' }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-gray-700">Tools Available</h4>
              <span className="text-3xl">🛠️</span>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              6
            </div>
            <p className="text-gray-600">Career guidance features</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-gray-700">Get Started</h4>
              <span className="text-3xl">🎯</span>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
              Now
            </div>
            <p className="text-gray-600">Begin your career journey</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
