import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return <SignUp signInUrl="/sign-in" />;
};

export default SignUpPage;