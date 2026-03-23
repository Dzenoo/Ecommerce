import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return <SignIn signUpUrl="/sign-up" />;
};

export default SignInPage;