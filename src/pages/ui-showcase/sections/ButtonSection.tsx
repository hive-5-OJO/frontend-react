import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { IconButton } from '@/shared/ui/icon-button';
import { Tooltip } from '@/shared/ui/tooltip';
import ShowcaseBlock from './ShowcaseBlock';

const PlusIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const TrashIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const ButtonSection = () => {
  const [loading, setLoading] = useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-gray-900">Button</h2>

      <ShowcaseBlock
        title="Variants"
        description="5가지 variant — primary, secondary, outline, ghost, danger"
        code={`<Button variant="primary">Primary</Button>\n<Button variant="secondary">Secondary</Button>\n<Button variant="outline">Outline</Button>\n<Button variant="ghost">Ghost</Button>\n<Button variant="danger">Danger</Button>`}
      >
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Sizes"
        description="sm / md / lg"
        code={`<Button size="sm">Small</Button>\n<Button size="md">Medium</Button>\n<Button size="lg">Large</Button>`}
      >
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="With Icons"
        description="leftIcon / rightIcon prop"
        code={`<Button leftIcon={<PlusIcon />}>추가하기</Button>\n<Button variant="danger" leftIcon={<TrashIcon />}>삭제</Button>\n<Button variant="outline" rightIcon={<PlusIcon />}>내보내기</Button>`}
      >
        <Button leftIcon={<PlusIcon />}>추가하기</Button>
        <Button variant="danger" leftIcon={<TrashIcon />}>삭제</Button>
        <Button variant="outline" rightIcon={<PlusIcon />}>내보내기</Button>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Loading State"
        description="isLoading prop — 클릭하면 2초간 로딩 상태"
        code={`<Button isLoading={loading} onClick={handleLoadingDemo}>저장하기</Button>`}
      >
        <Button isLoading={loading} onClick={handleLoadingDemo}>
          {loading ? '저장 중...' : '저장하기 (클릭)'}
        </Button>
        <Button variant="outline" isLoading={loading}>
          {loading ? '처리 중...' : 'Outline Loading'}
        </Button>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Disabled & Full Width"
        description="disabled / fullWidth prop"
        code={`<Button disabled>비활성화</Button>\n<Button fullWidth>전체 너비</Button>`}
      >
        <Button disabled>비활성화</Button>
        <Button variant="secondary" disabled>Secondary Disabled</Button>
        <div className="w-full">
          <Button fullWidth>전체 너비 버튼</Button>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="IconButton"
        description="아이콘 전용 버튼 — variant, size, tooltip 지원"
        code={`<IconButton icon={<PlusIcon />} tooltip="추가" />\n<IconButton variant="secondary" icon={<TrashIcon />} tooltip="삭제" />\n<IconButton variant="danger" size="lg" icon={<TrashIcon />} />`}
      >
        <IconButton icon={<PlusIcon />} tooltip="추가" aria-label="추가" />
        <IconButton variant="secondary" icon={<PlusIcon />} tooltip="Secondary" aria-label="secondary" />
        <IconButton variant="outline" icon={<PlusIcon />} tooltip="Outline" aria-label="outline" />
        <IconButton variant="ghost" icon={<PlusIcon />} tooltip="Ghost" aria-label="ghost" />
        <IconButton variant="danger" icon={<TrashIcon />} tooltip="삭제" aria-label="삭제" />
        <IconButton size="sm" icon={<PlusIcon />} tooltip="Small" aria-label="small" />
        <IconButton size="lg" icon={<PlusIcon />} tooltip="Large" aria-label="large" />
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Tooltip"
        description="position: top / bottom / left / right"
        code={`<Tooltip content="위에 표시" position="top"><Button>Top</Button></Tooltip>`}
      >
        <Tooltip content="위에 표시" position="top"><Button variant="outline" size="sm">Top</Button></Tooltip>
        <Tooltip content="아래에 표시" position="bottom"><Button variant="outline" size="sm">Bottom</Button></Tooltip>
        <Tooltip content="왼쪽에 표시" position="left"><Button variant="outline" size="sm">Left</Button></Tooltip>
        <Tooltip content="오른쪽에 표시" position="right"><Button variant="outline" size="sm">Right</Button></Tooltip>
      </ShowcaseBlock>
    </div>
  );
};

export default ButtonSection;
