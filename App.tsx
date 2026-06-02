import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './services/context';
import Layout from './components/Layout';
import Home from './pages/Home';
import ReadingPage from './pages/ReadingPage';
import AudioPage from './pages/AudioPage';
import BlogPage from './pages/BlogPage';
import BlogPost from './pages/BlogPost';
import GlobalAudioPlayer from './components/GlobalAudioPlayer';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Reading routes */}
            <Route path="/:lang/:id" element={<ReadingPage />} />
            
            <Route path="/audio" element={<AudioPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPost />} />
          </Routes>
          <GlobalAudioPlayer />
        </Layout>
      </Router>
    </AppProvider>
  );
};

export default App;