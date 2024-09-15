import {create} from 'zustand'
import axios from 'axios'


export const useAuthContext = create((set) => ({
    user: null,
    error:null,
    Authenticated:false,
    isLoading:false,
    checkingAuth:true,
    message: null,
    signup: async (name,email,password) => {
        set({error:null,isLoading:true})
        try {
            const response = await axios.post(`/api/auth/signup`,{name,email,password})
            set({user:response.data.user,isLoading:false,Authenticated:true})
        } catch (error) {
            set({error:error.response.data.message || "Error Signing Up", isLoading:false})
            throw error
        }
    },
    verifyEmail: async (token) => {
        set({error:null,isLoading:true})
        try {
            const response = await axios.post(`/api/auth/verify-email`,{token})
            set({user:response.data.user,isLoading:false,Authenticated:true})
        } catch (error) {
            set({error:error.response.data.message || "Error Verifying Email", isLoading:false})
            throw error
        }
    },
    login:async (email,password) => {
        set({error:null,isLoading:true})
        try {
            const response = await axios.post(`/api/auth/login`,{email,password})
            set({user:response.data.user,isLoading:false,Authenticated:true})
        } catch (error) {
            set({error:error.response.data.message || "Error Logging In", isLoading:false})
            throw error
        }
    },
    logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`/api/auth/logout`);
			set({ user: null, Authenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},
    checkAuth: async () => {
		set({ checkingAuth: true, error: null });
		try {
			const response = await axios.get(`/api/auth/check-auth`);
			set({ user: response.data.user, Authenticated: true, checkingAuth: false });
		} catch (error) {
			set({ error: null, checkingAuth: false, Authenticated: false });
		}
	},
    forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`api/auth/forget-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
			throw error;
		}
	},
    resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
		  const response = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
		  set({ message: response.data.message, isLoading: false });
		} catch (error) {
		  set({
			isLoading: false,
			error: error.response?.data?.message || "Error resetting password",
		  });
		  console.error('Reset password error:', error);
		  throw error;
		}
	  },
	  
}))