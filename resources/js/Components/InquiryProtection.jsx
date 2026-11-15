import React from 'react';

export default function InquiryProtection({ value, onChange }) {
  return (
    <label aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
      Website
      <input name="website" type="text" tabIndex={-1} autoComplete="off" value={value} onChange={event => onChange(event.target.value)} />
    </label>
  );
}
