import { useState, type ReactNode } from 'react';

type ObjectivePanelProps = {
  className: string;
  label: string;
  children: ReactNode;
};

export function ObjectivePanel({ className, label, children }: ObjectivePanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className={`${className} objective-panel ${isOpen ? '' : 'is-collapsed'}`} aria-label={label}>
      <button className="objective-panel__toggle" type="button" aria-expanded={isOpen}
        aria-label={isOpen ? 'Скрыть задание' : 'Показать задание'}
        onClick={() => setIsOpen((value) => !value)}>
        <span aria-hidden="true">{isOpen ? '−' : '☰'}</span>
      </button>
      <div className="objective-panel__content">{children}</div>
    </aside>
  );
}
