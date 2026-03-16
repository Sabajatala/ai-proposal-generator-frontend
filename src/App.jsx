import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CompanyProfile from './pages/CompanyProfile';
import CreateProposal from './pages/CreateProposal';
import ProposalsList from './pages/ProposalsList';
import ProposalPreview from './pages/ProposalPreview';
import EditProposal from './pages/EditProposal';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Protected><Layout /></Protected>}>
            <Route index element={<Dashboard />} />
            <Route path="company-profile" element={<CompanyProfile />} />
            <Route path="create-proposal" element={<CreateProposal />} />
            <Route path="proposals" element={<ProposalsList />} />
            <Route path="proposals/:id" element={<ProposalPreview />} />
            <Route path="proposals/:id/edit" element={<EditProposal />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}