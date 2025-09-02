export const paths = {
	home: "/",
	auth: { signIn: "/auth/sign-in" },
	dashboard: {
		overview: "/",
		account: "/account",
		users: "/users",
		settings: "/settings",
		emotions: "/emotions",
		cities: "/cities",
		categories: "/categories",
		mobileApp: "/mobile-app",
	},
	errors: { notFound: "/errors/not-found" },
} as const;
