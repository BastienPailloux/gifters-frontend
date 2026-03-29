// src/components/dashboard/DashboardChatInput.tsx
import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const DashboardChatInput: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const [value, setValue] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = value.trim();
    if (!text) return;
    navigate('/chat', { state: { initialMessage: text } });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={t('chatInput.placeholder')}
        className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm disabled:opacity-40 hover:bg-primary-600 transition-colors"
      >
        ✨
      </button>
    </form>
  );
};

export default DashboardChatInput;
