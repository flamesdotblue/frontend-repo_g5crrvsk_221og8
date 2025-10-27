import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Templates from './components/Templates.jsx';
import Editor from './components/Editor.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [activeTemplate, setActiveTemplate] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Templates onSelectTemplate={setActiveTemplate} />
        <Editor activeTemplate={activeTemplate} onClose={() => setActiveTemplate(null)} />
      </main>
      <Footer />
    </div>
  );
}
