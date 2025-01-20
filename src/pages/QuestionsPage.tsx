import React from 'react';
import { useQuestions } from '../hooks/useQuestions';
import { useNavigate } from 'react-router-dom';

const QuestionsPage: React.FC = () => {
  const {
    questions,
    currentIndex,
    setCurrentIndex,
    responses,
    saveResponse,
    submitResponses,
    loading,
    error,
  } = useQuestions();


  const currentQuestion = questions[currentIndex];
  const partNumber = Math.ceil((currentIndex + 1) / 6);
  const questionNumberInPart = (currentIndex % 6) + 1;
  const currentCategory = currentQuestion?.category;

  questions && console.log("Your questions:", questions)

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSaveAndContinue = () => {
    if (currentIndex === questions.length - 1) {
      submitResponses();
    } else {
      handleNext();
    }
  };
  
  if (loading) return <p>Loading questions...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-center">
      {/* (currentIndex + 1) % 6 === 0 && currentIndex < questions.length */}
      
      {currentIndex % 6 === 5  && (
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-green-600 mb-4">
              🎉 Congratulations! You have completed Part {partNumber}.
            </h1>
            <p className="text-lg">You can save and exit or continue to the next part.</p>
          </div>
        )}
      <h1 className="text-2xl font-bold mb-4">Part {partNumber}</h1>
      <h2 className="text-lg font-semibold mb-2">{currentCategory}</h2>
      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-medium">{currentQuestion?.text}</h2>
        <div className="mt-4 space-y-2">
          {currentQuestion?.options.map((option: any, index: any) => (
            <button
              key={index}
              className={`w-full p-2 rounded-lg ${
                responses[currentIndex] === index
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
              onClick={() => saveResponse(currentIndex, index)}
            >
              {String.fromCharCode(65 + index)}. {option}
            </button>
          ))}
        </div>
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={currentIndex === 0}
            onClick={handleBack}
            className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={handleSaveAndContinue}
            className={`px-4 py-2 rounded-lg ${
              currentIndex === questions.length - 1
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 text-white'
            }`}
          >
            {(currentIndex + 1) % 6 === 0 || currentIndex === questions.length - 1
                ? 'Save and Continue'
                : 'Next'}
          </button>
        </div>
        <div className="mt-4">
          <p>
            Question {questionNumberInPart} of 6 (Part {partNumber})
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{
                width: `${((questionNumberInPart) / 6) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;
