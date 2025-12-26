
import { Metadata } from 'next';
import { LoginForm } from '../components/LoginForm';

export const metadata: Metadata = {
  title: 'Agrix | Login',
};

// We wrap the form in a centered container for responsiveness (website UI)
const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-lg">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;