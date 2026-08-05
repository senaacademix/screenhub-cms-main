import { RegisterForm, hasUsers } from "@/features/auth";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const usersExist = await hasUsers();
  
  if (usersExist) {
    redirect("/sign-in");
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-950">
      <RegisterForm />
    </main>
  );
}
