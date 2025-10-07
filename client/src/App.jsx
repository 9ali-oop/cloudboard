import React, { useEffect, useMemo, useState } from 'react'
import Editor from './components/Editor.jsx'
import { socket } from './lib/socket.js'

export default function App() {
  const [docId, setDocId] = useState(() => new URLSearchParams(location.search).get('doc') || 'welcome');
  const [user, setUser] = useState(() => localStorage.getItem('cb_user') || '');
  const [content, setContent] = useState('');
  const [presence, setPresence] = useState([]);
  const [typing, setTyping] = useState([]);

  useEffect(() => {
    if (!user) {
      const u = prompt('Enter a display name') || `user-${Math.random().toString(36).slice(2,7)}`;
      setUser(u);
      localStorage.setItem('cb_user', u);
    }
  }, []);

  useEffect(() => {
    if (!user || !docId) return;
    socket.emit('join_doc', { docId, user });

    socket.on('doc_init', ({ content }) => setContent(content || ''));
    socket.on('doc_patch', ({ content }) => setContent(content || ''));
    socket.on('presence', (list) => setPresence(list));
    socket.on('typing', (list) => setTyping(list));

    return () => {
      socket.off('doc_init');
      socket.off('doc_patch');
      socket.off('presence');
      socket.off('typing');
    }
  }, [user, docId]);

  const onChange = (val) => {
    setContent(val);
    socket.emit('doc_update', { docId, content: val });
    socket.emit('typing', { docId, user });
  };

  const shareUrl = useMemo(() => {
    const url = new URL(location.href);
    url.searchParams.set('doc', docId);
    return url.toString();
  }, [docId]);

  return (
    <div className="app">
      <header className="header">
        <h1>CloudBoard</h1>
        <div className="row">
          <input value={docId} onChange={(e)=>setDocId(e.target.value)} placeholder="note-id (e.g., team-notes)" />
          <button onClick={()=>{
            const url = new URL(location.href);
            url.searchParams.set('doc', docId);
            history.replaceState({}, '', url);
            socket.emit('join_doc', { docId, user });
          }}>Join</button>
          <button onClick={()=>navigator.clipboard.writeText(shareUrl)}>Copy Share URL</button>
        </div>
        <div className="meta">
          <span>Users: {presence.join(', ') || '—'}</span>
          <span className="typing">{typing.length ? `${typing.join(', ')} typing…` : ''}</span>
        </div>
      </header>
      <Editor value={content} onChange={onChange} />
      <footer className="footer">
        <small>Doc: {docId}</small>
      </footer>
    </div>
  )
}
