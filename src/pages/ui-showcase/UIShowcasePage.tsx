import { useState } from 'react';
import ButtonSection from './sections/ButtonSection';
import InputSection from './sections/InputSection';
import BadgeSection from './sections/BadgeSection';
import CardSection from './sections/CardSection';
import FeedbackSection from './sections/FeedbackSection';
import FormSection from './sections/FormSection';
import DataSection from './sections/DataSection';
import OverlaySection from './sections/OverlaySection';

const SECTIONS = [
  { id: 'button', label: 'Button' },
  { id: 'input', label: 'Input' },
  { id: 'badge', label: 'Badge & Status' },
  { id: 'card', label: 'Card & Metric' },
  { id: 'feedback', label: 'Alert & Toast' },
  { id: 'form', label: 'Form Controls' },
  { id: 'data', label: 'Data Display' },
  { id: 'overlay', label: 'Overlay & Modal' },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

const UIShowcasePage = () => {
  const [active, setActive] = useState<SectionId>('button');

  const renderSection = () => {
    switch (active) {
      case 'button': return <ButtonSection />;
      case 'input': return <InputSection />;
      case 'badge': return <BadgeSection />;
      case 'card': return <CardSection />;
      case 'feedback': return <FeedbackSection />;
      case 'form': return <FormSection />;
      case 'data': return <DataSection />;
      case 'overlay': return <OverlaySection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-main-blue px-8 py-6 text-white">
        <h1 className="text-2xl font-bold">UI Component Showcase</h1>
        <p className="mt-1 text-sm text-white/70">shared/ui 컴포넌트 전체 예제</p>
      </div>

      <div className="flex">
        {/* 사이드 네비 */}
        <nav className="sticky top-0 h-screen w-52 shrink-0 border-r border-gray-200 bg-white p-4">
          <ul className="space-y-1">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => setActive(s.id)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                    active === s.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* 콘텐츠 */}
        <main className="flex-1 p-8">{renderSection()}</main>
      </div>
    </div>
  );
};

export default UIShowcasePage;
