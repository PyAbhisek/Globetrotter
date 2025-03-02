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
    const [friendScore, setFriendScore] = useState({ correctScore: 0, incorrectScore: 0 });
    const [friendName, setFriendName] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const getDestination = async () => {
        setIsLoading(true);
        try {
            let res = await fetch("https://globetrotter-backend-j5ab.onrender.com/api/destination");
            if (!res.ok) {
                throw new Error(`API responded with status: ${res.status}`);
            }
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
            console.error("Error fetching destination:", error);
            alert("Something went wrong, please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const getScore = async (referralId) => {
        if (!referralId) {
            console.log("No referral ID found.");
            return;
        }
        try {
            let res = await fetch(`https://globetrotter-backend-j5ab.onrender.com/api/users/getscore?username=${encodeURIComponent(referralId)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                throw new Error(`API responded with status: ${res.status}`);
            }

            let data = await res.json();
            console.log("Friend score data:", data);
            
            // Based on the error message, it seems data directly contains correctScore and incorrectScore
            // Instead of being nested under a 'score' property
            if (data && typeof data.correctScore === 'number' && typeof data.incorrectScore === 'number') {
                setFriendScore({
                    correctScore: data.correctScore,
                    incorrectScore: data.incorrectScore
                });
            } else if (data && data.scores && typeof data.scores === 'object') {
                // Alternative format: if scores are in a 'scores' property
                setFriendScore({
                    correctScore: data.scores.correctScore || 0,
                    incorrectScore: data.scores.incorrectScore || 0
                });
            } else {
                console.warn("Unexpected score format received:", data);
                setFriendScore({ correctScore: 0, incorrectScore: 0 });
            }
        } catch (error) {
            console.error("Error fetching score:", error);
            // Set default values to prevent UI from breaking
            setFriendScore({ correctScore: 0, incorrectScore: 0 });
        }
    };

    const checkRefer = () => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const referralId = urlParams.get('ref');

            console.log("Referral ID:", referralId);

            if (referralId) {
                setFriendName(referralId);
                getScore(referralId);
            }
        } catch (error) {
            console.error("Error checking referral:", error);
        }
    };

    // Initialize component without waiting for API responses
    useEffect(() => {
        // First load the question
        getDestination();
        // Then check for referrals, but don't block rendering
        checkRefer();
        
        // Preload a random image
        const preloadImage = new Image();
        preloadImage.src = `https://picsum.photos/600/400?random=${Math.random()}`;
        preloadImage.onload = () => setImageUrl(preloadImage.src);
    }, []);

    const checkDestination = async () => {
        if (!selectedOption) {
            alert("Please select an option before submitting.");
            return;
        }
        
        try {
            let res = await fetch("https://globetrotter-backend-j5ab.onrender.com/api/destination/checkDestination", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userInput: selectedOption, alias: question.alias }),
            });

            if (!res.ok) {
                throw new Error(`API responded with status: ${res.status}`);
            }

            let data = await res.json();
            setIsCorrect(data.correct);
            setTrivia(data.trivia && data.trivia.length > 0 ? data.trivia[0] : null);
            setShowTrivia(true);

            if (firstAttempt && !currentQuestionCounted) {
                setQuestionsAttempted(prev => prev + 1);
                data.correct ? setCorrectScore(prev => prev + 1) : setIncorrectScore(prev => prev + 1);
                setCurrentQuestionCounted(true);
            }

            data.correct ? setShowConfetti(true) : setShowError(true);
            setTimeout(() => { 
                setShowConfetti(false); 
                setShowError(false); 
            }, 4000);
            
            setFirstAttempt(false);
        } catch (error) {
            console.error("Error checking destination:", error);
            alert("Something went wrong, please try again later.");
        }
    };

    const challengeFriend = () => {
        setShowInviteFriend(true);
    };

    const closeInviteFriend = () => {
        setShowInviteFriend(false);
    };

    return (
        <div className="min-h-screen lg:min-w-[80rem] flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
            {showConfetti && <Confetti />}
            <div className="border p-4 sm:p-6 flex flex-col w-full lg:min-w-[50rem] max-w-xl bg-white rounded-xl shadow-md overflow-hidden">
                <h1 className="font-semibold text-lg sm:text-xl text-[#8000FF] text-center">Guess the Place</h1>
                
                {/* Friend score section with proper error handling */}
                {friendName && (
                    <div className="mt-2 text-sm text-gray-600 text-center bg-gray-50 p-2 rounded-lg">
                        Beat {friendName}'s Score: Correct - {friendScore?.correctScore || 0}, 
                        Incorrect - {friendScore?.incorrectScore || 0}
                    </div>
                )}
                
                <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center">
                        <span className="text-green-600 font-semibold text-lg">✓ {correctScore}</span>
                        <span className="text-xs text-gray-500 ml-1">correct</span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-red-500 font-semibold text-lg">✗ {incorrectScore}</span>
                        <span className="text-xs text-gray-500 ml-1">incorrect</span>
                    </div>
                </div>
                
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8000FF]"></div>
                    </div>
                ) : question ? (
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
                            <button 
                                className="!bg-green-500 text-white px-4 py-2 rounded-md w-full hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed" 
                                onClick={checkDestination}
                                disabled={!selectedOption}
                            >
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
                    <div className="text-center text-gray-600 p-10">
                        <p>Could not load question. Please try again.</p>
                        <button 
                            className="mt-4 !bg-[#8000FF] text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            onClick={getDestination}
                        >
                            Retry
                        </button>
                    </div>
                )}
            </div>

            {/* Render the Onboarding popup using createPortal to ensure it renders above everything else */}
            {showInviteFriend && createPortal(
                <Onboarding
                    correctScore={correctScore}
                    incorrectScore={incorrectScore}
                    imageUrl={imageUrl}
                    onClose={closeInviteFriend} />,
                document.body
            )}
        </div>
    );
};

export default Game;