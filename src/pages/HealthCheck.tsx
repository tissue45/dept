import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FaCheckCircle } from 'react-icons/fa';

type DemoMessage = {
  id: string;
  body: string;
  created_at: string;
};

export default function HealthCheck() {
  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('demo_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) setStatus(`❌ Select error: ${error.message}`);
    else {
      setMessages(data ?? []);
      setStatus('✅ Select OK');
    }
  };

  const addMessage = async () => {
    setLoading(true);
    setStatus('⏳ Inserting...');
    const body = `Hello @ ${new Date().toLocaleString()}`;
    const { error } = await supabase.from('demo_messages').insert({ body });

    if (error) setStatus(`❌ Insert error: ${error.message}`);
    else setStatus('✅ Insert OK');

    setLoading(false);
    fetchMessages();
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-xl shadow p-6 space-y-4">
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-green-600" />
          <h1 className="text-xl font-semibold">환경 점검</h1>
        </div>

        <button
          onClick={addMessage}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '처리 중...' : '메시지 추가'}
        </button>

        <div className="text-sm">{status}</div>

        <div className="border-t pt-4">
          <h2 className="font-medium mb-2">최근 메시지</h2>
          <ul className="space-y-1 text-sm">
            {messages.map((m) => (
              <li key={m.id} className="flex justify-between">
                <span>{m.body}</span>
                <span className="text-gray-400">
                  {new Date(m.created_at).toLocaleString()}
                </span>
              </li>
            ))}
            {messages.length === 0 && (
              <li className="text-gray-400">데이터 없음</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}