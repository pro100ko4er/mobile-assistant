import { createSlice } from "@reduxjs/toolkit";
import { LoadingStateInterface } from "../types/loading";

const initialState: LoadingStateInterface = {
    loading: false
}

export const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.loading = true
        },
        unsetLoading: (state) => {
            state.loading = false
        }
    }
})

export const {setLoading, unsetLoading} = loadingSlice.actions

export default loadingSlice.reducer