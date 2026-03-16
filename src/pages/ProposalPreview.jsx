// // src/pages/ProposalPreview.jsx
// import { useState, useEffect, useRef } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import {
//   getProposalById,
//   updateProposalStatus,
//   chatEdit,
//   regenerateProposal,
// } from '../api/api';
// import toast from 'react-hot-toast';

// export default function ProposalPreview() {
//   const { id } = useParams();

//   const [proposal, setProposal] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [chatOpen, setChatOpen] = useState(false);
//   const [chatMessage, setChatMessage] = useState('');
//   const [sending, setSending] = useState(false);
//   const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
//   const [generatingPdf, setGeneratingPdf] = useState(false);

//   // New: version selection state
//   const [selectedVersion, setSelectedVersion] = useState('latest');

//   const chatEndRef = useRef(null);

//   const fetchProposal = async () => {
//     try {
//       const res = await getProposalById(id);
//       setProposal(res.data.data);
//       // Reset to latest version after fetch / regenerate
//       setSelectedVersion('latest');
//     } catch (err) {
//       // assuming axios interceptor shows toast — otherwise add toast.error here
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProposal();
//   }, [id]);

//   // Scroll to bottom when chat updates
//   useEffect(() => {
//     if (chatEndRef.current) {
//       chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [proposal?.chatHistory]);

//   const sendChatMessage = async () => {
//     if (!chatMessage.trim()) return;
//     setSending(true);

//     try {
//       const res = await chatEdit(id, { message: chatMessage.trim() });
//       setProposal((prev) => ({ ...prev, chatHistory: res.data.chatHistory }));
//       setChatMessage('');
//       toast.success('Instruction sent — AI is updating…');
//     } catch (err) {
//       toast.error('Failed to send instruction');
//     } finally {
//       setSending(false);
//     }
//   };

//   const handleRegenerate = async () => {
//     if (!confirm('Regenerate full proposal using all chat history?')) return;

//     try {
//       const res = await regenerateProposal(id);
//       toast.success(res.data.message || 'Proposal regeneration started');
//       await fetchProposal();
//       setChatOpen(false);
//     } catch (err) {
//       toast.error('Regeneration failed');
//     }
//   };

//   const handleStatusChange = async (newStatus, confirmMessage) => {
//     if (!confirm(confirmMessage)) return;

//     setActionLoading(true);
//     try {
//       await updateProposalStatus(id, newStatus);
//       toast.success(`Proposal marked as ${newStatus}`);
//       await fetchProposal();
//     } catch (err) {
//       // interceptor should handle error toast
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   if (loading) return <div className="card">Loading proposal…</div>;
//   if (!proposal) return <div className="card">Proposal not found</div>;

//   const {
//     title,
//     clientName,
//     clientEmail,
//     clientIndustry,
//     aiContent: currentAiContent = {},
//     status,
//     pdfUrl,
//     company = {},
//     paymentTerms = '',
//     versions = [],
//   } = proposal;

//   // Decide which content to display (latest or selected old version)
//   const displayedContent =
//     selectedVersion === 'latest'
//       ? currentAiContent
//       : versions.find(v => v.versionNumber === Number(selectedVersion))?.aiContent ||
//         currentAiContent; // fallback to latest if version not found

//   const currentVersionNumber = versions.length + 1;
//   const isViewingOldVersion = selectedVersion !== 'latest';

//   return (
//     <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem' }}>
//       {/* Header */}
//       <div
//         style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           marginBottom: '1.5rem',
//           flexWrap: 'wrap',
//           gap: '1rem',
//         }}
//       >
//         <h2 style={{ margin: 0 }}>
//           {title || `Proposal for ${clientName || 'Client'}`}
//         </h2>

//         <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
//           <Link
//             to="/proposals"
//             style={{
//               color: '#64748b',
//               textDecoration: 'none',
//               fontWeight: '500',
//             }}
//           >
//             ← Back to Proposals
//           </Link>

