import { useState } from "react";
import { register, login } from "../services/authService.js";
import { SendNotification } from "../utils/notifs.js";
import { ShowPassword } from "../utils/HiddenUnhide.js";

export default function Login({ onClose, onLogin }) {
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "", gender: "other" });
    const [isLoading, setIsLoading] = useState(false);
    const [closing, setClosing] = useState(false);
    const Close = "/Close.png";
    const eyeIcon = "/eyeIcon.png";

    function handleEyeClick() {
        ShowPassword();
    }


    function updateField(field, value) {
        setFormData(prev => ({
            ...prev, // les ... servent a copier les anciennes valeurs
            [field]: value
        }));
    }

    function SwipClose() {
        setClosing(true);
        setTimeout(onClose, 300);
    }

    const resetForm = () => {
        setFormData({ username: "", email: "", password: "", confirmPassword: "", gender: "other" });
    };

    const toggleMode = () => {
        setIsRegisterMode(!isRegisterMode);
        resetForm();
    };

    const validateForm = () => {
        const { username, email, password, confirmPassword } = formData;

        if (!username || !password) {
            SendNotification("Username or password missing", true, false);
            return false;
        }

        if (isRegisterMode) {
            if (!email || !email.includes("@") || !email.includes(".")) {
                SendNotification("Email required for registration", true, false);
                return false;
            }
            if (password !== confirmPassword) {
                SendNotification("Passwords do not match", true, false);
                return false;
            }
            if (password.length < 6) {
                SendNotification("Password must be at least 6 characters long", true, false);
                return false;
            }
        }
        return true;
    };

    async function SwipSubmit(e) {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!validateForm()) {
                setIsLoading(false);
                return;
            }
            var result = null;

            if (isRegisterMode) {
                result = await register({ username: formData.username, email: formData.email, password: formData.password, gender: formData.gender });
                SendNotification("Registration successful! Welcome!", true, true);
            } else {
                result = await login({ identifier: formData.username, password: formData.password });
                SendNotification("Login successful! Welcome back!", true, true);
            }

            if (result && result.data && result.data.jwt) { //on stocke le token jwt dans le localStorage 
                localStorage.setItem("token", result.data.jwt);
            }

            if (onLogin) {
                await onLogin(result);
            }
            if (onClose) {
                onClose();
            }

        } catch (err) {
            SendNotification("An error occurred during authentication", true, false);

            if (err.message) {
                SendNotification(err.message, true, false);
            }
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-[9000] flex items-center justify-center ${closing ? "animate-scaleOUT" : "animate-scaleIN"}`} onClick={SwipClose}>
            <div className="relative w-[450px]   backdrop-blur-sm  max-w-[90%] bg-secondary  text-gray-900 dark:text-text rounded-xl border border-gray-200 dark:border-gray-700 p-10 shadow-xl" onClick={(e) => e.stopPropagation()}>

                <div>
                    <button onClick={SwipClose} className={`absolute top-4 right-4 hover:opacity-70 transition`}>
                        <img src={Close} alt="Close" className="w-6 h-6" />
                    </button>

                    <button onClick={handleEyeClick} className="absolute top-4 right-14">
                        <img src={eyeIcon} alt="Toggle password visibility" id="HiddenUnhide" className="w-6 h-4 mt-1 cursor-pointer hover:opacity-70 transition" />
                    </button>
                </div>

                <h2 className="text-2xl font-bold text-center mb-6">
                    {isRegisterMode ? "Register" : "Login"}
                </h2>
                <div className="h-[0.75vh] w-[100%] bg-accent1 rounded-[0.55vh] mt-[-20px] mb-4 shadow-[0_0_15px_#6f00ff57]  "></div>

                <form className="flex flex-col gap-4" onSubmit={SwipSubmit}>
                    <input type="text" placeholder="Username" value={formData.username} onChange={e => updateField('username', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg text-black" disabled={isLoading} required />

                    {isRegisterMode && (
                        <input type="email" placeholder="Email" value={formData.email} onChange={e => updateField('email', e.target.value)} className="w-full p-3 border border-gray-300 text-black rounded-lg" disabled={isLoading} required />
                    )}

                    <input type="password" id="GetPW1" placeholder="Password" value={formData.password} onChange={e => updateField('password', e.target.value)} className="w-full p-3 border border-gray-300 text-black rounded-lg" disabled={isLoading} required minLength={6} />

                    {isRegisterMode && (
                        <input type="password" id="GetPW2" placeholder="Confirm Password" value={formData.confirmPassword} onChange={e => updateField('confirmPassword', e.target.value)} className="w-full p-3 border border-gray-300 text-black rounded-lg"
                            disabled={isLoading} required minLength={6} />
                    )}

                    {isRegisterMode && (
                        <select value={formData.gender} onChange={e => updateField('gender', e.target.value)} className="w-full p-3 border border-gray-300 text-black rounded-lg" disabled={isLoading}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    )}

                    <button type="submit" disabled={isLoading} className="w-full py-3 bg-accent1 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        {isLoading ? "Loading..." : isRegisterMode ? "Register" : "Login"}
                    </button>
                    <button type="button" onClick={toggleMode} disabled={isLoading} className="w-full py-2 disabled:opacity-50 transition-colors">
                        <span className="text-accent1 cursor-pointer">
                            {isRegisterMode ? "Already have an account? Sign in" : "No account? Sign up"}
                        </span>
                    </button>

                </form>
            </div>
        </div>
    );
}