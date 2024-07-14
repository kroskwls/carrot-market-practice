import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { notFound, redirect } from "next/navigation";

const getUser = async () => {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: { id: session.id }
    });

    if (user) {
      return user;
    }
  }
  notFound();
};

export default async function Profile() {
  const user = await getUser();
  const logout = async () => {
    "use server";
    const session = await getSession();
    session.destroy();
    redirect("/");
  };

  return (
    <div>
      Welcome! {user?.name}
      <form action={logout}>
        <button>Log out</button>
      </form>
    </div>
  );
}