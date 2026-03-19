// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { getAllProposals } from '../api/api';
import { 
  FaFileAlt,       // total
  FaSave,          // draft
  FaPaperPlane,    // sent
  FaCheckCircle,   // accepted
  FaTimesCircle,   // rejected
  FaRupeeSign      // revenue (PKR)
} from 'react-icons/fa';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    sent: 0,
    accepted: 0,
    rejected: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProposals()
      .then(res => {
        const list = res.data.data || [];

        // Count statuses
        const draft = list.filter(p => p.status === 'Draft').length;
        const sent = list.filter(p => p.status === 'Sent').length;
        const accepted = list.filter(p => p.status === 'Accepted');
        const rejected = list.filter(p => p.status === 'Rejected').length;

        // Calculate revenue from Accepted proposals
        const totalRevenue = accepted.reduce((sum, p) => {
          // Extract numeric value from pricing string
          let amountStr = p.aiContent?.pricing || '';
          
          // Remove non-numeric characters (PKR, commas, spaces, "Total...", etc.)
          const cleanAmount = amountStr.replace(/[^0-9]/g, '');
          
          const amount = Number(cleanAmount) || 0;
          return sum + amount;
        }, 0);

        setStats({
          total: list.length,
          draft,
          sent,
          accepted: accepted.length,
          rejected,
          revenue: totalRevenue,
        });
      })
      .catch(() => {
        // interceptor already shows toast
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;

  const cardStyle = {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  };

  const iconStyle = {
    fontSize: '2.2rem',
    marginBottom: '0.75rem',
    opacity: 0.85,
  };

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Dashboard</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Total */}
        <div style={cardStyle}>
          <FaFileAlt style={{ ...iconStyle, color: '#4f46e5' }} />
          <div style={{ color: '#64748b', fontSize: '0.95rem' }}>Total Proposals</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.4rem 0' }}>
            {stats.total}
          </div>
        </div>

        {/* Draft */}
        <div style={cardStyle}>
          <FaSave style={{ ...iconStyle, color: '#d97706' }} />
          <div style={{ color: '#64748b', fontSize: '0.95rem' }}>Draft</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
            {stats.draft}
          </div>
        </div>

        {/* Sent */}
        <div style={cardStyle}>
          <FaPaperPlane style={{ ...iconStyle, color: '#2563eb' }} />
          <div style={{ color: '#64748b', fontSize: '0.95rem' }}>Sent</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
            {stats.sent}
          </div>
        </div>

        {/* Accepted */}
        <div style={cardStyle}>
          <FaCheckCircle style={{ ...iconStyle, color: '#059669' }} />
          <div style={{ color: '#64748b', fontSize: '0.95rem' }}>Accepted</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>
            {stats.accepted}
          </div>
        </div>

        {/* Rejected */}
        <div style={cardStyle}>
          <FaTimesCircle style={{ ...iconStyle, color: '#dc2626' }} />
          <div style={{ color: '#64748b', fontSize: '0.95rem' }}>Rejected</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ef4444' }}>
            {stats.rejected}
          </div>
        </div>

        {/* Revenue (PKR) */}
        <div style={cardStyle}>
          <FaRupeeSign style={{ ...iconStyle, color: '#047857' }} />
          <div style={{ color: '#64748b', fontSize: '0.95rem' }}>Estimated Revenue</div>
          <div style={{ fontSize: '2.3rem', fontWeight: 'bold', color: '#059669', margin: '0.4rem 0' }}>
            PKR {stats.revenue.toLocaleString('en-PK')}
          </div>
        </div>
      </div>
    </div>
  );
}