import { useState, useEffect } from 'react';
import { getCompanyProfile, updateCompanyProfile } from '../api/api';

export default function CompanyProfile() {
  const [form, setForm] = useState({
    name: '',
    skills: '',
    teamSize: '',
    experience: '',
    description: '',
    specialization: '',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await getCompanyProfile();
        const data = res.data.data;
        setForm({
          name: data.name || '',
          skills: data.skills?.join(', ') || '',
          teamSize: data.teamSize || '',
          experience: data.experience || '',
          description: data.description || '',
          specialization: data.specialization || '',
        });
        if (data.logoUrl) setPreviewUrl(data.logoUrl);
      } catch (err) {
        // error handled globally
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('skills', form.skills);
    formData.append('teamSize', form.teamSize);
    formData.append('experience', form.experience);
    formData.append('description', form.description);
    formData.append('specialization', form.specialization);
    if (logoFile) formData.append('logo', logoFile);

    try {
      await updateCompanyProfile(formData);
      // toast.success already shown
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="card">Loading company profile...</div>;

  return (
    <div>
      <h2>Company Profile</h2>
      

      <form onSubmit={handleSubmit} className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label>Company Name</label>
            <input
              className="form-input"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label>Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ padding: '8px 0' }}
            />
            {previewUrl && (
              <div style={{ marginTop: '10px' }}>
                <img
                  src={previewUrl}
                  alt="Logo preview"
                  style={{ maxWidth: '180px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
              </div>
            )}
          </div>
        </div>

        <div style={{ margin: '20px 0' }}>
          <label>Skills (comma separated)</label>
          <input
            className="form-input"
            value={form.skills}
            onChange={e => setForm({ ...form, skills: e.target.value })}
            placeholder="React, Node.js, MongoDB, UI/UX"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label>Team Size</label>
            <input
              type="number"
              className="form-input"
              value={form.teamSize}
              onChange={e => setForm({ ...form, teamSize: e.target.value })}
            />
          </div>
          <div>
            <label>Years of Experience</label>
            <input
              type="number"
              className="form-input"
              value={form.experience}
              onChange={e => setForm({ ...form, experience: e.target.value })}
            />
          </div>
        </div>

        <div style={{ margin: '20px 0' }}>
          <label>Description</label>
          <textarea
            className="form-input"
            rows={4}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div>
          <label>Specialization</label>
          <input
            className="form-input"
            value={form.specialization}
            onChange={e => setForm({ ...form, specialization: e.target.value })}
            placeholder="Web Development, Mobile Apps, AI Solutions..."
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary"
          style={{ marginTop: '30px', width: '200px' }}
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}