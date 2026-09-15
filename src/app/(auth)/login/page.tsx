import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="w-full max-w-md p-8 rounded-sm border border-[var(--line)]" style={{ backgroundColor: 'var(--off-white)' }}>
      <h1 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--navy)' }}>
        Log In
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--slate)' }}>
        Welcome back to SeaStarTrader
      </p>
      <LoginForm />
    </div>
  );
}