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
		subCategories: (categoryId: string | number) => `/categories/${categoryId}/sub-categories`,
		attractions: "/attractions",
		places: "/places",
		eventCategories: "/event-categories",
		mobileApp: "/mobile-app",
	},
	errors: { notFound: "/errors/not-found" },
} as const;
