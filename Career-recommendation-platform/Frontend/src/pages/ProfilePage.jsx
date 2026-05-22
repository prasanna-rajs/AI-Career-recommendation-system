/**
 * Profile Page - View and Edit User Profile
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    age: '',
    education_level: '',
    stream: '',
    marks_12th: '',
    college_name: '',
    cgpa: '',
    domain_preference: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        age: user.age || '',
        education_level: user.education_level || '',
        stream: user.stream || '',
        marks_12th: user.marks_12th || '',
        college_name: user.college_name || '',
        cgpa: user.cgpa || '',
        domain_preference: user.domain_preference || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authAPI.updateProfile(formData);
      updateUser(response);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original user data
    setFormData({
      full_name: user.full_name || '',
      email: user.email || '',
      age: user.age || '',
      education_level: user.education_level || '',
      stream: user.stream || '',
      marks_12th: user.marks_12th || '',
      college_name: user.college_name || '',
      cgpa: user.cgpa || '',
      domain_preference: user.domain_preference || '',
    });
    setIsEditing(false);
    setError('');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    );
  }

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
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Link>
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">
            Manage your personal information and preferences
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && <Alert type="success" message={success} className="mb-6" />}
        {error && <Alert type="error" message={error} className="mb-6" />}

        {/* Profile Card */}
        <Card className="mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user.full_name || user.username}
              </h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </div>

          {isEditing ? (
            /* Edit Mode */
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                  />

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Education Level
                    </label>
                    <select
                      name="education_level"
                      value={formData.education_level}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select...</option>
                      <option value="10th">10th</option>
                      <option value="12th">12th</option>
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Stream
                    </label>
                    <select
                      name="stream"
                      value={formData.stream}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select...</option>
                      <option value="MPC">MPC (Math, Physics, Chemistry)</option>
                      <option value="BiPC">BiPC (Biology, Physics, Chemistry)</option>
                      <option value="Commerce">Commerce</option>
                      <option value="Arts">Arts/Humanities</option>
                      <option value="Diploma">Diploma</option>
                    </select>
                  </div>

                  <Input
                    label="12th Marks (%)"
                    name="marks_12th"
                    type="number"
                    step="0.01"
                    value={formData.marks_12th}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="College Name"
                    name="college_name"
                    value={formData.college_name}
                    onChange={handleChange}
                  />

                  <Input
                    label="CGPA"
                    name="cgpa"
                    type="number"
                    step="0.01"
                    value={formData.cgpa}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Domain
                  </label>
                  <select
                    name="domain_preference"
                    value={formData.domain_preference}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Healthcare & Medicine">Healthcare & Medicine</option>
                    <option value="Design & Creative Arts">Design & Creative Arts</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Business & Management">Business & Management</option>
                    <option value="Finance & Accounting">Finance & Accounting</option>
                    <option value="Marketing & Sales">Marketing & Sales</option>
                    <option value="Education & Teaching">Education & Teaching</option>
                    <option value="Law & Legal Services">Law & Legal Services</option>
                    <option value="Science & Research">Science & Research</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    loading={loading}
                    fullWidth
                  >
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancel}
                    disabled={loading}
                    fullWidth
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            /* View Mode */
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <InfoItem label="Age" value={user.age || 'Not specified'} />
                <InfoItem label="Education Level" value={user.education_level || 'Not specified'} />
                <InfoItem label="Stream" value={user.stream || 'Not specified'} />
                <InfoItem label="12th Marks" value={user.marks_12th ? `${user.marks_12th}%` : 'Not specified'} />
                <InfoItem label="College" value={user.college_name || 'Not specified'} />
                <InfoItem label="CGPA" value={user.cgpa || 'Not specified'} />
              </div>
              <InfoItem label="Preferred Domain" value={user.domain_preference || 'Not specified'} />
            </div>
          )}
        </Card>

        {/* Profile Completion Status */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Profile Completion
          </h3>
          <ProfileCompletion user={user} />
        </Card>
      </div>
    </div>
  );
};

// Helper component for displaying info items
const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-sm font-semibold text-gray-500 mb-1">{label}</p>
    <p className="text-gray-900">{value}</p>
  </div>
);

// Helper component for profile completion status
const ProfileCompletion = ({ user }) => {
  const fields = [
    'age',
    'education_level',
    'stream',
    'marks_12th',
    'college_name',
    'cgpa',
    'domain_preference',
  ];

  const completedFields = fields.filter((field) => user[field]).length;
  const percentage = Math.round((completedFields / fields.length) * 100);

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-600">
          {completedFields} of {fields.length} fields completed
        </span>
        <span className="text-sm font-semibold text-primary-600">
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-primary-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProfilePage;
