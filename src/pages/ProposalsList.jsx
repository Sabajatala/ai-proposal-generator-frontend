import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProposals, deleteProposal } from '../api/api'; // ← make sure deleteProposal is imported
import toast from 'react-hot-toast';

export default function ProposalsList() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProposals = async () => {
    try {
      const res = await getAllProposals();
      setProposals(res.data.data || []);
    } catch (err) {
      // interceptor already shows toast
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete proposal "${title}"? This cannot be undone.`)) return;

    try {
      await deleteProposal(id);
      toast.success('Proposal deleted successfully');
      // Refresh list
      await fetchProposals();
    } catch (err) {
      // interceptor shows error
    }
  };

  if (loading) return <div className="card">Loading proposals...</div>;

  if (proposals.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h3>No proposals yet</h3>
        <p style={{ margin: '15px 0', color: '#64748b' }}>
          Create your first proposal to get started.
        </p>
        <Link to="/create-proposal" className="btn-primary">
          Create Proposal
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2>All Proposals</h2>

      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '20px',
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
        }}>
          <thead>
            <tr style={{ background: '#f1f5f9' }}>
              <th style={{ padding: '14px', textAlign: 'left' }}>Title</th>
              <th style={{ padding: '14px', textAlign: 'left' }}>Client</th>
              <th style={{ padding: '14px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '14px', textAlign: 'left' }}>Created</th>
              <th style={{ padding: '14px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map(p => (
              <tr key={p._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '14px' }}>{p.title}</td>
                <td style={{ padding: '14px' }}>{p.clientName}</td>
                <td style={{ padding: '14px' }}>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    background:
                      p.status === 'Draft' ? '#fef3c7' :
                      p.status === 'Sent' ? '#dbeafe' :
                      p.status === 'Accepted' ? '#d1fae5' :
                      '#fee2e2',
                    color:
                      p.status === 'Draft' ? '#92400e' :
                      p.status === 'Sent' ? '#1e40af' :
                      p.status === 'Accepted' ? '#065f46' :
                      '#991b1b'
                  }}>
                    {p.status}
                  </span>
                </td>
                <td style={{ padding: '14px', color: '#64748b' }}>
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '14px', textAlign: 'center' }}>
                  <Link
                    to={`/proposals/${p._id}`}
                    style={{
                      color: '#2563eb',
                      textDecoration: 'none',
                      marginRight: '12px',
                      fontWeight: '500'
                    }}
                  >
                    View
                  </Link>

                  {p.status === 'Draft' && (
                    <>
                      <Link
                        to={`/proposals/${p._id}/edit`}
                        style={{
                          color: '#8b5cf6',
                          textDecoration: 'none',
                          marginRight: '12px',
                          fontWeight: '500'
                        }}
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(p._id, p.title)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontWeight: '500'
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}