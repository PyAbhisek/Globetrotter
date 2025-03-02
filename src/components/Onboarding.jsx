import { useEffect, useState } from 'react';

const Onboarding = ({ imageUrl, correctScore, incorrectScore }) => {
    const [showError, setShowError] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [apiRes, setApiRes] = useState({});
    const [showMessage, setShowMessage] = useState(false);

    const registerUser = async () => {
        if (!userInput) return;
        try {
            let res = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: userInput,
                })
            });
            let data = await res.json();
            setApiRes(data);
            setShowMessage(true);

            if (data.success) {
                await saveResults(userInput);
                inviteFriend(userInput, correctScore, incorrectScore);
            }
        } catch (error) {
            setShowError(true);
        }
    };

    const saveResults = async (userId) => {
        try {
            await fetch('http://localhost:5000/api/results/save', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: userId,
                    score: {
                        correctScore: correctScore,
                        incorrectScore: incorrectScore,
                    }
                })
            });
        } catch (error) {
            console.log(error)
            setShowError(true);
        }
    };

    const inviteFriend = (username, correctScore, incorrectScore) => {
        const baseGameUrl = "http://localhost:5173/play";
        const gameLink = `${baseGameUrl}?ref=${encodeURIComponent(username)}&score=${correctScore}-${incorrectScore}`;
        
        const message = `Hey! I just played Globetrotter.\nMy username: ${username}\nCorrect Answers: ${correctScore}\nIncorrect Answers: ${incorrectScore}\nCan you beat my score? Join me now!\nPlay here: ${gameLink}`;
        
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
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
        <div>
            <div className="fixed inset-0 bg-[grey] h-screen w-screen flex items-center justify-center">
                <div className="flex h-[60%] w-[63%] bg-white rounded-[1rem] overflow-hidden">
                    <div className="left w-[60%]">
                        <img src={imageUrl} className="w-[100%] h-[100%] object-cover rounded-l-[1rem]" alt="Onboarding" />
                    </div>
                    <div className="right w-[40%] flex flex-col py-[1rem] px-[1.5rem] justify-around">
                        <h1>Welcome to Globetrotter!</h1>
                        <p>Get ready to decode cryptic clues, guess famous destinations, and uncover fascinating facts from around the world.</p>

                        <input
                            type="text"
                            placeholder="Enter Your Name"
                            className="border h-[3.5rem] rounded-[0.4rem] px-2 focus:outline-none focus:ring-0"
                            onChange={(e) => setUserInput(e.target.value)}
                        />
                        <div className="h-[5px] flex items-center justify-center">
                            {showMessage && <div className={`${apiRes?.success ? "text-green-500" : "text-red-500"} text-center`}>{apiRes?.message}</div>}
                        </div>
                        <button className="!bg-[#8000FF] text-white h-[3rem] rounded-[0.4rem]" onClick={registerUser}>
                            Invite your friend
                        </button>
                    </div>
                </div>
            </div>
            {showError && <p className="text-red-500 text-center">Something went wrong. Please try again later.</p>}
        </div>
    );
};

export default Onboarding;