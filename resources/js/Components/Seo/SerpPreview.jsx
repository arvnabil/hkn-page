import React, { useEffect, useState } from 'react';

const EMPTY_PREVIEW = {
  title: 'Page title',
  description: 'A short description of this page will appear here.',
  url: window.location.origin,
  siteName: document.title,
};

export default function SerpPreview(props) {
  const [preview, setPreview] = useState({ ...EMPTY_PREVIEW, ...props });

  useEffect(() => {
    setPreview((current) => ({ ...current, ...props }));
  }, [props.title, props.description, props.url, props.siteName]);

  return (
    <div className="w-full max-w-[600px] rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm">
      <div className="mb-1 truncate text-sm text-[#202124]">{preview.siteName}</div>
      <div className="mb-1 truncate text-xs text-[#4d5156]">{preview.url}</div>
      <div className="mb-1 line-clamp-2 text-xl leading-6 text-[#1a0dab]">{preview.title}</div>
      <p className="m-0 line-clamp-2 text-sm leading-5 text-[#4d5156]">{preview.description}</p>
    </div>
  );
}
