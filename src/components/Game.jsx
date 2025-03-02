import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import sadEmoji from "../assets/sad GIF.gif";
import Onboarding from "./Onboarding";
import { createPortal } from "react-dom";

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
    const [showInviteFriend, setShowInviteFriend] = useState(false);
    const [imageUrl, setImageUrl] = useState('');


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
        if (!selectedOption) return alert("Please select an option before submitting.");
        try {
            let res = await fetch("http://localhost:5000/api/destination/checkDestination", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userInput: selectedOption, alias: question.alias }),
            });

            let data = await res.json();
            setIsCorrect(data.correct);
            setTrivia(data.trivia ? data.trivia[0] : null);
            setShowTrivia(true);

            if (firstAttempt) {
                setQuestionsAttempted(prev => prev + 1);
                data.correct ? setCorrectScore(prev => prev + 1) : setIncorrectScore(prev => prev + 1);
                setCurrentQuestionCounted(true);
            }

            data.correct ? setShowConfetti(true) : setShowError(true);
            setTimeout(() => { setShowConfetti(false); setShowError(false); }, 4000);
            setFirstAttempt(false);
        } catch (error) {
            console.log(error);
            alert("Something went wrong, please try again later.");
        }
    };

    const challengeFriend = () => {
        setShowInviteFriend(true);
    };

    const closeInviteFriend = () => {
        setShowInviteFriend(false);
    };

    useEffect(() => {
        const preloadImage = new Image();
        preloadImage.src = `https://picsum.photos/600/400?random=${Math.random()}`; // Random image
        preloadImage.onload = () => setImageUrl(preloadImage.src);
    }, []);

    useEffect(() => {
        getDestination();
    }, []);

    return (
        <div className="min-h-screen lg:min-w-[80rem] flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
            {showConfetti && <Confetti />}
            <div className="border p-4 sm:p-6 flex flex-col w-full lg:min-w-[50rem] max-w-xl bg-white rounded-xl shadow-md overflow-hidden">
                <h1 className="font-semibold text-lg sm:text-xl text-[#8000FF] text-center">Guess the Place</h1>
                <div className="flex justify-between items-center mt-4">
                    <span className="text-green-600 font-semibold">{correctScore}</span>
                    <span className="text-red-500 font-semibold">{incorrectScore}</span>
                </div>
                {question ? (
                    <>
                        <div className="mt-4 bg-gray-50 p-3 rounded-lg border-l-4 border-[#8000FF] shadow-sm">
                            <h3 className="font-medium text-gray-800">Clues:</h3>
                            {question.clues.map((clue, index) => (
                                <p key={index} className="text-gray-700">• {clue}</p>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                            {question.options.map((option, index) => (
                                <button
                                    key={index}
                                    className={`p-2 rounded-md transition duration-200 ${selectedOption === option ? "!bg-[#8000FF] text-white" : "!bg-gray-200 hover:bg-gray-300"}`}
                                    onClick={() => setSelectedOption(option)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        <div className="mt-4 flex flex-col sm:flex-row justify-between gap-3">
                            <button className="!bg-green-500 text-white px-4 py-2 rounded-md w-full hover:bg-green-600" onClick={checkDestination}>
                                Submit
                            </button>
                            <button className="!bg-[#8000FF] text-white px-4 py-2 rounded-md w-full hover:bg-blue-600" onClick={getDestination}>
                                Next Question
                            </button>
                        </div>
                        <div className="mt-4 flex flex-col sm:flex-row justify-between gap-3">
                            <button className="!bg-red-500 text-white px-4 py-2 rounded-md w-full hover:bg-red-600" onClick={challengeFriend}>
                                Challenge a Friend
                            </button>
                        </div>

                        {showError && (
                            <div className="mt-3 text-center">
                                <p className="text-red-500">Bruh, not it. Try again!</p>
                                <img src={sadEmoji} alt="Sad Emoji" className="w-12 mx-auto mt-2" />
                            </div>
                        )}
                        {showConfetti && (
                            <div className="mt-3 text-center">
                                <p className="text-green-500">Awesome you got it correct!!!!</p>
                            </div>
                        )}
                        {showTrivia && trivia && (
                            <div className="mt-3 bg-yellow-100 p-3 rounded-lg border-l-4 border-yellow-400">
                                <p>💡 <span className="font-medium">Fun Fact:</span> {trivia}</p>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-center text-gray-600">Loading question...</p>
                )}
            </div>

            {/* Render the Onboarding popup using createPortal to ensure it renders above everything else */}
            {showInviteFriend && createPortal(
                <Onboarding  imageUrl={imageUrl}  onClose={closeInviteFriend} />,
                document.body
            )}
        </div>
    );
};

export default Game;