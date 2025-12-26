
import { Metadata } from 'next';
import { RegisterForm } from '../components/SignupForm';

export const metadata: Metadata = {
  title: 'Agrix | Signup',
};

const SignupPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-lg">
        <RegisterForm />
      </div>
    </div>
  );
};

export default SignupPage;