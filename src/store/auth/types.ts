export interface User {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string;
	role: "user" | "admin" | "super-admin";
	avatar: string;
}

export interface UsersResponse {
	data: User[];
	count: number;
}

export interface UsersState {
	currentUser: User | null;
	loading: boolean;
}
