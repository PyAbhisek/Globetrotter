import OnboardingImg from '../assets/onboardingImage.webp'

const Onboarding = () => {
    return (
        <div>
            <div className="bg-[grey] h-screen w-screen flex items-center justify-center">
                <div className=" flex h-[60%] w-[63%] bg-white rounded-[1rem] overflow-hidden">
                    <div className="left w-[60%]">
                        <img src={OnboardingImg} className='w-[100%] h-[100%] object-cover rounded-l-[1rem]' />
                    </div>
                    <div className="right w-[40%] flex flex-col py-[1rem] px-[1.5rem] justify-around">
                        <h1>Welcome to Globetrotter! </h1>
                        <p> Get ready to decode cryptic clues, guess famous destinations, and uncover fascinating facts from around the world. </p>
                        <input type="text" placeholder="Enter Your Name" className="border h-[3.5rem] rounded-[0.4rem] px-2 focus:outline-none focus:ring-0" />
                        <button className="!bg-[#8000FF] text-white h-[3rem] rounded-[0.4rem]" >Submit</button>
                        <a className="text-center cursor-pointer">Skip</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Onboarding
