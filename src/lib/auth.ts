import axios from "axios";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				try {
					let res;
					// @ts-ignore
					if (!credentials?.userData) {
						res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/sign-in`, {
							email: credentials?.email,
							password: credentials?.password,
						});
					}

					// @ts-ignore
					let newUserData = credentials?.userData;
					if (typeof newUserData === "string") {
						try {
							newUserData = JSON.parse(newUserData);
						} catch {
							newUserData = {};
						}
					}

					// @ts-ignore
					const user = res ? res?.data?.user : newUserData;
					// @ts-ignore
					const accessToken = res ? res?.data?.access_token : credentials.accessToken;
					// @ts-ignore
					const refreshToken = res ? res?.data?.refresh_token : credentials.refreshToken;

					if (user && accessToken && refreshToken) {
						return {
							...user,
							accessToken,
							refreshToken,
							role: user.role,
						};
					}

					return null;
				} catch (error) {
					console.log(error);
					const message = (error as any)?.response?.data?.message || (error as any)?.message || "Something went wrong";
					throw new Error(message);
				}
			},
		}),
	],

	callbacks: {
		async jwt({ token, user }) {
			// @ts-ignore
			if (user?.accessToken) {
				// @ts-ignore
				token.accessToken = user.accessToken;
				// @ts-ignore
				token.refreshToken = user.refreshToken;
				token.userData = {
					...user,
				};
				return token;
			}

			return token;
		},

		async session({ session, token }) {
			session.user = {
				// @ts-ignore
				...token.userData,
			};
			// @ts-ignore
			session.accessToken = token.accessToken;
			return session;
		},
	},

	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/sign-in",
	},
};
