import { useState } from "react";
import { register, login } from "../services/authService.js";
import { SendNotification } from "../utils/notifs.js";
import { ShowPassword } from "../utils/HiddenUnhide.js";

function createEmptyFormData() {
    return { 
        username: "", 
        email: "", 
        password: "", 
        confirmPassword: "", 
        gender: "other" 
    };
}

function validatePassword(password, isRegisterMode) {
    if (isRegisterMode && password.length < 6) {
        return false;
    }
    return true;
}

function validatePasswordsMatch(password, confirmPassword, isRegisterMode) {
    if (isRegisterMode && password !== confirmPassword) {
        return false;
    }
    return true;
}

export default function Login({ onClose, onLogin }) {
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [formData, setFormData] = useState(createEmptyFormData());
    const [isLoading, setIsLoading] = useState(false);
    const [closing, setClosing] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    
    const closeIcon = "/Close.png";
    const eyeOpenIcon = "/eyeIcon.png";
    const eyeClosedIcon = "/eyeClosed.png";

    function updateFormField(field, value) {
        setFormData(function(prev) {
            return {
                ...prev,
                [field]: value
            };
        });
    }

    function startClosing() {
        setClosing(true);
        setTimeout(onClose, 300);
    }

    function resetForm() {
        setFormData(createEmptyFormData());
    }

    function switchMode() {
        setIsRegisterMode(!isRegisterMode);
        resetForm();
    }

    function checkRequiredFields(username, password) {
        if (!username || !password) {
            SendNotification("Username or password missing", true, false);
            return false;
        }
        return true;
    }

    function checkRegistrationFields(email, password, confirmPassword) {
       
        if (!validatePasswordsMatch(password, confirmPassword, true)) {
            SendNotification("Passwords do not match", true, false);
            return false;
        }
        
        if (!validatePassword(password, true)) {
            SendNotification("Password must be at least 6 characters long", true, false);
            return false;
        }
        
        return true;
    }

    function validateFormData() {
        const { username, email, password, confirmPassword } = formData;

        if (!checkRequiredFields(username, password)) {
            return false;
        }

        if (isRegisterMode) {
            return checkRegistrationFields(email, password, confirmPassword);
        }

        return true;
    }

    async function performRegistration() {
        const result = await register({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            gender: formData.gender
        });
        SendNotification("Registration successful!", true, true);
        return result;
    }

    async function performLogin() { /*pour le login, on a juste besoin du username et du password, pas de email ni de gender*/
        const result = await login({
            identifier: formData.username,
            password: formData.password
        });
        SendNotification("Login successful! Welcome back!", true, true);
        return result;
    }

    function saveToken(result) {
        if (result && result.data && result.data.jwt) {
            localStorage.setItem("token", result.data.jwt);
        }
    }

    function notifyParent(result) {
        if (onLogin) {
            onLogin(result);
        }
        if (onClose) {
            onClose();
        }
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!validateFormData()) {
                setIsLoading(false);
                return;
            }

            let result;
            if (isRegisterMode) {
                result = await performRegistration();
            } else {
                result = await performLogin();
            }

            saveToken(result);
            await notifyParent(result);
        } catch (err) {
            SendNotification("An error occurred during authentication", true, false);
            if (err.message) {
                SendNotification(err.message, true, false);
            }
        } finally {
            setIsLoading(false);
        }
    }

    function togglePasswordVisibility() {
        setPasswordVisible(!passwordVisible);
    }

    function getEyeIcon() {
        if (passwordVisible) {
            return eyeOpenIcon;
        } else {
            return eyeClosedIcon;
        }
    }
    
    function getEyeIconDimensions() {
        if (passwordVisible) {
            return "w-6 h-4 mt-1";
        } else {
            return "w-5 h-5 mt-1";
        }
    }

    function getPasswordInputType() {
        if (passwordVisible) {
            return "text";
        } else {
            return "password";
        }
    }

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-[9000] flex items-center justify-center ${closing ? "animate-scaleOUT" : "animate-scaleIN"}`} onClick={startClosing}>
            <div className="relative w-[450px] backdrop-blur-sm max-w-[90%] bg-secondary text-gray-900 dark:text-text rounded-xl border border-gray-200 dark:border-gray-700 p-10 shadow-xl" onClick={function(e) { e.stopPropagation(); }}>

                <div>
                    <button onClick={startClosing} className={`absolute top-4 right-4 hover:opacity-70 transition`}>
                        <img src={closeIcon} alt="Close" className="w-6 h-6" />
                    </button>

                    <button onClick={togglePasswordVisibility} className="absolute top-4 right-14">
                        <img src={getEyeIcon()} alt="Toggle password visibility" id="HiddenUnhide" className={getEyeIconDimensions() + " cursor-pointer hover:opacity-70 transition"} />
                    </button>
                </div>

                <h2 className="text-2xl font-bold text-center mb-6">
                    {isRegisterMode ? "Register" : "Login"}
                </h2>
                <div className="h-[0.75vh] w-[100%] bg-accent1 rounded-[0.55vh] mt-[-20px] mb-4 shadow-[0_0_15px_#6f00ff57]  "></div>

                <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
                    <input type="text" placeholder="Username" value={formData.username} onChange={function(e) { updateFormField('username', e.target.value); }}
                        className="w-full p-3 border border-gray-300 rounded-lg text-black" disabled={isLoading} required autoComplete="username" />

                    {isRegisterMode && (
                        <input type="email" placeholder="Email" value={formData.email} onChange={function(e) { updateFormField('email', e.target.value); }} className="w-full p-3 border border-gray-300 text-black rounded-lg" disabled={isLoading} required autoComplete="email" />
                    )}

                    <input type={getPasswordInputType()} id="GetPW1" placeholder="Password" value={formData.password} onChange={function(e) { updateFormField('password', e.target.value); }} className="w-full p-3 border border-gray-300 text-black rounded-lg" disabled={isLoading} required minLength={6} autoComplete="current-password" />

                    {isRegisterMode && (
                        <input type={getPasswordInputType()} id="GetPW2" placeholder="Confirm Password" value={formData.confirmPassword} onChange={function(e) { updateFormField('confirmPassword', e.target.value); }} className="w-full p-3 border border-gray-300 text-black rounded-lg"
                            disabled={isLoading} required minLength={6} autoComplete="new-password" />
                    )}

                    {isRegisterMode && (
                        <select value={formData.gender} onChange={function(e) { updateFormField('gender', e.target.value); }} className="w-full p-3 border border-gray-300 text-black rounded-lg" disabled={isLoading}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    )}

                    <button type="submit" disabled={isLoading} className="w-full py-3 bg-accent1 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        {isLoading ? "Loading..." : isRegisterMode ? "Register" : "Login"}
                    </button>
                    <button type="button" onClick={switchMode} disabled={isLoading} className="w-full py-2 disabled:opacity-50 transition-colors">
                        <span className="text-accent1 cursor-pointer">
                            {isRegisterMode ? "Already have an account? Sign in" : "No account? Sign up"}
                        </span>
                    </button>

                </form>
            </div>
        </div>
    );
}