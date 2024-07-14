
"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useFormState } from "react-dom";
import { smsLogin } from "./actions";

const initialState = {
  token: false,
  error: undefined
};

export default function SMSLogin() {
  const [state, dispatch] = useFormState(smsLogin, initialState);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login</h1>
        <h2 className="text-xl">Verify your phone number.</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input
          // key 값으로 요소를 구분하지 않으면 react에서 요소를 재사용하기 때문에 token input에 phone 값이 남아 있을 수 있음
          key="phone"
          type="text"
          name="phone"
          placeholder="Phone number"
          required
          errors={state.error?.fieldErrors.phone}
          // disabled={state.token}
          readOnly={state.token}
        />
        {state?.token ? (
          <Input
            key="token"
            type="number"
            name="token"
            placeholder="Verification code"
            required
            min={100_000}
            max={999_999}
            errors={state.error?.fieldErrors.token}
          />
        ) : null}
        <Button text={state.token ? "Verify Token" : "Send Verification SMS"} />
      </form>
    </div>
  );
}