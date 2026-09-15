import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md p-8 rounded-sm border border-[var(--line)]" style={{ backgroundColor: 'var(--off-white)' }}>
      <h1 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--navy)' }}>
        Create Account
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--slate)' }}>
        Join SeaStarTrader to buy and sell heavy equipment globally
      </p>
      <RegisterForm />
    </div>
  );
}