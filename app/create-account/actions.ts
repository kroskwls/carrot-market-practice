"use server";

import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from "@/lib/constants";
import db from "@/lib/db";
import { custom, z } from "zod";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

interface IPasswords {
  password: string;
  confirmPassword: string;
}

const checkUniqueUser = async (name: string) => {
  const user = await db.user.findUnique({
    select: { name: true },
    where: { name }
  });

  return !Boolean(user);
}

// At least one uppercase letter, one lowercase letter, one number and on special character
const checkUniqueEmail = async (email: string) => {
  const userEmail = await db.user.findUnique({
    select: { id: true },
    where: { email }
  });

  return !Boolean(userEmail);
};
const checkPasswords = ({
  password, confirmPassword
}: IPasswords) => password === confirmPassword;

const formSchema = z.object({
  username: z
    .string({
      invalid_type_error: "Username must be a string!",
      required_error: "Where is my username??"
    })
    .toLowerCase()
    .trim(),
  // .refine(
  //   checkUniqueUser,
  //   "There is an account already registered with that name"
  // ),
  email: z
    .string()
    .email()
    .trim()
    .toLowerCase(),
  // .refine(
  //   checkUniqueEmail,
  //   "There is an account already registered with that email"
  // ),
  password: z
    .string()
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR)
    .min(PASSWORD_MIN_LENGTH),
  confirmPassword: z.string().min(PASSWORD_MIN_LENGTH),
}).superRefine(async ({ username }, ctx) => {
  const user = await db.user.findUnique({
    where: { name: username },
    select: { id: true }
  });
  if (user) {
    ctx.addIssue({
      code: "custom",
      message: "This username is already taken.",
      path: ["username"],
      fatal: true
    });

    return z.NEVER;
  }
}).superRefine(async ({ email }, ctx) => {
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true }
  });
  if (user) {
    ctx.addIssue({
      code: "custom",
      message: "This email is already taken.",
      path: ["email"],
      fatal: true
    });

    return z.NEVER;
  }
}).refine(checkPasswords, {
  message: "Both passwords should be same!",
  path: ["confirmPassword"]
});

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    // hash password
    const hashedPassword = await bcrypt.hash(result.data.password, 12);
    // save the user to db
    const user = await db.user.create({
      data: {
        name: result.data.username,
        email: result.data.email,
        password: hashedPassword
      },
      select: { id: true }
    });
    const session = await getSession();
    session.id = user.id;
    await session.save();

    redirect("/profile");
  }
}