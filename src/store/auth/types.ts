export interface User {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string;
	role: "user" | "admin" | "super-admin";
	avatar: string;
	createdAt: Date;
	locale: "hy" | "en" | "ru";
	email_verified: boolean;
}

export interface UsersResponse {
	data: User[];
	meta: {
		page: number;
		limit: number;
		total: number;
		pages: number;
	};
}

export interface UsersState {
	currentUser: User | null;
	loading: boolean;
}
