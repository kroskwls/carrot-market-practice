"use client";

import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { login } from "./actions";
import Input from "@/components/input";
import Button from "@/components/button";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

export default function Login() {
	const [state, dispatch] = useFormState(login, null);

	return (
		<div className="flex flex-col gap-10 py-8 px-6">
			<div className="flex flex-col gap-2 *:font-medium">
				<h1 className="text-2xl">Hello!</h1>
				<h2 className="text-xl">Log in with email and password.</h2>
			</div>
			<form className="flex flex-col gap-3" action={dispatch}>
				<Input
					type="email"
					name="email"
					placeholder="Email"
					required
					errors={state?.fieldErrors.email}
				/>
				<Input
					type="password"
					name="password"
					placeholder="Password"
					required
					minLength={PASSWORD_MIN_LENGTH}
					errors={state?.fieldErrors.password}
				/>
				<Button text="Log in" />
			</form>
			<SocialLogin />
		</div>
	);
}