//           <span
//             style={{
//               padding: '8px 18px',
//               borderRadius: '999px',
//               fontSize: '14px',
//               fontWeight: '600',
//               backgroundColor:
//                 status === 'Draft' ? '#fef3c7' :
//                 status === 'Sent' ? '#dbeafe' :
//                 status === 'Accepted' ? '#d1fae5' :
//                 '#fee2e2',
//               color:
//                 status === 'Draft' ? '#92400e' :
//                 status === 'Sent' ? '#1e40af' :
//                 status === 'Accepted' ? '#065f46' :
//                 '#991b1b',
//             }}
//           >
//             {status}
//           </span>
//         </div>
//       </div>

//       {/* Version Selector */}
//       <div
//         style={{
//           marginBottom: '1.5rem',
//           display: 'flex',
//           alignItems: 'center',
//           gap: '1rem',
//           flexWrap: 'wrap',
//         }}
//       >
//         <label style={{ fontWeight: 500, color: '#374151' }}>Version:</label>
//         <select
//           value={selectedVersion}
//           onChange={(e) => setSelectedVersion(e.target.value)}
//           style={{
//             padding: '8px 14px',
//             borderRadius: '8px',
//             border: '1px solid #d1d5db',
//             background: '#fff',
//             fontSize: '1rem',
//             minWidth: '220px',
//           }}
//         >
//           <option value="latest">
//             Latest – Version {currentVersionNumber}
//           </option>
//           {versions
//             .slice()
//             .reverse()
//             .map((v) => (
//               <option key={v.versionNumber} value={v.versionNumber}>
//                 Version {v.versionNumber} — {new Date(v.createdAt).toLocaleDateString()}
//               </option>
//             ))}
//         </select>

//         {isViewingOldVersion && (
//           <span
//             style={{
//               color: '#dc2626',
//               fontSize: '0.95rem',
//               fontStyle: 'italic',
//             }}
//           >
//             You are viewing an older version (read-only)
//           </span>
//         )}
//       </div>

//       {/* AI Chat Toggle */}
//       <button
//         onClick={() => setChatOpen(!chatOpen)}
//         className="btn-primary"
//         style={{
//           background: '#8b5cf6',
//           margin: '0 0 1.5rem 0',
//           padding: '0.9rem 1.8rem',
//           fontWeight: '500',
//         }}
//       >
//         {chatOpen ? 'Close AI Editor' : 'Edit with AI Chat'}
//       </button>

//       {/* AI Chat Panel */}
//       {chatOpen && (
//         <div className="card" style={{ marginBottom: '2.5rem', padding: '1.5rem' }}>
//           <h4 style={{ margin: '0 0 1.2rem 0' }}>AI Editor — Give instructions</h4>
//           <div
//             style={{
//               height: '340px',
//               overflowY: 'auto',
//               marginBottom: '1.2rem',
//               padding: '1.2rem',
//               background: '#f8fafc',
//               borderRadius: '10px',
//               border: '1px solid #e2e8f0',
//             }}
//           >
//             {(!proposal.chatHistory || proposal.chatHistory.length === 0) && (
//               <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem 0' }}>
//                 Example instructions:<br />
//                 • "Make the timeline 10 weeks instead of 6"<br />
//                 • "Add 20% discount for 12-month contract"<br />
//                 • "Emphasize our experience in e-commerce projects"
//               </p>
//             )}

//             {proposal.chatHistory?.map((msg, i) => (
//               <div
//                 key={i}
//                 style={{
//                   marginBottom: '1rem',
//                   textAlign: msg.isAdmin ? 'right' : 'left',
//                 }}
//               >
//                 <div
//                   style={{
//                     display: 'inline-block',
//                     maxWidth: '82%',
//                     padding: '12px 18px',
//                     borderRadius: '14px',
//                     background: msg.isAdmin ? '#2563eb' : '#e5e7eb',
//                     color: msg.isAdmin ? 'white' : '#111827',
//                     fontSize: '0.97rem',
//                     lineHeight: '1.45',
//                   }}
//                 >
//                   {msg.message}
//                 </div>
//               </div>
//             ))}
//             <div ref={chatEndRef} />
//           </div>

