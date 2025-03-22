import { createSlice } from "@reduxjs/toolkit";
import fetchTenantConfig from "../thunk/tenantConfigThunk";

interface TenantConfigState {
    configId : number;
    configuration: {
        headerLogo: string;
        pageTitle: string;
        bannerImage: string;
        lengthOfStay: number;
    }
}

const initialState : TenantConfigState = {
    configId : 0,
    configuration: {
        headerLogo: "",
        pageTitle: "",
        bannerImage: "",
        lengthOfStay: 0,
    }
}   


const tenantConfigSlice = createSlice({
    name: "tenantConfig",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchTenantConfig.fulfilled, (state, action) => {
            state.configId = action.payload.configId;
            
            // Access `configurationJson` instead of `configuration`
            state.configuration.headerLogo = action.payload.configurationJson.headerLogo;
            state.configuration.pageTitle = action.payload.configurationJson.pageTitle;
            state.configuration.bannerImage = action.payload.configurationJson.bannerImage;
            state.configuration.lengthOfStay = action.payload.configurationJson.lengthOfStay;
        });
    }
});


export default tenantConfigSlice.reducer;




