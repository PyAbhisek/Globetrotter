import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const Onboarding = ({ imageUrl }) => {
    const [showError, setShowError] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [apiRes, setApiRes] = useState({});
    const [showMessage, setShowMessage] = useState(false);
 

    const handleSubmit = async () => {
        if(!userInput) return
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
        } catch (error) {
            setShowError(true);
        }
    };

    useEffect(() => {
        let timeOutID = setTimeout(() => {
            setShowError(false);
        }, 2000);

        return () => clearTimeout(timeOutID);
    }, []);

    useEffect(() => {
        let timeOutID = setTimeout(() => {
            setShowMessage(false);
        }, 2000);

        return () => clearTimeout(timeOutID);
    }, []);


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
                            {showMessage && <div className={`${apiRes?.status ? "text-green-500" : "text-red-500"} text-center`}>{apiRes?.message}</div>}
                        </div>
                        <button className="!bg-[#8000FF] text-white h-[3rem] rounded-[0.4rem]" onClick={handleSubmit}>
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
