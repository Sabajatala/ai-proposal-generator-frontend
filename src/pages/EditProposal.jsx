// src/pages/EditProposal.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProposalById, updateProposal } from '../api/api';
import toast from 'react-hot-toast';

export default function EditProposal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    clientName: '',
    clientEmail: '',
    clientIndustry: '',
    projectType: '',
    budget: '',
    requirements: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [proposal, setProposal] = useState(null);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const res = await getProposalById(id);
        const data = res.data.data;
        setProposal(data);

        if (data.status !== 'Draft') {
          toast.error('Only Draft proposals can be edited');
          navigate(`/proposals/${id}`);
          return;
        }

        setForm({
          title: data.title || '',
          clientName: data.clientName || '',
          clientEmail: data.clientEmail || '',
          clientIndustry: data.clientIndustry || '',
          projectType: data.projectType || '',
          budget: data.budget || '',
          requirements: data.requirements || ''
        });
      } catch (err) {
        // error handled by interceptor
        navigate('/proposals');
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateProposal(id, form);
      toast.success('Proposal updated successfully');
      navigate(`/proposals/${id}`);
    } catch (err) {
      // error shown by interceptor
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="card">Loading proposal...</div>;
  if (!proposal) return <div className="card">Proposal not found</div>;

  return (
    <div>
      <h2>Edit Proposal: {proposal.title}</h2>
      <p style={{ color: '#64748b', marginBottom: '25px' }}>
        You can only edit client and project details while status is Draft.
      </p>

      <form onSubmit={handleSubmit} className="card">
        <div>
          <label>Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '20px 0' }}>
          <div>
            <label>Client Name *</label>
            <input
              name="clientName"
              value={form.clientName}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div>
            <label>Client Email</label>
            <input
              name="clientEmail"
              type="email"
              value={form.clientEmail}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div style={{ margin: '20px 0' }}>
          <label>Client Industry</label>
          <input
            name="clientIndustry"
            value={form.clientIndustry}
            onChange={handleChange}
            className="form-input"
            placeholder="E-commerce, Education, Healthcare..."
          />
        </div>

        <div style={{ margin: '20px 0' }}>
          <label>Project Type</label>
          <input
            name="projectType"
            value={form.projectType}
            onChange={handleChange}
            className="form-input"
            placeholder="Website, Mobile App, Dashboard, API..."
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label>Budget (PKR) *</label>
            <input
              name="budget"
              type="number"
              value={form.budget}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div>
            <label>Currency</label>
            <select className="form-input" disabled>
              <option>PKR</option>
            </select>
          </div>
        </div>

        <div style={{ margin: '20px 0' }}>
          <label>Project Requirements / Description</label>
          <textarea
            name="requirements"
            rows={6}
            value={form.requirements}
            onChange={handleChange}
            className="form-input"
            placeholder="Detailed requirements, features, goals..."
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
            style={{ padding: '0.9rem 2rem' }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            type="button"
            onClick={() => navigate(`/proposals/${id}`)}
            style={{
              padding: '0.9rem 2rem',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}