//           <div style={{ display: 'flex', gap: '12px' }}>
//             <input
//               value={chatMessage}
//               onChange={(e) => setChatMessage(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendChatMessage())}
//               placeholder="Type your change request..."
//               disabled={sending}
//               style={{
//                 flex: 1,
//                 padding: '13px 16px',
//                 borderRadius: '10px',
//                 border: '1px solid #d1d5db',
//                 fontSize: '1rem',
//               }}
//             />
//             <button
//               onClick={sendChatMessage}
//               disabled={sending}
//               className="btn-primary"
//               style={{ padding: '0 1.8rem', minWidth: '100px' }}
//             >
//               {sending ? 'Sending…' : 'Send'}
//             </button>
//           </div>

//           <button
//             onClick={handleRegenerate}
//             className="btn-primary"
//             style={{
//               marginTop: '1.5rem',
//               background: '#10b981',
//               width: '100%',
//               padding: '1rem',
//               fontSize: '1.05rem',
//             }}
//           >
//             Regenerate Full Proposal
//           </button>
//         </div>
//       )}

//       {/* Main Proposal Content */}
//       <div className="card" style={{ padding: '2.5rem' }}>
//         {/* Company + Client Info */}
//         <div
//           style={{
//             display: 'flex',
//             alignItems: 'flex-start',
//             gap: '2.5rem',
//             marginBottom: '3rem',
//             flexWrap: 'wrap',
//           }}
//         >
//           {company.logoUrl && (
//             <img
//               src={company.logoUrl}
//               alt={`${company.name} logo`}
//               style={{
//                 maxWidth: '180px',
//                 height: 'auto',
//                 objectFit: 'contain',
//                 borderRadius: '10px',
//                 border: '1px solid #e5e7eb',
//               }}
//             />
//           )}

//           <div>
//             <h3 style={{ margin: '0 0 0.6rem 0' }}>{company.name || 'Your Company'}</h3>
//             <p style={{ margin: '0.3rem 0', color: '#475569' }}>
//               <strong>Proposal for:</strong> {clientName}
//               {clientIndustry && ` (${clientIndustry})`}
//             </p>
//             {clientEmail && (
//               <p style={{ margin: '0.3rem 0', color: '#475569' }}>
//                 <strong>Email:</strong> {clientEmail}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Content Sections */}
//         <div style={{ lineHeight: '1.8', fontSize: '1.06rem' }}>
//           {displayedContent.introduction && (
//             <section style={{ marginBottom: '2.5rem' }}>
//               <h4 style={{ color: '#1e40af', marginBottom: '0.9rem' }}>Introduction</h4>
//               <p style={{ whiteSpace: 'pre-wrap' }}>{displayedContent.introduction}</p>
//             </section>
//           )}

//           {displayedContent.understanding && (
//             <section style={{ marginBottom: '2.5rem' }}>
//               <h4 style={{ color: '#1e40af', marginBottom: '0.9rem' }}>Understanding Your Needs</h4>
//               <p style={{ whiteSpace: 'pre-wrap' }}>{displayedContent.understanding}</p>
//             </section>
//           )}

//           {displayedContent.scopeOfWork && (
//             <section style={{ marginBottom: '2.5rem' }}>
//               <h4 style={{ color: '#1e40af', marginBottom: '0.9rem' }}>Project Scope</h4>
//               <p style={{ whiteSpace: 'pre-wrap' }}>{displayedContent.scopeOfWork}</p>
//             </section>
//           )}

//           {displayedContent.timeline && (
//             <section style={{ marginBottom: '2.5rem' }}>
//               <h4 style={{ color: '#1e40af', marginBottom: '0.9rem' }}>Suggested Timeline</h4>
//               <p style={{ fontWeight: '500' }}>{displayedContent.timeline}</p>
//             </section>
//           )}

//           {/* Pricing Section */}
//           {displayedContent.pricing && (
//             <section style={{ marginBottom: '3rem' }}>
//               <h4 style={{ color: '#1e40af', fontSize: '1.45rem', marginBottom: '1.2rem' }}>
//                 Pricing
//               </h4>

//               <div
//                 style={{
//                   background: '#f8fafc',
//                   borderRadius: '12px',
//                   padding: '2rem',
//                   border: '1px solid #e2e8f0',
//                   boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
//                 }}
//               >
//                 <p
//                   style={{
//                     fontSize: '1.7rem',
//                     fontWeight: '700',
//                     color: '#1e40af',
//                     textAlign: 'center',
//                     marginBottom: '1.8rem',
//                   }}
//                 >
//                   {displayedContent.pricing}
//                 </p>

