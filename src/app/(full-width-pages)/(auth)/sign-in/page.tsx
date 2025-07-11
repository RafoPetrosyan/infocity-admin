import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Admin Sign in",
};

export default function SignIn() {
  return <SignInForm />;
}
