import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const fetchTenantConfig = createAsyncThunk(
        "tenantConfig/fetchTenantConfig",
        async () => {
            const baseURL = import.meta.env.VITE_TENANTCONFIG_API_URL + '4';
            console.log("baseURL", baseURL);
            const response = await axios.get(baseURL);
            return response.data;
        }
    );          

export default fetchTenantConfig;