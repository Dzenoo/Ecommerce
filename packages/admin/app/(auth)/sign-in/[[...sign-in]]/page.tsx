import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <section className="flex h-screen items-center justify-center">
      <SignIn />
    </section>
  );
}
