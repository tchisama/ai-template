// TitleInput.tsx
import React from 'react';
import { Edit2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TitleInputProps {
  value: string | undefined;
  onChange: (value: string) => void;
}

const TitleInput: React.FC<TitleInputProps> = ({ value, onChange }) => (
  <div className='flex items-center'>
    <Input
      onChange={(e) => onChange((e.target as any).value)}
      value={value}
      placeholder='Title of the sketch'
      className='bg-gray-50 pr-9'
    />
    <Edit2 size={16} className='-translate-x-7' />
  </div>
)
