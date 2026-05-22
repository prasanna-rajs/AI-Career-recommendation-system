/**
 * Quiz Page - Domain-specific skill assessment
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { quizAPI } from '../services/api';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';

const QuizPage = () => {
  const { user, logout } = useAuth();
  const [stage, setStage] = useState('select'); // select, quiz, results
  const [selectedDomain, setSelectedDomain] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Quiz state
  const [quizData, setQuizData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [results, setResults] = useState(null);
  const [showExplanation, setShowExplanation] = useState(null);

  const domains = [
    { value: 'Information Technology', icon: '💻', color: 'bg-blue-50 border-blue-200' },
    { value: 'Healthcare & Medicine', icon: '⚕️', color: 'bg-red-50 border-red-200' },
    { value: 'Design & Creative Arts', icon: '🎨', color: 'bg-purple-50 border-purple-200' },
    { value: 'Engineering', icon: '⚙️', color: 'bg-gray-50 border-gray-200' },
    { value: 'Business & Management', icon: '💼', color: 'bg-green-50 border-green-200' },
    { value: 'Finance & Accounting', icon: '💰', color: 'bg-yellow-50 border-yellow-200' },
  ];

  // Timer effect
  useEffect(() => {
    if (stage === 'quiz' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [stage, timeLeft]);

  const handleGenerateQuiz = async () => {
    if (!selectedDomain) {
      setError('Please select a domain');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await quizAPI.generateQuiz({
        domain: selectedDomain,
        difficulty: difficulty,
        num_questions: 10,
      });

      setQuizData(response);
      setAnswers({});
      setCurrentQuestion(0);
      // Set timer to 2 minutes per question (or 20 minutes total for 10 questions)
      const totalMinutes = response.total_questions * 2;
      setTimeLeft(totalMinutes * 60); // Convert to seconds
      setStage('quiz');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: optionIndex,
    });
  };

  const handleSubmitQuiz = async () => {
    setLoading(true);
    setError('');

    try {
      // Map answers to the format expected by backend
      const formattedAnswers = Object.entries(answers).map(([qIndex, optionIndex]) => {
        const question = quizData.questions[parseInt(qIndex)];
        return {
          question_id: question.question_id,
          selected_answer: question.options[optionIndex], // Send the actual text, not the index
        };
      });

      const response = await quizAPI.submitQuiz({
        quiz_id: quizData.quiz_id,
        user_id: user?.id ? String(user.id) : (user?.username || 'anonymous'),
        answers: formattedAnswers,
      });

      setResults(response);
      setStage('results');
    } catch (err) {
      const detail = err.response?.data?.detail;
      // Handle validation errors
      if (Array.isArray(detail)) {
        const errorMessages = detail.map(error => error.msg || 'Validation error').join(', ');
        setError(errorMessages);
      } else if (typeof detail === 'string') {
        setError(detail);
      } else {
        setError('Failed to submit quiz. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setStage('select');
    setSelectedDomain('');
    setDifficulty('medium');
    setQuizData(null);
    setAnswers({});
    setCurrentQuestion(0);
    setTimeLeft(0);
    setResults(null);
    setError('');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (percentage) => {
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Domain Selection Stage */}
        {stage === 'select' && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Skill Assessment Quiz</h1>
              <p className="text-gray-600">
                Test your knowledge in your domain of interest
              </p>
            </div>

            {error && <Alert type="error" message={error} className="mb-6" />}

            <Card className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Domain</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {domains.map((domain) => (
                  <div
                    key={domain.value}
                    onClick={() => setSelectedDomain(domain.value)}
                    className={`${domain.color} border-2 rounded-lg p-4 cursor-pointer transition hover:shadow-md ${
                      selectedDomain === domain.value ? 'ring-2 ring-primary-500' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">{domain.icon}</span>
                      <span className="font-semibold">{domain.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Difficulty</h2>
              <div className="flex gap-3">
                {['easy', 'medium', 'hard'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                      difficulty === level
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </Card>

            <Button
              onClick={handleGenerateQuiz}
              loading={loading}
              fullWidth
              size="lg"
            >
              Start Quiz
            </Button>
          </div>
        )}

        {/* Quiz Taking Stage */}
        {stage === 'quiz' && quizData && (
          <div>
            {/* Quiz Header */}
            <Card className="mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedDomain} Quiz
                  </h2>
                  <p className="text-gray-600">
                    Question {currentQuestion + 1} of {quizData.questions.length}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Time Remaining</p>
                  <p className={`text-2xl font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatTime(timeLeft)}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestion + 1) / quizData.questions.length) * 100}%`,
                  }}
                ></div>
              </div>
            </Card>

            {error && <Alert type="error" message={error} className="mb-6" />}

            {/* Question Card */}
            <Card className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                {quizData.questions[currentQuestion].question}
              </h3>

              <div className="space-y-3">
                {quizData.questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestion, index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition ${
                      answers[currentQuestion] === index
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-semibold mr-3">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>

              {currentQuestion < quizData.questions.length - 1 ? (
                <Button
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  fullWidth
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmitQuiz}
                  loading={loading}
                  fullWidth
                >
                  Submit Quiz
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Results Stage */}
        {stage === 'results' && results && (
          <div>
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Results</h1>
              <p className="text-gray-600">
                {selectedDomain} - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level
              </p>
            </div>

            {/* Score Card */}
            <Card className="mb-6 text-center">
              <div className="mb-6">
                <div className={`text-6xl font-bold ${getScoreColor(results.performance_percentage)}`}>
                  {Math.round(results.performance_percentage)}%
                </div>
                <p className="text-gray-600 text-lg mt-2">
                  {results.correct_answers} out of {results.total_questions} correct
                </p>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className="bg-primary-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${results.performance_percentage}%` }}
                ></div>
              </div>

              <p className="text-gray-700 text-lg">{results.overall_feedback}</p>
            </Card>

            {/* Detailed Results */}
            {results.feedback && results.feedback.length > 0 && (
              <Card className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Question Review
                </h2>
                <div className="space-y-4">
                  {results.feedback.map((result, index) => (
                    <div
                      key={result.question_id || index}
                      className={`p-4 rounded-lg border-2 ${
                        result.is_correct
                          ? 'border-green-200 bg-green-50'
                          : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-2">
                            {index + 1}. {result.question}
                          </p>
                          <p className="text-sm text-gray-700">
                            Your answer:{' '}
                            <span className={result.is_correct ? 'text-green-700' : 'text-red-700'}>
                              {result.user_answer}
                            </span>
                          </p>
                          {!result.is_correct && (
                            <p className="text-sm text-gray-700">
                              Correct answer:{' '}
                              <span className="text-green-700">{result.correct_answer}</span>
                            </p>
                          )}
                        </div>
                        <div>
                          {result.is_correct ? (
                            <span className="text-2xl">✅</span>
                          ) : (
                            <span className="text-2xl">❌</span>
                          )}
                        </div>
                      </div>
                      {result.explanation && (
                        <div className="mt-3 pt-3 border-t border-gray-300">
                          <button
                            onClick={() =>
                              setShowExplanation(showExplanation === index ? null : index)
                            }
                            className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                          >
                            {showExplanation === index ? 'Hide' : 'Show'} Explanation
                          </button>
                          {showExplanation === index && (
                            <p className="mt-2 text-sm text-gray-700">{result.explanation}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={handleRestart} fullWidth>
                Take Another Quiz
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/dashboard'} fullWidth>
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
