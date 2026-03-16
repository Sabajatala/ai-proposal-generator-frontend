import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProposal } from '../api/api';

export default function CreateProposal() {
  const [form, setForm] = useState({
    clientName: '',
    clientEmail: '',
    clientIndustry: '',
    projectType: '',
    budget: '',
    requirements: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createProposal(form);
      const proposalId = res.data.data._id;
      toast.success('Proposal draft created!');
      navigate(`/proposals/${proposalId}`);
    } catch (err) {
      // error handled globally
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create New Proposal</h2>
      <p style={{ color: '#64748b', marginBottom: '25px' }}>
        Fill in client details.
      </p>

      <form onSubmit={handleSubmit} className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{ padding: '14px 40px', fontSize: '16px' }}
        >
          {loading ? 'Generating Draft...' : 'Generate Proposal Draft'}
        </button>
      </form>
    </div>
  );
}