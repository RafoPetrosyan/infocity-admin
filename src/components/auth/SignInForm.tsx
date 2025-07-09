"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

type SignInFormInputs = {
  email: string;
  password: string;
};

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormInputs>();

  const onSubmit = (data: SignInFormInputs) => {
    console.log("Form data:", data);
    // TODO: handle sign-in logic
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Sign In
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your email and password to sign in!
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <Label>
                Email <span className="text-error-500">*</span>
              </Label>
              <Input
                type="email"
                placeholder="info@gmail.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-error-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <Label>
                Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </span>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-error-500">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <Button className="w-full" size="sm" type="submit">
                Sign in
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
