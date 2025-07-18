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
					const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/sign-in`, {
						email: credentials?.email,
						password: credentials?.password,
					});

					const user = res?.data?.user;
					const accessToken = res?.data?.access_token;
					const refreshToken = res?.data?.refresh_token;

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
		async jwt({ token, user, trigger, session, account, profile }) {
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

			if (trigger === "update") {
				if (session?.userData) {
					token.userData = {
						// @ts-ignore
						...token.userData,
						...session.userData,
					};
				}
				if (session?.accessToken) {
					token.accessToken = session.accessToken;
				}
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

	cookies: {
		csrfToken: {
			name: "next-auth.csrf-token",
			options: { httpOnly: true, sameSite: "none", path: "/", secure: true },
		},
		pkceCodeVerifier: {
			name: "next-auth.pkce.code_verifier",
			options: { httpOnly: true, sameSite: "none", path: "/", secure: true },
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
