import { LoginForm, hasUsers } from "@/features/auth";

export default async function SignInPage() {
  const usersExist = await hasUsers();

  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-950">
      <LoginForm showSignUp={!usersExist} />
    </main>
  );
}
