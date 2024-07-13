"use server";

import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";

interface ActionState {
  token: boolean;
}

const phoneSchema = z.string().trim().refine(
  phone => validator.isMobilePhone(phone, "ko-KR"),
  "Wrong phone format"
);
const tokenSchema = z.coerce.number().min(100_000).max(999_999);

export async function smsLogin(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone");
  const token = formData.get("token");
  if (!prevState.token) {
    // only received phone number
    const result = phoneSchema.safeParse(phone);
    return {
      token: result.success,
      ...(!result.success && { error: result.error.flatten() })
    }
  } else {
    const result = tokenSchema.safeParse(token);
    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten()
      };
    } else {
      redirect("/");
    }
  }
}