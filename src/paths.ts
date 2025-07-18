export const paths = {
	home: "/",
	auth: { signIn: "/auth/sign-in" },
	dashboard: {
		overview: "/",
		account: "/account",
		users: "/users",
		integrations: "/integrations",
		settings: "/settings",
	},
	errors: { notFound: "/errors/not-found" },
} as const;
