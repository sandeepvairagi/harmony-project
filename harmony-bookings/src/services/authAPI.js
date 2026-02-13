import {toast} from "react-hot-toast";
import { setLoading, setToken } from "../slices/authSlice";
import {setUser} from "../slices/profileSlice";
import { apiConnector } from "./apiConnector";
import { BASE_URL } from "../BASE_URL.js";


export function register(fullName,email,password,confirmPassword,phoneNumber,gender,imageUrl,accountType, navigate) {

    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", `${BASE_URL}/auth/register`, {
                fullName,
                email,
                password,
                confirmPassword,
                phoneNumber,
                gender,
                imageUrl,
                accountType,
            });

            if(!response.data.success){
                throw new Error(response.data.message)
            }

            toast.success("User Registration Successfull");
            navigate("/login");

        } catch (error) {
            console.log("SIGNUP API ERROR.............", error)
            toast.error("Signup Failed")
            navigate("/register")
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId)
    }
}

export function login(email, password, navigate){
    return async(dispatch) =>{
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST",`${BASE_URL}/auth/login`, {
                email,
                password
            });
            
            if(!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Login Successful");

            dispatch(setToken(response.data.token));
            dispatch(setUser({ ...response.data.user}));

            localStorage.setItem("token", JSON.stringify(response.data.token))
            localStorage.setItem("User", JSON.stringify(response.data.user))

            navigate("/home");

        } catch (error) {
            console.log("LOGIN API ERROR..............", error)
            toast.error(`Login failed due to ${error.message}`)
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

export function logout(navigate) {
    return (dispatch) => {
      dispatch(setToken(null))
      dispatch(setUser(null))
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      toast.success("Logged Out")
      navigate("/")
    }
  }

export function updateUser(id, fullName,phoneNumber,gender,imageUrl,height,weight, navigate) {

    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("PUT", `${BASE_URL}/user/update-user`, {
                id,
                fullName,
                phoneNumber,
                gender,
                imageUrl,
                height,
                weight,
            });

            if(!response.data.success){
                throw new Error(response.data.message)
            }

            toast.success("User Data Updated Successfully");
            navigate("/dashboard/user/my-profile");

        } catch (error) {
            console.log("Update user api ERROR.............", error)
            toast.error("Update User Failed")
            navigate("/dashboard/user/my-profile")
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId)
    }
}

export function updateInstructor(id, fullName,imageUrl,gender,phoneNumber,weight,height,specialization,ticketPrice,
    qualifications,experiences,timeSlots,about,bio, navigate) {

    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("PUT", `${BASE_URL}/user/update-instructor`, {
                id, fullName,imageUrl,gender,phoneNumber,weight,height,specialization,ticketPrice,
    qualifications,experiences,timeSlots,about,bio,
            });

            if(!response.data.success){
                throw new Error(response.data.message)
            }

            toast.success("Instructor Data Updated Successfully");
            navigate("/dashboard/instructor/my-profile");

        } catch (error) {
            console.log("Update Instructor api ERROR.............", error)
            toast.error("Update Instructor Failed")
            navigate("/dashboard/instructor/my-profile")
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId)
    }
}

export function createStreak(id, present, streak, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("PUT", `${BASE_URL}/auth/create-streak`, {
                id, present, streak
            });

            if(!response.data.success){
                throw new Error(response.data.message)
            }

            toast.success("User Streak created Successfully");
            navigate("/streak-map");

        } catch (error) {
            console.log("User Streak api ERROR.............", error)
            toast.error("User Streak Failed")
            navigate("/streak-map")
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId)
    }
}