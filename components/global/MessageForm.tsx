// MessageForm.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Stars } from 'lucide-react';

interface MessageFormProps {
  generate: (message: string) => void;
  loading: boolean;
}

const MessageForm: React.FC<MessageFormProps> = ({ generate, loading }) => {
  const [message, setMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generate(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className='flex-1 flex gap-2'>
      <Input value={message} onInput={(e) => setMessage((e.target as any).value)} />
      <Button type='submit' className='flex gap-2 shadow-xl'>
        {loading ? "Loading" : <>Generate<Stars size={20} /></>}
      </Button>
    </form>
  );
};

export default MessageForm;
