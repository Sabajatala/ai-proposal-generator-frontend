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
    requirements: '',
    paymentTerms: '',
    // aiContent fields - will be sent as nested object
    aiContent: {
      introduction: '',
      understanding: '',
      scopeOfWork: '',
      timeline: '',
      pricing: '',
      planType: '',
      closing: '',
      projectFeasibility: '',
      // add priceBreakdown later if needed (array)
    }
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
          requirements: data.requirements || '',
          paymentTerms: data.paymentTerms || '50% upfront, 30% on milestone, 20% on completion',

          aiContent: {
            introduction: data.aiContent?.introduction || '',
            understanding: data.aiContent?.understanding || '',
            scopeOfWork: data.aiContent?.scopeOfWork || '',
            timeline: data.aiContent?.timeline || '',
            pricing: data.aiContent?.pricing || '',
            planType: data.aiContent?.planType || 'Standard',
            closing: data.aiContent?.closing || '',
            projectFeasibility: data.aiContent?.projectFeasibility || '',
          }
        });
      } catch (err) {
        // error handled by interceptor / global handler
        navigate('/proposals');
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('aiContent.')) {
      const field = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        aiContent: {
          ...prev.aiContent,
          [field]: value
        }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Prepare payload - only send what's actually changed / non-empty
    const payload = {
      title: form.title,
      clientName: form.clientName,
      clientEmail: form.clientEmail,
      clientIndustry: form.clientIndustry,
      projectType: form.projectType,
      budget: form.budget ? Number(form.budget) : undefined,
      requirements: form.requirements,
      paymentTerms: form.paymentTerms,
    };

    // Only include aiContent if user edited at least one field
    const hasAiEdit = Object.values(form.aiContent).some(v => v.trim() !== '');
    if (hasAiEdit) {
      payload.aiContent = { ...form.aiContent };
    }

    try {
      await updateProposal(id, payload);
      toast.success('Proposal updated successfully');
      navigate(`/proposals/${id}`);
    } catch (err) {
      // error shown by interceptor / toast in api layer
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
        Edit client info, project details and AI-generated content (while status is Draft)
      </p>

      <form onSubmit={handleSubmit} className="card">
        {/* Basic info */}
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
            <label>Payment Terms</label>
            <input
              name="paymentTerms"
              value={form.paymentTerms}
              onChange={handleChange}
              className="form-input"
              placeholder="50% upfront, 30% on milestone, 20% on completion"
            />
          </div>
        </div>

        <div style={{ margin: '24px 0 16px' }}>
          <label>Project Requirements / Description</label>
          <textarea
            name="requirements"
            rows={5}
            value={form.requirements}
            onChange={handleChange}
            className="form-input"
            placeholder="Detailed requirements, features, goals..."
          />
        </div>

        {/* ──────────────────────────────────────────────── */}
        {/* AI Content Section */}
        {/* ──────────────────────────────────────────────── */}
        <div style={{ margin: '40px 0 16px', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
          <h3 style={{ marginBottom: '16px', color: '#1e293b' }}>Edit AI-generated Proposal Content</h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '20px' }}>
            Changes here will create a new version of the proposal.
          </p>

          <div style={{ display: 'grid', gap: '20px' }}>
            <div>
              <label>Introduction</label>
              <textarea
                name="aiContent.introduction"
                rows={4}
                value={form.aiContent.introduction}
                onChange={handleChange}
                className="form-input"
                placeholder="Dear [Client], we are excited to present..."
              />
            </div>

            <div>
              <label>Understanding of Requirements</label>
              <textarea
                name="aiContent.understanding"
                rows={3}
                value={form.aiContent.understanding}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div>
              <label>Scope of Work</label>
              <textarea
                name="aiContent.scopeOfWork"
                rows={5}
                value={form.aiContent.scopeOfWork}
                onChange={handleChange}
                className="form-input"
                placeholder="• Feature 1\n• Feature 2\n..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label>Timeline</label>
                <input
                  name="aiContent.timeline"
                  value={form.aiContent.timeline}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="8–10 weeks"
                />
              </div>
              <div>
                <label>Pricing</label>
                <input
                  name="aiContent.pricing"
                  value={form.aiContent.pricing}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Total: PKR 1,250,000"
                />
              </div>
            </div>

            <div>
              <label>Closing Statement</label>
              <textarea
                name="aiContent.closing"
                rows={3}
                value={form.aiContent.closing}
                onChange={handleChange}
                className="form-input"
                placeholder="We look forward to working with you..."
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
            style={{ padding: '0.9rem 2.2rem' }}
          >
            {saving ? 'Saving...' : 'Save & Create Version if Changed'}
          </button>

          <button
            type="button"
            onClick={() => navigate(`/proposals/${id}`)}
            style={{
              padding: '0.9rem 2.2rem',
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