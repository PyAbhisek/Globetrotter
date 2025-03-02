import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding = ({ imageUrl, correctScore, incorrectScore, onClose }) => {
    const [showError, setShowError] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [apiRes, setApiRes] = useState({});
    const [showMessage, setShowMessage] = useState(false);
    const navigate = useNavigate();
    const apiBaseUrl = 'https://globetrotter-backend-j5ab.onrender.com';

    const registerUser = async () => {
        if (!userInput) return;
        try {
            let res = await fetch(`${apiBaseUrl}/api/users/register`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: userInput,
                    score: {
                        correctScore: correctScore,
                        incorrectScore: incorrectScore,
                    }
                })
            });
            let data = await res.json();
            setApiRes(data);
            setShowMessage(true);

            if (data.success) {
                inviteFriend(userInput, correctScore, incorrectScore);
            }
        } catch (error) {
            setShowError(true);
        }
    };

    const inviteFriend = (username, correctScore, incorrectScore) => {
        const baseGameUrl = "https://globetrotter-mauve.vercel.app/play";
        const gameLink = `${baseGameUrl}?ref=${encodeURIComponent(username)}`;
        const message = `Hey! I just played Globetrotter.\nMy username: ${username}\nCorrect Answers: ${correctScore}\nIncorrect Answers: ${incorrectScore}\nCan you beat my score? Join me now!\nPlay here: ${gameLink}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
        navigate('/play');
    };

    useEffect(() => {
        let timeOutID = setTimeout(() => {
            setShowError(false);
        }, 2000);
        return () => clearTimeout(timeOutID);
    }, [showError]);

    useEffect(() => {
        if (showMessage) {
            let timeOutID = setTimeout(() => {
                setShowMessage(false);
            }, 1400);
            return () => clearTimeout(timeOutID);
        }
    }, [showMessage]);

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="relative flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden shadow-lg w-full max-w-[90%] md:max-w-[70%] lg:max-w-[60%]">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 !bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-purple-800"
                >
                    <span className="text-lg">×</span>
                </button>

                {/* Image Section */}
                <div className="w-full md:w-1/2">
                    <img 
                        src={imageUrl} 
                        className="w-full h-56 md:h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none" 
                        alt="Onboarding" 
                    />
                </div>

                {/* Content Section */}
                <div className="w-full md:w-1/2 flex flex-col p-6 space-y-4">
                    <h1 className="text-xl font-semibold text-gray-800">Welcome to Globetrotter!</h1>
                    <p className="text-gray-600 text-sm md:text-base">
                        Get ready to decode cryptic clues, guess famous destinations, and uncover fascinating facts from around the world.
                    </p>

                    <input
                        type="text"
                        placeholder="Enter Your Name"
                        style={{ '::placeholder': { color: 'black' } }}
                        className="border rounded-md !border-black  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        onChange={(e) => setUserInput(e.target.value)}
                    />
                    
                    {showMessage && (
                        <div className={`text-center ${apiRes?.success ? "text-green-500" : "text-red-500"}`}>
                            {apiRes?.message}
                        </div>
                    )}

                    <button
                        className="!bg-purple-600 text-white py-2 rounded-md hover:bg-purple-800 transition"
                        onClick={registerUser}
                    >
                        Invite your friend
                    </button>
                </div>
            </div>
            {showError && <p className="text-red-500 text-center mt-2">Something went wrong. Please try again later.</p>}
        </div>
    );
};

export default Onboarding;
