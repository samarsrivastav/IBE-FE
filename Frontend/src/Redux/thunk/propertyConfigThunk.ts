import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const fetchPropertyConfig = createAsyncThunk(
        "propertyConfig/fetchPropertyConfig",
        async () => {
            const baseURL = import.meta.env.VITE_PROPERTYCONFIG_API_URL; 
            const response = await axios.get(baseURL);
            return response.data;
        }
    );          

export default fetchPropertyConfig;