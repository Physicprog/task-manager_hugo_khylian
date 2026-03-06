import axios from "axios";
import { SendNotification } from "../utils/notifs.js";



export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337";

function createAuthHeaders(token) {
    return {headers: {"Authorization": `Bearer ${token}`}};
}

function saveUserToStorage(user) {
    localStorage.setItem("userInfo", JSON.stringify(user));
    if (user.gender) {
        localStorage.setItem("userGender", user.gender);
    }
}

function getGenderFromStorage() {
    return localStorage.getItem("userGender") || "other";
}

export async function updateUserProfile(token, userData) {
    try {
        const headers = createAuthHeaders(token);
        const response = await axios.put(API_URL + "/api/users/me", userData, { headers });
        return response.data;
    } catch (error) {
        SendNotification("Error while creating user profile", true, false)
    }
}

function createRegistrationData(data) {
    return {
        username: data.username,
        email: data.email,
        password: data.password
    };
}

function addGenderToUser(user, gender) {
    user.gender = gender || "other";
    return user;
}

async function updateUserGenderProfile(jwt, gender) {
    if (jwt && gender) {
        try {
            await updateUserProfile(jwt, { gender: gender });
        } catch (updateError) {
            console.log(error)
        }
    }
}

function handleRegistrationError(error) {
    if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) { //on recupere l'erreur de strapi
        const errorMessage = error.response.data.error.message;
        
        if (errorMessage.toLowerCase().includes("username")) {
            SendNotification("This username is already taken. Please choose another one.", true, false);
        } else if (errorMessage.toLowerCase().includes("email")) {
            SendNotification("This email is already registered. Please use another email or try logging in.", true, false);
        } else {
            SendNotification(errorMessage, true, false);
        }
    } else {
        SendNotification("Error during registration", true, false);
    }
}

export async function register(data) {
    try {
        const postData = createRegistrationData(data);
        const response = await axios.post(API_URL + "/api/auth/local/register", postData);

        const user = addGenderToUser(response.data.user, data.gender);
        saveUserToStorage(user);
        
        await updateUserGenderProfile(response.data.jwt, user.gender);
        
        return { data: response.data, user: user };
    } catch (error) {
        handleRegistrationError(error);
    }
}

function createLoginData(data) {
    return {
        identifier: data.identifier,
        password: data.password
    };
}

function handleLoginError(error) {
    if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
        SendNotification(error.response.data.error.message, true, false);
    }else {
        SendNotification("An error occurred during login.", true, false);
    }
}
export async function login(data) {
    try {
        const postData = createLoginData(data);
        const response = await axios.post(API_URL + "/api/auth/local", postData);
        
        let user = response.data.user;
        const result = await getUserGender(response.data.jwt, user);
        user = result.user;
        
        saveUserToStorage(user);
        
        return { data: response.data, user: user };
    } catch (error) {
        handleLoginError(error);
    }
}

















async function getUserGender(jwt, user) {
    let gender = "other";
    
    try {
        if (jwt) {
            const profile = await getUserProfile(jwt);
            if (profile.gender) {
                gender = profile.gender;
                user = profile;
            } else {
                gender = getGenderFromStorage();
            }
        }
    } catch (error) {
        gender = getGenderFromStorage();
        user.gender = gender;
    }
    
    return { user, gender };
}



function setUserGenderFromStorage(user) {
    if (!user.gender) {
        const savedGender = getGenderFromStorage();
        if (savedGender) {
            user.gender = savedGender;
        } else {
            user.gender = "other";
        }
    }
}


function getAvatarForGender(gender) {
    if (gender === "male") {
        return "/boy.png";
    } else if (gender === "female") {
        return "/woman.png";
    } else {
        return "/LoginOther.png";
    }
}



export async function getUserProfile(token) {
    try {
        const headers = createAuthHeaders(token);
        const response = await axios.get(API_URL + "/api/users/me", headers);

        const user = response.data;
        setUserGenderFromStorage(user);
        saveUserToStorage(user);

        return user;
    } catch (error) {
        return null;
    }
}


function createDefaultUserInfos() {
    return {
        id: null,
        username: "Not connected",
        email: "",
        avatar: "/LoginOther.png",
        gender: "other",
        isConnected: false
    };
}


function populateUserInfos(user, infos) {
    infos.id = user.id;
    infos.username = user.username || infos.username;
    infos.email = user.email || "";
    infos.isConnected = true;
    infos.gender = user.gender || "other";
    infos.avatar = getAvatarForGender(infos.gender);
    return infos;
}

export function getUserInfos(user) {
    const infos = createDefaultUserInfos();
    
    if (!user || !user.id) {
        return infos;
    }

    return populateUserInfos(user, infos);
}

export function getUserInfoFromStorage() {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
        return null;
    }
    
    const user = JSON.parse(userInfo);
    if (!user.gender) {
        user.gender = getGenderFromStorage();
    }
    
    return user;
}

async function loadUserFromToken(token) {
    try {
        return await getUserProfile(token);
    } catch (error) {
        return null;
    }
}

export async function initializeUserData() {
    const token = localStorage.getItem("token");
    
    if (token) {
        const userFromToken = await loadUserFromToken(token);
        if (userFromToken) {
            return userFromToken;
        }
    }
    
    return getUserInfoFromStorage();
}

export function saveUserGender(gender) {
    localStorage.setItem("userGender", gender);
    
    const user = getUserInfoFromStorage();
    if (user) {
        user.gender = gender;
        saveUserToStorage(user);
    }
    
    return true;
}

























export async function deleteUserAccount() {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            SendNotification("User not authenticated", true, false);
            return;
        }

        const headers = createAuthHeaders(token);
        const response = await axios.delete(API_URL + "/api/users/me", { headers });
        
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("userGender");
        
        SendNotification("Account deleted successfully", false, true);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
            const errorMessage = error.response.data.error.message;
            SendNotification("Error deleting account: " + errorMessage, true, false);
        } 
    }
}

export default {API_URL, updateUserProfile, register, login, getUserProfile, getUserInfos, getUserInfoFromStorage, initializeUserData, saveUserGender, deleteUserAccount};
