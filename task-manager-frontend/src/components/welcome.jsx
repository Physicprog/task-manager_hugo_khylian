import React from "react";
import { useNavigate } from "react-router-dom";

export default function Welcome({ userInfos, onLoginClick }) {
    const navigate = useNavigate();

    if (userInfos && userInfos.isConnected) return null;

    function switchBoardDetailled() {
        navigate("/template-board");
    }

    return (
        <>
            <div className="px-6 flex mt-[25vh] justify-center items-center">
                <div className="rounded-xl p-6 text-center gap-4 flex flex-col">
                    <h1 className="font-museo text-5xl text-text mb-2" data-aos="fade-up" data-aos-delay="200">My projects</h1>
                    <p className="text-gray mb-4 text-xl" data-aos="fade-up" data-aos-delay="400">
                        Choose how you want to start managing your tasks
                    </p>

                    <button className="px-4 py-2 rounded-lg bg-accent1 text-white shadow-buttonLight hover:shadow-buttonDark transition" onClick={onLoginClick} data-aos="fade-up" data-aos-delay="600">
                        Login / Register
                    </button>

                    <button className="px-4 py-2 rounded-lg bg-primary text-white shadow-buttonLight hover:shadow-buttonDark transition" onClick={() => switchBoardDetailled()} data-aos="fade-up" data-aos-delay="800">
                        Try without account
                    </button>
                </div>
            </div>
        </>
    );
}