//                 {displayedContent.priceBreakdown?.length > 0 ? (
//                   <div
//                     style={{
//                       border: '1px solid #e2e8f0',
//                       borderRadius: '10px',
//                       overflow: 'hidden',
//                     }}
//                   >
//                     {displayedContent.priceBreakdown.map((item, idx) => (
//                       <div
//                         key={idx}
//                         style={{
//                           display: 'flex',
//                           justifyContent: 'space-between',
//                           padding: '1.3rem 1.8rem',
//                           background: idx % 2 === 0 ? '#ffffff' : '#f9fafb',
//                           borderBottom: '1px solid #e2e8f0',
//                         }}
//                       >
//                         <div style={{ flex: 1 }}>
//                           <div style={{ fontWeight: '600', fontSize: '1.08rem' }}>
//                             {item.category || item.item || 'Service'}
//                           </div>
//                           {item.description && (
//                             <div
//                               style={{
//                                 marginTop: '0.5rem',
//                                 color: '#64748b',
//                                 fontSize: '0.96rem',
//                                 lineHeight: '1.5',
//                               }}
//                             >
//                               {item.description}
//                             </div>
//                           )}
//                         </div>
//                         <div
//                           style={{
//                             fontWeight: '700',
//                             color: '#1e40af',
//                             fontSize: '1.18rem',
//                             minWidth: '140px',
//                             textAlign: 'right',
//                           }}
//                         >
//                           {item.cost || item.amount || '—'}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p style={{ color: '#64748b', textAlign: 'center', fontStyle: 'italic' }}>
//                     Detailed breakdown available upon request
//                   </p>
//                 )}
//               </div>
//             </section>
//           )}

//           {displayedContent.planType && (
//             <section style={{ marginBottom: '2rem' }}>
//               <h4 style={{ color: '#1e40af', marginBottom: '0.9rem' }}>Plan Type</h4>
//               <p style={{ fontWeight: '600', fontSize: '1.12rem' }}>{displayedContent.planType}</p>
//             </section>
//           )}

//           {paymentTerms && (
//             <section style={{ marginBottom: '2rem' }}>
//               <h4 style={{ color: '#1e40af', marginBottom: '0.9rem' }}>Payment Terms</h4>
//               <p style={{ whiteSpace: 'pre-wrap' }}>{paymentTerms}</p>
//             </section>
//           )}

//           {displayedContent.projectFeasibility && (
//             <section style={{ marginBottom: '2rem' }}>
//               <h4 style={{ color: '#1e40af', marginBottom: '0.9rem' }}>Project Feasibility</h4>
//               <p style={{ whiteSpace: 'pre-wrap', fontStyle: 'italic', color: '#374151' }}>
//                 {displayedContent.projectFeasibility}
//               </p>
//             </section>
//           )}

//           {displayedContent.closing && (
//             <section>
//               <h4 style={{ color: '#1e40af', marginBottom: '0.9rem' }}>Closing</h4>
//               <p style={{ whiteSpace: 'pre-wrap' }}>{displayedContent.closing}</p>
//             </section>
//           )}
//         </div>

//         {/* Action Buttons */}
//         <div
//           style={{
//             marginTop: '3.5rem',
//             display: 'flex',
//             gap: '1.2rem',
//             flexWrap: 'wrap',
//           }}
//         >
//           {pdfUrl ? (
//             <a
//               href={pdfUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="btn-primary"
//               style={{ background: '#10b981', textDecoration: 'none' }}
//             >
//               Download PDF
//             </a>
//           ) : (
//             <button className="btn-primary" disabled>
//               Generate PDF
//             </button>
//           )}

//           {status === 'Draft' && (
//             <button
//               className="btn-primary"
//               style={{ background: '#f59e0b' }}
//               onClick={() => handleStatusChange('Sent', 'Mark this proposal as Sent?')}
//               disabled={actionLoading}
//             >
//               {actionLoading ? 'Updating…' : 'Mark as Sent'}
//             </button>
//           )}

//           {status === 'Sent' && (
//             <>
//               <button
//                 className="btn-primary"
//                 style={{ background: '#10b981' }}
//                 onClick={() => handleStatusChange('Accepted', 'Mark this proposal as Accepted?')}
//                 disabled={actionLoading}
//               >
//                 {actionLoading ? 'Updating…' : 'Mark as Accepted'}
//               </button>

