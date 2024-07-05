"use client"
// components/CopyToClipboardButton.js

import { useState } from 'react';
import copy from 'clipboard-copy';
import { Copy } from 'lucide-react';

const CopyToClipboardButton = ({ text }: {text : string}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = async () => {
    try {
      await copy(text);
      setIsCopied(true);
    } catch (error) {
      console.error('Failed to copy text to clipboard', error);
    }
  };

  return (
    <div>
      <button onClick={handleCopyClick}>
        {isCopied ? 'Copied!' :             <Copy className="h-4 w-4" />
        }
      </button>
    </div>
  );
};

export default CopyToClipboardButton;