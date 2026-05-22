/**
 * Resume Analysis Page - Upload and analyze resumes
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resumeAPI } from '../services/api';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ResumePage = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Analysis results
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [jobMatching, setJobMatching] = useState(null);
  const [skillGap, setSkillGap] = useState(null);

  // Job description for matching
  const [jobDescription, setJobDescription] = useState('');
  const [showJobMatch, setShowJobMatch] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setError('');
    setSuccess('');
  };

  const handleUploadResume = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await resumeAPI.uploadResume(formData);
      setResumeAnalysis(response);
      setSuccess('Resume uploaded and analyzed successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJobMatch = async () => {
    if (!resumeAnalysis) {
      setError('Please upload and analyze a resume first');
      return;
    }

    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create resume summary from the analysis
      const resumeSummary = resumeAnalysis.summary?.summary ||
        JSON.stringify(resumeAnalysis.summary) ||
        'Resume analyzed';

      // Match job with resume summary
      const response = await resumeAPI.matchJob({
        resume_summary: resumeSummary,
        job_description: jobDescription,
      });
      setJobMatching(response);

      // Also analyze skill gap if we have skills
      const skills = resumeAnalysis.skills ||
        resumeAnalysis.summary?.key_skills ||
        resumeAnalysis.summary?.technical_skills ||
        [];

      if (skills.length > 0) {
        const gapResponse = await resumeAPI.analyzeSkillGap({
          resume_summary: resumeSummary,
          job_description: jobDescription,
        });
        setSkillGap(gapResponse);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to match job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResumeAnalysis(null);
    setJobMatching(null);
    setSkillGap(null);
    setJobDescription('');
    setShowJobMatch(false);
    setError('');
    setSuccess('');
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
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
            Resume Analysis
          </h1>
          <p className="text-gray-600">
            Upload your resume to get AI-powered insights and job matching
          </p>
        </div>

        {success && <Alert type="success" message={success} className="mb-6" />}
        {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Upload Resume
              </h2>

              {/* Drag and Drop Area */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
                  dragActive
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="mb-4">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>

                {selectedFile ? (
                  <div className="mb-4">
                    <p className="text-green-600 font-semibold mb-2">✓ File selected</p>
                    <p className="text-gray-700">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="mt-2 text-sm text-red-600 hover:text-red-700"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-700 mb-2">
                      Drag and drop your resume here, or
                    </p>
                    <label className="cursor-pointer">
                      <span className="text-primary-600 hover:text-primary-700 font-semibold">
                        browse files
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      Supported formats: PDF, DOCX (Max 5MB)
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-3">
                <Button
                  onClick={handleUploadResume}
                  loading={loading}
                  disabled={!selectedFile}
                  fullWidth
                >
                  Analyze Resume
                </Button>

                {resumeAnalysis && (
                  <Button
                    variant="outline"
                    onClick={() => setShowJobMatch(!showJobMatch)}
                    fullWidth
                  >
                    {showJobMatch ? 'Hide Job Matching' : 'Match with Job Description'}
                  </Button>
                )}

                {(resumeAnalysis || jobMatching) && (
                  <Button
                    variant="secondary"
                    onClick={handleReset}
                    fullWidth
                  >
                    Upload New Resume
                  </Button>
                )}
              </div>
            </Card>

            {/* Job Matching Input */}
            {showJobMatch && (
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Job Description
                </h2>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  rows="8"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button
                  onClick={handleJobMatch}
                  loading={loading}
                  disabled={!jobDescription.trim()}
                  fullWidth
                  className="mt-4"
                >
                  Analyze Job Match
                </Button>
              </Card>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {loading && !resumeAnalysis && !jobMatching ? (
              <Card>
                <LoadingSpinner size="lg" text="Analyzing your resume..." />
              </Card>
            ) : resumeAnalysis || jobMatching ? (
              <>
                {/* Resume Analysis Results */}
                {resumeAnalysis && (
                  <Card>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Resume Analysis
                    </h2>

                    {/* Summary */}
                    {resumeAnalysis.summary?.summary && typeof resumeAnalysis.summary.summary === 'string' && (
                      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Summary</h4>
                        <p className="text-sm text-blue-900">{resumeAnalysis.summary.summary}</p>
                      </div>
                    )}

                    {/* Education */}
                    {resumeAnalysis.summary?.education && Array.isArray(resumeAnalysis.summary.education) && resumeAnalysis.summary.education.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Education</h4>
                        <div className="space-y-2">
                          {resumeAnalysis.summary.education.map((edu, idx) => (
                            <div key={idx} className="text-sm text-gray-700">
                              <p className="font-medium">{edu.degree}</p>
                              <p className="text-gray-600">{edu.institution} {edu.year && `(${edu.year})`}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Work Experience */}
                    {resumeAnalysis.summary?.work_experience && Array.isArray(resumeAnalysis.summary.work_experience) && resumeAnalysis.summary.work_experience.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Work Experience</h4>
                        <div className="space-y-3">
                          {resumeAnalysis.summary.work_experience.map((exp, idx) => (
                            <div key={idx} className="text-sm text-gray-700">
                              <p className="font-medium">{exp.title}</p>
                              <p className="text-gray-600">{exp.company} {exp.duration && `(${exp.duration})`}</p>
                              {exp.responsibilities && Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 && (
                                <ul className="list-disc list-inside ml-2 mt-1 text-gray-600">
                                  {exp.responsibilities.slice(0, 3).map((resp, ridx) => (
                                    <li key={ridx} className="text-xs">{resp}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Technical Skills */}
                    {resumeAnalysis.summary?.technical_skills && Array.isArray(resumeAnalysis.summary.technical_skills) && resumeAnalysis.summary.technical_skills.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Technical Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {resumeAnalysis.summary.technical_skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Soft Skills */}
                    {resumeAnalysis.summary?.soft_skills && Array.isArray(resumeAnalysis.summary.soft_skills) && resumeAnalysis.summary.soft_skills.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Soft Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {resumeAnalysis.summary.soft_skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Skills (fallback if using the skills field) */}
                    {resumeAnalysis.skills && Array.isArray(resumeAnalysis.skills) && resumeAnalysis.skills.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Key Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {resumeAnalysis.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {resumeAnalysis.summary?.projects && Array.isArray(resumeAnalysis.summary.projects) && resumeAnalysis.summary.projects.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Projects</h4>
                        <div className="space-y-2">
                          {resumeAnalysis.summary.projects.map((proj, idx) => (
                            <div key={idx} className="text-sm text-gray-700">
                              <p className="font-medium">{proj.title}</p>
                              <p className="text-gray-600">{proj.description}</p>
                              {proj.technologies && Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {proj.technologies.map((tech, tidx) => (
                                    <span key={tidx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Certifications */}
                    {resumeAnalysis.summary?.certifications && Array.isArray(resumeAnalysis.summary.certifications) && resumeAnalysis.summary.certifications.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Certifications</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {resumeAnalysis.summary.certifications.map((cert, idx) => (
                            <li key={idx} className="text-sm">{cert}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Card>
                )}

                {/* Job Matching Results */}
                {jobMatching && (
                  <Card>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Job Match Analysis
                    </h2>

                    <div className="text-center mb-6">
                      <div className={`text-5xl font-bold mb-2 ${getMatchColor(jobMatching.match_percentage || 0)}`}>
                        {jobMatching.match_percentage || 0}%
                      </div>
                      <p className="text-gray-600">Match Score</p>
                      <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                        <div
                          className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${jobMatching.match_percentage || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    {jobMatching.feedback && (
                      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-900">{jobMatching.feedback}</p>
                      </div>
                    )}

                    {jobMatching.matching_skills && jobMatching.matching_skills.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Matching Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {jobMatching.matching_skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                            >
                              ✓ {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                )}

                {/* Skill Gap Analysis */}
                {skillGap && (
                  <Card>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Skill Gap Analysis
                    </h2>

                    {skillGap.missing_skills && skillGap.missing_skills.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Skills to Develop</h4>
                        <div className="flex flex-wrap gap-2">
                          {skillGap.missing_skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {skillGap.recommendations && skillGap.recommendations.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Recommendations</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {skillGap.recommendations.map((rec, idx) => (
                            <li key={idx} className="text-sm">{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📄</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Upload Your Resume
                  </h3>
                  <p className="text-gray-600">
                    Get AI-powered insights, skill analysis, and job matching
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

export default ResumePage;
