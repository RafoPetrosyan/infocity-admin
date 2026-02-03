import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET as string;

export async function proxy(req: NextRequest) {
	const token = await getToken({ req, secret });
	const pathname = req.nextUrl.pathname;

	// @ts-ignore
	if (pathname === "/auth/sign-in" && token && token.userData?.role === "super-admin") {
		return NextResponse.redirect(new URL("/", req.url));
	}

	if (pathname === "/auth/sign-in") {
		return NextResponse.next();
	}

	if (!token) {
		return NextResponse.redirect(new URL("/auth/sign-in", req.url));
	}

	// @ts-ignore
	if (token.userData?.role !== "super-admin") {
		return NextResponse.redirect(new URL("/auth/sign-in", req.url));
	}

	return NextResponse.next();
}

// Match all routes except API, static, and _next
export const config = {
	matcher: ["/((?!api|_next|.*\\..*).*)"],
};
