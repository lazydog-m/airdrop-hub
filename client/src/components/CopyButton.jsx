import { NOT_AVAILABLE } from '@/enums/enum';
import { Copy, CopyCheck } from 'lucide-react';
import * as React from 'react';
import { Badge } from './ui/badge';

export default function CopyButton({ text, textTooLong, copied, onCopy, ...other }) {
  return (
    <Badge
      onClick={text === NOT_AVAILABLE ? () => { } : onCopy}
      variant={'secondary'}
      className='custom-badge copy'
      {...other}>
      <span className={textTooLong ? 'text-too-long' : ''}>
        {text}
      </span>
      <span className='ms-4'>
        {text === NOT_AVAILABLE ? null : copied ? <CopyCheck size={'14px'} /> : <Copy size={'14px'} />}
      </span>
    </Badge>
  );
}
