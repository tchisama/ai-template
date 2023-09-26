// MessageAlert.tsx
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RocketIcon } from 'lucide-react';

interface MessageAlertProps {
  example: () => void;
}

const MessageAlert: React.FC<MessageAlertProps> = ({ example }) => (
  <div className='w-full max-w-2xl'>
    <Alert className='shadow'>
      <RocketIcon className="h-4 w-4" />
      <AlertTitle>Ready to start</AlertTitle>
      <AlertDescription className='py-2'>
        Type what type of element you want me to create; you can specify the colors and the style you want.
      </AlertDescription>
      <AlertDescription>
        <div onClick={example} className='border hover:bg-gray-50 duration-150 flex text-gray-700 cursor-pointer justify-between mt-2 rounded-lg p-4'>
          Make me an e-commerce item card
        </div>
      </AlertDescription>
    </Alert>
  </div>
);

export default MessageAlert;
