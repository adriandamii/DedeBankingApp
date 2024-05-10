import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthPayload } from "../../interfaces/userInterface";
import axios from 'axios';

export const checkAuthStatus = createAsyncThunk<AuthPayload, void, { rejectValue: AuthPayload }>(
   'auth/checkStatus',
   async (_, { rejectWithValue }) => {
     try {
       const response = await axios.get('http://localhost:5000/auth-check', { withCredentials: true });
       if (response.data.isLoggedIn) {
         return response.data as AuthPayload;
       } else {
         return rejectWithValue({ isLoggedIn: false });
       }
     } catch (error) {
       return rejectWithValue({ isLoggedIn: false });
     }
   }
 );