import { createSlice } from "@reduxjs/toolkit";
import fetchTenantConfig from "../thunk/tenantConfigThunk";


interface TenantConfigState {
    configId : number;
    configuration: {
        headerLogo: string;
        pageTitle: string;
        bannerImage: string;
        lengthOfStay: number;
        taxes: any;
        isLoading: boolean;
        error: string | null;
        LogoText: string;
    }
    tenantId : number;
}

const initialState : TenantConfigState = {
    configId : 0,
    configuration: {
        headerLogo: "",
        pageTitle: "",
        bannerImage: "",
        lengthOfStay: 0,
        taxes: {},
        isLoading: false,
        error: null,
        LogoText: "Internet Booking Engine",
    },
    tenantId : 0,
}   

const tenantConfigSlice = createSlice({
    name: "tenantConfig",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTenantConfig.pending, (state) => {
                state.configuration.isLoading = true;
                state.configuration.error = null;
            })
            .addCase(fetchTenantConfig.fulfilled, (state, action) => {
                state.configuration.isLoading = false;
                
                // Handle case when payload is an array
                if (Array.isArray(action.payload) && action.payload.length > 0) {
                    const config = action.payload[0];
                    state.configId = config.configId;
                    state.tenantId = config.tenantId;
                    
                    // Check if configurationJson exists
                    if (config.configurationJson) {
                        // Safely extract properties with defaults
                        state.configuration.headerLogo = config.configurationJson.headerLogo || "";
                        state.configuration.pageTitle = config.configurationJson.pageTitle || "";
                        state.configuration.bannerImage = config.configurationJson.bannerImage || "";
                        state.configuration.lengthOfStay = config.configurationJson.lengthOfStay || 0;
                        state.configuration.taxes = config.configurationJson.taxes || {};
                        state.configuration.LogoText = config.configurationJson.LogoText || "Internet Booking Engine";
                        
                        // Log the logo URL for debugging
                        console.log("Tenant Config Redux - Logo URL:", config.configurationJson.headerLogo);
                    } else {
                        console.error("configurationJson missing in tenant config response", config);
                    }
                } else if (action.payload && !Array.isArray(action.payload)) {
                    // Handle case when payload is a single object
                    const config = action.payload;
                    state.configId = config.configId || 0;
                    state.tenantId = config.tenantId || 0;
                    
                    // Check if configurationJson exists
                    if (config.configurationJson) {
                        state.configuration.headerLogo = config.configurationJson.headerLogo || "";
                        state.configuration.pageTitle = config.configurationJson.pageTitle || "";
                        state.configuration.bannerImage = config.configurationJson.bannerImage || "";
                        state.configuration.lengthOfStay = config.configurationJson.lengthOfStay || 0;
                        state.configuration.taxes = config.configurationJson.taxes || {};
                        state.configuration.LogoText = config.configurationJson.LogoText || "Internet Booking Engine";
                        // Log the logo URL for debugging
                        console.log("Tenant Config Redux - Logo URL:", config.configurationJson.headerLogo);
                    } else {
                        console.error("configurationJson missing in tenant config response", config);
                    }
                } else {
                    console.error("Invalid tenant config response format", action.payload);
                }
            })
            .addCase(fetchTenantConfig.rejected, (state, action) => {
                state.configuration.isLoading = false;
                state.configuration.error = action.error.message || "Failed to fetch tenant configuration";
                console.error("Failed to fetch tenant configuration:", action.error);
            });
    }
});


export default tenantConfigSlice.reducer;




