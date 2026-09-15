import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

interface SubmitButtonProps {
  loading?: boolean;
  children: React.ReactNode;
}

export function SubmitButton({ loading, children }: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={loading} className="w-full">
      {loading ? (
        <div className="flex items-center gap-2">
          <Spinner size={16} />
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
}