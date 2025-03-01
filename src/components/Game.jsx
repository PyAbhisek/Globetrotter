import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import sadEmoji from "../assets/sad GIF.gif";

const Game = () => {
    const [question, setQuestion] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showError, setShowError] = useState(false);
    const [trivia, setTrivia] = useState(null);
    const [showTrivia, setShowTrivia] = useState(false);
    const [correctScore, setCorrectScore] = useState(0);
    const [incorrectScore, setIncorrectScore] = useState(0);
    const [questionsAttempted, setQuestionsAttempted] = useState(0);
    const [firstAttempt, setFirstAttempt] = useState(true);
    const [currentQuestionCounted, setCurrentQuestionCounted] = useState(false);

    const getDestination = async () => {
        try {
            let res = await fetch("http://localhost:5000/api/destination");
            let data = await res.json();
            setQuestion(data);
            setSelectedOption(null);
            setIsCorrect(null);
            setShowConfetti(false);
            setShowError(false);
            setShowTrivia(false);
            setTrivia(null);
            setFirstAttempt(true);
            setCurrentQuestionCounted(false);
        } catch (error) {
            console.log(error);
            alert("Something went wrong, please try again later.");
        }
    };

    const checkDestination = async () => {
        try {
            let res = await fetch("http://localhost:5000/api/destination/checkDestination", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userInput: selectedOption,
                    alias: question.alias,
                }),
            });

            let data = await res.json();
            console.log("trivia:", data.trivia);

            setIsCorrect(data.correct);
            setTrivia(data.trivia ? data.trivia[0] : null);
            setShowTrivia(true);

            // Increment questions attempted only on first attempt
            if (firstAttempt) {
                setQuestionsAttempted(prev => prev + 1);

                // Track correct and incorrect scores
                if (data.correct) {
                    setCorrectScore(prev => prev + 1);
                } else {
                    setIncorrectScore(prev => prev + 1);
                }

                setCurrentQuestionCounted(true);
            }

            if (data.correct) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 4000);
            } else {
                setShowError(true);
                setTimeout(() => setShowError(false), 1500);
            }

            // No longer first attempt after this
            setFirstAttempt(false);

            // setTimeout(() => setShowTrivia(false), 6000);        
        } catch (error) {
            console.log(error);
            alert("Something went wrong, please try again later.");
        }
    };

    useEffect(() => {
        getDestination();
    }, []);

    const handleSubmit = () => {
        if (selectedOption) {
            checkDestination();
        } else {
            alert("Please select an option before submitting.");
        }
    };

    // const resetGame = () => {
    //     setCorrectScore(0);
    //     setIncorrectScore(0);
    //     setQuestionsAttempted(0);
    //     getDestination();
    // };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-3 sm:p-4 relative">
            {showConfetti && <Confetti />}

            <div className="border p-4 sm:p-6 flex flex-col w-full max-w-xl bg-white rounded-xl shadow-md overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2">
                    <h1 className="font-semibold text-lg sm:text-xl md:text-2xl text-[#8000FF] text-center sm:text-left">Guess the Place</h1>
                    <div className="flex items-center bg-gray-100 px-4 py-2 sm:px-5 sm:py-3 rounded-xl shadow-md self-center sm:self-auto">
                        <div className="flex items-baseline space-x-1 sm:space-x-2">
                            <span className="text-[1.5rem] !sm:text-[0.1rem] font-semibold text-green-600 ">{correctScore}</span>
                            <span className="border h-[3vh]"></span>
                            <span className=" text-[1.5rem] !sm:text-[0.1rem] font-semibold text-red-500">{incorrectScore}</span>
                        </div>
                        {/* <div className="ml-3 text-xs sm:text-sm text-gray-600">Correct / </div> */}
                    </div>

                </div>

                {question ? (
                    <>
                        <div className="mb-4 sm:mb-6 bg-gray-50 p-3 sm:p-4 rounded-lg border-l-4 border-[#8000FF] shadow-sm">
                            <h3 className="font-medium text-gray-800 mb-2 text-sm sm:text-base md:text-lg">Clues:</h3>
                            {question.clues.map((clue, index) => (
                                <div key={index} className="flex items-start mb-2 last:mb-0">
                                    <span className="text-[#8000FF] mr-2 font-bold">•</span>
                                    <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed">{clue}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            {question.options.map((option, index) => (
                                <button
                                    key={index}
                                    className={`p-2 sm:p-3 rounded-md text-center text-xs sm:text-sm md:text-base cursor-pointer transition duration-200 ${selectedOption === option
                                            ? "!bg-[#8000FF] !text-white"
                                            : "!bg-gray-200 hover:bg-gray-300"
                                        }`}
                                    onClick={() => setSelectedOption(option)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>

                        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
                            <button
                                disabled={!selectedOption}
                                className={`px-3 sm:px-4 py-2 rounded-md w-full transition duration-200 text-sm sm:text-base
                                    ${selectedOption
                                        ? "!bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                                        : "!bg-gray-400 text-gray-200 cursor-not-allowed"
                                    }`}
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>

                            <button
                                className="!bg-[#8000FF] text-white px-3 sm:px-4 py-2 rounded-md w-full transition duration-200 hover:bg-blue-600 text-sm sm:text-base"
                                onClick={getDestination}
                            >
                                Next Question
                            </button>
                        </div>

                        {/* <div className="mt-3 sm:mt-4 flex justify-end">
                            <button
                                className="text-gray-500 text-xs sm:text-sm underline hover:text-gray-700"
                                onClick={resetGame}
                            >
                                Reset Score
                            </button>
                        </div> */}

                        {showError && (
                            <div className="mt-3 sm:mt-4 text-center">
                                <p className="text-red-500 text-base sm:text-lg font-medium">Bruh, not it. Try again!</p>
                                <img src={sadEmoji} alt="Sad Emoji" className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mt-2" />
                            </div>
                        )}

                        {showTrivia && trivia && (
                            <div className="mt-3 sm:mt-4 bg-yellow-100 p-3 sm:p-4 rounded-lg border-l-4 border-yellow-400 shadow-sm">
                                <p className="text-gray-800 text-xs sm:text-sm md:text-base">
                                    💡 <span className="font-medium">Fun Fact:</span> {trivia}
                                </p>
                            </div>
                        )}

                        {!firstAttempt && !isCorrect && (
                            <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-gray-500">
                                <p>Keep trying! Only your first attempt counts toward your score.</p>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-center text-gray-600 text-sm sm:text-base">Loading question...</p>
                )}
            </div>
        </div>
    );
};

export default Game;