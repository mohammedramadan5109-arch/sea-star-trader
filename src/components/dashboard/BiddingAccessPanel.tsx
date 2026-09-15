import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface BiddingAccessPanelProps {
  status: 'not_requested' | 'pending' | 'approved' | 'rejected';
  onRequestAccess?: () => void;
}

export function BiddingAccessPanel({ status, onRequestAccess }: BiddingAccessPanelProps) {
  return (
    <div className="p-6 rounded-sm border border-[var(--line)]" style={{ backgroundColor: 'var(--off-white)' }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--navy)' }}>
            Bidding Access
          </h3>
          <p className="text-sm" style={{ color: 'var(--slate)' }}>
            Verify your account to participate in auctions
          </p>
        </div>
        <Badge
          variant={
            status === 'approved' ? 'success' :
            status === 'pending' ? 'warning' :
            status === 'rejected' ? 'error' : 'default'
          }
        >
          {status.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>

      {status === 'not_requested' && (
        <>
          <p className="text-sm mb-4" style={{ color: 'var(--slate)' }}>
            To place bids on auctions, you need to verify your business information.
          </p>
          {onRequestAccess && (
            <Button onClick={onRequestAccess}>Request Bidding Access</Button>
          )}
        </>
      )}

      {status === 'pending' && (
        <p className="text-sm" style={{ color: 'var(--slate)' }}>
          Your bidding access request is under review. We'll notify you via email once approved.
        </p>
      )}

      {status === 'approved' && (
        <p className="text-sm" style={{ color: 'var(--slate)' }}>
          ✓ Your account is verified. You can now participate in all auctions.
        </p>
      )}

      {status === 'rejected' && (
        <p className="text-sm" style={{ color: 'var(--slate)' }}>
          Your bidding access request was not approved. Please contact support for more information.
        </p>
      )}
    </div>
  );
}