import axios from "axios";
import { SendNotification } from "../utils/notifs.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337";

export async function updateUserProfile(token, userData) {
    try {
        var res = await axios.put(API_URL + "/api/users/me", userData, { headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" } });
        return res.data;
    } catch (error) {
        throw error;
    }
}

export async function register(data) {
    try {
        var postData = { username: data.username, email: data.email, password: data.password };
        var response = await axios.post(API_URL + "/api/auth/local/register", postData); //appel API Strapi pour enregister

        var user = response.data.user;
        user.gender = data.gender || "other"; //si pas fourni => other

        localStorage.setItem("userInfo", JSON.stringify(user));
        localStorage.setItem("userGender", user.gender);

        if (response.data.jwt && data.gender) {
            try {
                await updateUserProfile(response.data.jwt, { gender: user.gender }); //remet a jour le genre 
            } catch (updateError) {
            }
        }
        return { data: response.data, user: user };
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
            SendNotification(error.response.data.error.message, true, false);
        } else if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
            SendNotification("Server unavailable or network error, please try again later.", true, false);
        } else {
            SendNotification("An error occurred during registration.", true, false);
        }
        throw error;
    }
}

export async function login(data) {
    try {
        var postData = { identifier: data.identifier, password: data.password };
        var response = await axios.post(API_URL + "/api/auth/local", postData);
        var user = response.data.user;

        var gender = "other";
        try {
            if (response.data.jwt) { // charge le profile pour avoir le genre
                var profile = await getUserProfile(response.data.jwt);
                if (profile.gender) {
                    gender = profile.gender;
                } else {
                    gender = localStorage.getItem("userGender") || "other";
                }
                user = profile;
            }
        } catch (e) {
            gender = localStorage.getItem("userGender") || "other";
            user.gender = gender;
        }

        localStorage.setItem("userInfo", JSON.stringify(user));
        localStorage.setItem("userGender", user.gender);

        return { data: response.data, user: user }; // retourne aussi les infos user
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
            throw new Error(error.response.data.error.message);
        } else if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
            throw new Error("Server unavailable or network error, please try again later.");
        }
        throw new Error("An error occurred during login.");
    }
}

export async function getUserProfile(token) {
    try {
        var res = await axios.get(API_URL + "/api/users/me", { headers: { Authorization: "Bearer " + token } });

        var user = res.data;
        if (!user.gender) { // recupere depuis localStorage
            var g = localStorage.getItem("userGender");
            if (g) {
                user.gender = g;
            } else {
                user.gender = "other";
            }
        }

        localStorage.setItem("userInfo", JSON.stringify(user));
        localStorage.setItem("userGender", user.gender);

        return user;
    } catch (error) {
        throw error;
    }
}


// recupere les infos utilisateur formatées les tries pour afficher l'avatar etc
export function getUserInfos(user) {
    var infos = { id: null, username: "Not connected", email: "", avatar: "/LoginOther.png", gender: "other", isConnected: false }; //fausse infos par défaut
    if (!user || !user.id) return infos;

    infos.id = user.id;
    infos.username = user.username || infos.username;
    infos.email = user.email || "";
    infos.isConnected = true;
    infos.gender = user.gender || "other";

    if (infos.gender === "male") infos.avatar = "/boy.png";
    else if (infos.gender === "female") infos.avatar = "/woman.png";
    else infos.avatar = "/LoginOther.png";

    return infos;
}

export function getUserInfoFromStorage() {
    var s = localStorage.getItem("userInfo");
    if (!s) return null;
    var user = JSON.parse(s);
    if (!user.gender) user.gender = localStorage.getItem("userGender") || "other";
    return user;
}

export async function initializeUserData() {
    var token = localStorage.getItem("token");
    if (token) {
        try { return await getUserProfile(token); }
        catch (e) { /* si échec, on garde le localStorage déconnecté */ }
    }
    return getUserInfoFromStorage(); // retourne null si pas trouvé
}

export function saveUserGender(gender) {
    localStorage.setItem("userGender", gender);
    var user = getUserInfoFromStorage(); //charge les infos user
    if (user) {
        user.gender = gender;
        localStorage.setItem("userInfo", JSON.stringify(user));
    }
    return true;
}