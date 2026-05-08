'use client';

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-4 py-2 bg-brand-600 text-white rounded text-sm hover:bg-brand-700"
    >
      Print Receipt
    </button>
  );
}