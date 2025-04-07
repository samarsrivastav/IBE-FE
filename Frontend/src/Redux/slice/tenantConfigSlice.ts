import { createSlice } from "@reduxjs/toolkit";
import fetchTenantConfig from "../thunk/tenantConfigThunk";


interface TenantConfigState {
    configId : number;
    configuration: {
        headerLogo: string;
        pageTitle: string;
        bannerImage: string;
        lengthOfStay: number;
        taxes:any
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
        taxes: {}
    },
    tenantId : 0,
}   

const tenantConfigSlice = createSlice({
    name: "tenantConfig",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchTenantConfig.fulfilled, (state, action) => {
            const config = action.payload[0];
            state.configId = config.configId;
            state.tenantId = config.tenantId;
            state.configuration.headerLogo = config.configurationJson.headerLogo;
            state.configuration.pageTitle = config.configurationJson.pageTitle;
            state.configuration.bannerImage = config.configurationJson.bannerImage;
            state.configuration.lengthOfStay = config.configurationJson.lengthOfStay;
            state.configuration.taxes = config.configurationJson.taxes;
        });
    }
});


export default tenantConfigSlice.reducer;