//               <button
//                 className="btn-primary"
//                 style={{ background: '#ef4444' }}
//                 onClick={() => handleStatusChange('Rejected', 'Mark this proposal as Rejected?')}
//                 disabled={actionLoading}
//               >
//                 {actionLoading ? 'Updating…' : 'Mark as Rejected'}
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// src/pages/ProposalPreview.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getProposalById,
  updateProposalStatus,
  chatEdit,
  regenerateProposal,
} from '../api/api';
import toast from 'react-hot-toast';

export default function ProposalPreview() {
  const { id } = useParams();

  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // Version selection
  const [selectedVersion, setSelectedVersion] = useState('latest');

  const chatEndRef = useRef(null);

  const fetchProposal = async () => {
    try {
      const res = await getProposalById(id);
      setProposal(res.data.data);
      setSelectedVersion('latest'); // reset to latest after fetch/regenerate
    } catch (err) {
      // interceptor handles toast
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposal();
  }, [id]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [proposal?.chatHistory]);

  const sendChatMessage = async () => {
    if (!chatMessage.trim()) return;
    setSending(true);

    try {
      const res = await chatEdit(id, { message: chatMessage.trim() });
      setProposal((prev) => ({ ...prev, chatHistory: res.data.chatHistory }));
      setChatMessage('');
      toast.success('Instruction sent');
    } catch (err) {
      toast.error('Failed to send');
    } finally {
      setSending(false);
    }
  };

  const handleRegenerate = async () => {
    if (!confirm('Regenerate full proposal with chat history? Creates new version.')) return;

    try {
      const res = await regenerateProposal(id);
      toast.success(res.data.message);
      await fetchProposal();
      setChatOpen(false);
    } catch (err) {
      toast.error('Regeneration failed');
    }
  };

  const handleStatusChange = async (newStatus, confirmMessage) => {
    if (!confirm(confirmMessage)) return;

    setActionLoading(true);
    try {
      await updateProposalStatus(id, newStatus);
      toast.success(`Marked as ${newStatus}`);
      await fetchProposal();
    } catch (err) {
      // interceptor handles error toast
    } finally {
      setActionLoading(false);
    }
  };

  // Generate PDF
  const generatePdf = async () => {
    setGeneratingPdf(true);
    try {
      const response = await fetch(`/api/proposals/${id}/pdf`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('PDF generation failed');

      const data = await response.json();
      setPdfPreviewUrl(data.pdfUrl);
      toast.success('PDF ready! Preview below.');
    } catch (err) {
      toast.error('Failed to generate PDF');
    } finally {
      setGeneratingPdf(false);
    }
  };

  if (loading) return <div className="card">Loading proposal...</div>;
  if (!proposal) return <div className="card">Proposal not found</div>;

  const {
    title,
    clientName,
    clientEmail,
    clientIndustry,
    aiContent: currentAiContent = {},
    status,
    pdfUrl,
    company = {},
    paymentTerms = '',
    versions = [],
    chatHistory = [],
  } = proposal;

  // Select content based on version
  const displayedContent =
    selectedVersion === 'latest'
      ? currentAiContent
      : versions.find((v) => v.versionNumber === Number(selectedVersion))?.aiContent ||
        currentAiContent;

  const currentVersionNumber = versions.length + 1;
  const isOldVersion = selectedVersion !== 'latest';

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2>{title || `Proposal for ${clientName}`}</h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link to="/proposals" style={{ color: '#64748b', textDecoration: 'none' }}>
            ← Back
          </Link>

          <span
            style={{
              padding: '8px 18px',
              borderRadius: '999px',
              fontSize: '14px',
              fontWeight: '600',
              backgroundColor:
                status === 'Draft' ? '#fef3c7' :
                status === 'Sent' ? '#dbeafe' :
                status === 'Accepted' ? '#d1fae5' :
                '#fee2e2',
              color:
                status === 'Draft' ? '#92400e' :
                status === 'Sent' ? '#1e40af' :
                status === 'Accepted' ? '#065f46' :
                '#991b1b',
            }}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Version Selector */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontWeight: '500', marginRight: '10px' }}>Version:</label>
        <select
          value={selectedVersion}
          onChange={(e) => setSelectedVersion(e.target.value)}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
        >
          <option value="latest">Latest – Version {currentVersionNumber}</option>
          {versions
            .slice()
            .reverse()
            .map((v) => (
              <option key={v.versionNumber} value={v.versionNumber}>
                Version {v.versionNumber} — {new Date(v.createdAt).toLocaleDateString()}
              </option>
            ))}
        </select>

        {isOldVersion && (
          <span style={{ color: '#dc2626', marginLeft: '10px', fontStyle: 'italic' }}>
            Viewing older version (read-only)
          </span>
        )}
      </div>

      {/* AI Chat Toggle */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        style={{
          background: '#8b5cf6',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: '1.5rem',
        }}
      >
        {chatOpen ? 'Close AI Chat' : 'Edit with AI Chat'}
      </button>

      {/* AI Chat Panel */}
      {chatOpen && (
        <div style={{
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '1.5rem',
          background: '#fff',
          marginBottom: '2rem',
        }}>
          <h4>AI Chat – Give instructions</h4>

          <div style={{
            height: '300px',
            overflowY: 'auto',
            marginBottom: '1rem',
            padding: '1rem',
            background: '#f8fafc',
            borderRadius: '8px',
          }}>
            {chatHistory.length === 0 && (
              <p style={{ color: '#64748b', textAlign: 'center' }}>
                Example: "Change timeline to 8 weeks" or "Add more focus on mobile"
              </p>
            )}

            {chatHistory.map((msg, i) => (
              <div key={i} style={{
                marginBottom: '1rem',
                textAlign: msg.isAdmin ? 'right' : 'left',
              }}>
                <div style={{
                  display: 'inline-block',
                  maxWidth: '80%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: msg.isAdmin ? '#2563eb' : '#e5e7eb',
                  color: msg.isAdmin ? 'white' : 'black',
                }}>
                  {msg.message}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type your change request..."
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendChatMessage())}
              disabled={sending}
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
            />
            <button
              onClick={sendChatMessage}
              disabled={sending}
              style={{
                background: '#2563eb',
                color: 'white',
                padding: '12px 20px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>

          <button
            onClick={handleRegenerate}
            style={{
              marginTop: '1.2rem',
              background: '#10b981',
              color: 'white',
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              width: '100%',
              cursor: 'pointer',
            }}
          >
            Regenerate Full Proposal (Version 2)
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="card" style={{ padding: '2.5rem' }}>
        {/* Company & Client Info */}
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {company.logoUrl && (
            <img
              src={company.logoUrl}
              alt="Company Logo"
              style={{ maxWidth: '160px', height: 'auto', borderRadius: '8px' }}
            />
          )}
          <div>
            <h3>{company.name || 'Your Company'}</h3>
            <p><strong>Proposal for:</strong> {clientName} {clientIndustry && `(${clientIndustry})`}</p>
            {clientEmail && <p><strong>Email:</strong> {clientEmail}</p>}
          </div>
        </div>

        {/* Content */}
        <div style={{ lineHeight: '1.8' }}>
          {displayedContent.introduction && (
            <section style={{ marginBottom: '2rem' }}>
              <h4>Introduction</h4>
              <p style={{ whiteSpace: 'pre-wrap' }}>{displayedContent.introduction}</p>
            </section>
          )}

          {displayedContent.understanding && (
            <section style={{ marginBottom: '2rem' }}>
              <h4>Understanding Your Needs</h4>
              <p style={{ whiteSpace: 'pre-wrap' }}>{displayedContent.understanding}</p>
            </section>
          )}

          {displayedContent.scopeOfWork && (
            <section style={{ marginBottom: '2rem' }}>
              <h4>Project Scope</h4>
              <p style={{ whiteSpace: 'pre-wrap' }}>{displayedContent.scopeOfWork}</p>
            </section>
          )}

          {displayedContent.timeline && (
            <section style={{ marginBottom: '2rem' }}>
              <h4>Suggested Timeline</h4>
              <p>{displayedContent.timeline}</p>
            </section>
          )}

          {/* Professional Pricing */}
          {displayedContent.pricing && (
            <section style={{ marginBottom: '2.5rem' }}>
              <h4>Pricing</h4>
              <div style={{
                background: '#f8fafc',
                borderRadius: '10px',
                padding: '1.5rem',
                border: '1px solid #e2e8f0',
              }}>
                <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#1e40af', textAlign: 'center' }}>
                  {displayedContent.pricing}
                </p>

                {displayedContent.priceBreakdown?.length > 0 ? (
                  <div style={{ marginTop: '1rem' }}>
                    {displayedContent.priceBreakdown.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '0.8rem 0',
                          borderBottom: '1px solid #e2e8f0',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: '600' }}>
                            {item.category || item.item || 'Item'}
                          </div>
                          {item.description && (
                            <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.3rem' }}>
                              {item.description}
                            </div>
                          )}
                        </div>
                        <div style={{ fontWeight: '700', color: '#1e40af' }}>
                          {item.cost || item.amount || '—'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#64748b', textAlign: 'center', fontStyle: 'italic' }}>
                    Detailed breakdown available upon request
                  </p>
                )}
              </div>
            </section>
          )}

          {displayedContent.planType && (
            <section style={{ marginBottom: '2rem' }}>
              <h4>Plan Type</h4>
              <p style={{ fontWeight: '600' }}>{displayedContent.planType}</p>
            </section>
          )}

          {paymentTerms && (
            <section style={{ marginBottom: '2rem' }}>
              <h4>Payment Terms</h4>
              <p>{paymentTerms}</p>
            </section>
          )}

          {displayedContent.projectFeasibility && (
            <section style={{ marginBottom: '2rem' }}>
              <h4>Project Feasibility</h4>
              <p style={{ fontStyle: 'italic' }}>{displayedContent.projectFeasibility}</p>
            </section>
          )}

          {displayedContent.closing && (
            <section>
              <h4>Closing</h4>
              <p>{displayedContent.closing}</p>
            </section>
          )}
        </div>

        {/* PDF Actions */}
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          {generatingPdf ? (
            <button disabled>Generating PDF...</button>
          ) : pdfPreviewUrl ? (
            <>
              <button onClick={() => window.open(pdfPreviewUrl, '_blank')}>
                Open PDF Preview
              </button>
              <a href={pdfPreviewUrl} download={`proposal-${proposal._id}.pdf`}>
                Download PDF
              </a>
            </>
          ) : (
            <button
  onClick={async () => {
    setGeneratingPdf(true);
    try {
      const versionParam = selectedVersion === 'latest' ? 'latest' : selectedVersion;
      const url = `/api/proposals/${id}/pdf?version=${versionParam}`;
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('PDF generation failed');

      const data = await response.json();
      setPdfPreviewUrl(data.pdfUrl);
      toast.success(`PDF ready for ${selectedVersion === 'latest' ? 'latest' : `Version ${selectedVersion}`}!`);
    } catch (err) {
      toast.error('Failed to generate PDF');
    } finally {
      setGeneratingPdf(false);
    }
  }}
  className="btn-primary"
  style={{ background: '#10b981' }}
  disabled={generatingPdf}
>
  {generatingPdf ? 'Generating...' : 'Generate PDF'}
</button>
          )}
        </div>

        {/* Status Actions */}
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          {status === 'Draft' && (
            <button
              className="btn-primary"
              style={{ background: '#f59e0b' }}
              onClick={() => handleStatusChange('Sent', 'Mark this proposal as Sent?')}
              disabled={actionLoading}
            >
              {actionLoading ? 'Updating…' : 'Mark as Sent'}
            </button>
          )}

          {status === 'Sent' && (
            <>
              <button
                className="btn-primary"
                style={{ background: '#10b981' }}
                onClick={() => handleStatusChange('Accepted', 'Mark this proposal as Accepted?')}
                disabled={actionLoading}
              >
                {actionLoading ? 'Updating…' : 'Mark as Accepted'}
              </button>

              <button
                className="btn-primary"
                style={{ background: '#ef4444' }}
                onClick={() => handleStatusChange('Rejected', 'Mark this proposal as Rejected?')}
                disabled={actionLoading}
              >
                {actionLoading ? 'Updating…' : 'Mark as Rejected'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}