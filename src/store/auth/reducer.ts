import { User, UsersState } from "@/store/auth/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UsersState = {
	currentUser: null,
	loading: false,
	accessToken: "",
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setCurrentUser: (state, action: PayloadAction<User | null>) => {
			state.currentUser = action.payload;
		},
		setAccessToken: (state, action: PayloadAction<string>) => {
			state.accessToken = action.payload;
		},
	},
});

export const { setCurrentUser, setAccessToken } = authSlice.actions;
export default authSlice.reducer;
