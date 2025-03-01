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

            if (data.correct) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 4000);
            } else {
                setShowError(true);
                setTimeout(() => setShowError(false), 1500);
            }

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

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-100 p-4 relative">
            {showConfetti && <Confetti />}

            <div className="border p-6 flex flex-col w-full max-w-2xl bg-white rounded-xl shadow-md overflow-hidden">
                <h1 className="font-semibold text-xl md:text-2xl text-center mb-6 text-[#8000FF]">Guess the Place</h1>

                {question ? (
                    <>
                        <div className="mb-6 bg-gray-50 p-4 rounded-lg border-l-4 border-[#8000FF] shadow-sm">
                            <h3 className="font-medium text-gray-800 mb-2 text-base md:text-lg">Clues:</h3>
                            {question.clues.map((clue, index) => (
                                <div key={index} className="flex items-start mb-2 last:mb-0">
                                    <span className="text-[#8000FF] mr-2 font-bold">•</span>
                                    <p className="text-gray-700 text-sm md:text-base leading-relaxed">{clue}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {question.options.map((option, index) => (
                                <button
                                    key={index}
                                    className={`p-3 rounded-md text-center text-sm md:text-base cursor-pointer transition duration-200 ${
                                        selectedOption === option
                                            ? "!bg-[#8000FF] !text-white"
                                            : "!bg-gray-200 hover:bg-gray-300"
                                    }`}
                                    onClick={() => setSelectedOption(option)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>

                        <div className="mt-6 flex flex-col md:flex-row justify-between gap-4">
                            <button
                                disabled={!selectedOption}
                                className={`px-4 py-2 rounded-md w-full md:w-auto transition duration-200 
                                    ${
                                        selectedOption
                                            ? "!bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                                            : "!bg-gray-400 text-gray-200 cursor-not-allowed"
                                    }`}
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>

                            <button
                                className="!bg-[#8000FF] text-white px-4 py-2 rounded-md w-full md:w-auto transition duration-200 hover:bg-blue-600"
                                onClick={getDestination}
                            >
                                Next Question
                            </button>
                        </div>

                        {showError && (
                            <div className="mt-4 text-center">
                                <p className="text-red-500 text-lg font-medium">Bruh, not it. Try again!</p>
                                <img src={sadEmoji} alt="Sad Emoji" className="w-16 h-16 mx-auto mt-2" />
                            </div>
                        )}

                        {showTrivia && trivia && (
                            <div className="mt-4 bg-yellow-100 p-4 rounded-lg border-l-4 border-yellow-400 shadow-sm">
                                <p className="text-gray-800 text-sm md:text-base">💡 <span className="font-medium">Fun Fact:</span> {trivia}</p>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-center text-gray-600">Loading question...</p>
                )}
            </div>
        </div>
    );
};

export default Game;