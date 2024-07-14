"use server";

import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import crypto from "crypto";
import { saveSession } from "@/lib/session";

interface ActionState {
  token: boolean;
}

interface ActionObject {
  phone: string;
  token: number;
}

const phoneSchema = z.object({
  phone: z.string().trim().refine(
    phone => validator.isMobilePhone(phone, "ko-KR"),
    "Wrong phone format"
  ),
  token: z.undefined()
});

const tokenExists = async ({ phone, token }: ActionObject) => {
  const exists = await db.sMSToken.findUnique({
    where: {
      token: token.toString(),
      user: {
        phone
      }
    },
    select: {
      id: true
    }
  });

  return Boolean(exists);
};

const tokenSchema = z.object({
  phone: z.string(),
  token: z.coerce.number().min(100_000).max(999_999)
}).refine(tokenExists, {
  message: "This token is invalid.",
  path: ["token"]
});

export async function smsLogin(prevState: ActionState, formData: FormData) {
  return !prevState.token ? await createToken(formData) : await verifyToken(formData);
}

const getToken = async (): Promise<string> => {
  const token = crypto.randomInt(100_000, 999_999).toString();
  const exists = await db.sMSToken.findUnique({
    where: { token },
    select: { id: true }
  });

  return exists ? getToken() : token;
};

const createToken = async (formData: FormData) => {
  const unverifiedPhone = formData.get("phone");
  // only received phone number
  const result = phoneSchema.safeParse({ phone: unverifiedPhone });
  if (!result.success) {
    return {
      token: false,
      error: result.error.flatten()
    };
  }

  const { phone } = result.data;
  // delete previous token
  await db.sMSToken.deleteMany({
    where: {
      user: { phone }
    }
  });

  // create new token
  const token = await getToken();
  await db.sMSToken.create({
    data: {
      token,
      user: {
        connectOrCreate: {
          where: { phone },
          create: {
            name: crypto.randomBytes(10).toString("hex"),
            phone
          }
        }
      }
    }
  });

  // send the token using twilio

  return {
    token: true
  };
};

const verifyToken = async (formData: FormData) => {
  const phone = formData.get("phone");
  const token = formData.get("token");

  const result = await tokenSchema.spa({ phone, token });
  if (!result.success) {
    return {
      token: true,
      error: result.error.flatten()
    };
  }

  const { userId } = await db.sMSToken.delete({
    where: {
      token: result.data.token.toString()
    },
    select: { userId: true }
  });

  return await saveSession(userId, "/profile");
};
