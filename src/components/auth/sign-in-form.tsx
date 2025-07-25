"use client";

import * as React from "react";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { signIn } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z as zod } from "zod";

import { useUser } from "@/hooks/use-user";

const schema = zod.object({
	email: zod.string().min(1, { message: "Email is required" }).email(),
	password: zod.string().min(1, { message: "Password is required" }),
});

type Values = zod.infer<typeof schema>;

export function SignInForm(): React.JSX.Element {
	const router = useRouter();
	const inputRef = useRef(null);

	const { checkSession } = useUser();

	const [showPassword, setShowPassword] = React.useState<boolean>();

	const [isPending, setIsPending] = React.useState<boolean>(false);

	const {
		control,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<Values>({ defaultValues: { email: "", password: "" }, resolver: zodResolver(schema) });

	const onSubmit = React.useCallback(
		async (values: Values): Promise<void> => {
			setIsPending(true);

			const result = await signIn("credentials", {
				redirect: false,
				email: values.email,
				password: values.password,
			});

			if (result?.error) {
				setError("root", { type: "server", message: "Invalid email or password" });
				toast.error("Invalid email or password");
				setIsPending(false);
				return;
			}

			router.replace("/");
		},
		[checkSession, router, setError]
	);

	return (
		<Stack spacing={4}>
			<Stack spacing={1}>
				<Typography variant="h4">Sign in</Typography>
			</Stack>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Stack spacing={2}>
					<Controller
						control={control}
						name="email"
						render={({ field }) => (
							<FormControl error={Boolean(errors.email)}>
								<InputLabel>Email address</InputLabel>
								<OutlinedInput {...field} label="Email address" type="email" />
								{errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
							</FormControl>
						)}
					/>
					<Controller
						control={control}
						name="password"
						render={({ field }) => (
							<FormControl error={Boolean(errors.password)}>
								<InputLabel>Password</InputLabel>
								<OutlinedInput
									{...field}
									endAdornment={
										showPassword ? (
											<RemoveRedEyeOutlinedIcon
												cursor="pointer"
												onClick={(): void => {
													setShowPassword(false);
												}}
											/>
										) : (
											<VisibilityOffOutlinedIcon
												cursor="pointer"
												onClick={(): void => {
													setShowPassword(true);
												}}
											/>
										)
									}
									label="Password"
									type={showPassword ? "text" : "password"}
								/>
								{errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
							</FormControl>
						)}
					/>
					{errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
					<Button disabled={isPending} type="submit" variant="contained">
						Sign in
					</Button>
				</Stack>
			</form>
		</Stack>
	);
}
