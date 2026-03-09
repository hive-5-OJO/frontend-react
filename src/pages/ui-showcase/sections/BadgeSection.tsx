import { Badge } from '@/shared/ui/badge';
import { TrendIndicator } from '@/shared/ui/trend-indicator';
import { Avatar } from '@/shared/ui/avatar';
import { Spinner } from '@/shared/ui/spinner';
import ShowcaseBlock from './ShowcaseBlock';

const StarIcon = () => (
  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const UpIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
  </svg>
);

const DownIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
);

const BadgeSection = () => (
  <div>
    <h2 className="mb-6 text-xl font-bold text-gray-900">Badge, Status & Indicators</h2>

    <ShowcaseBlock
      title="Badge Variants"
      description="primary / success / warning / error / info / vip / new / high / medium / low"
      code={`<Badge variant="primary">Primary</Badge>\n<Badge variant="vip">VIP</Badge>\n<Badge variant="high">HIGH</Badge>`}
    >
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="vip">VIP</Badge>
      <Badge variant="new">New</Badge>
      <Badge variant="high">HIGH</Badge>
      <Badge variant="medium">MEDIUM</Badge>
      <Badge variant="low">LOW</Badge>
    </ShowcaseBlock>

    <ShowcaseBlock
      title="Badge with Icons"
      description="아이콘 포함 가능한 배지"
      code={`<Badge variant="high">HIGH</Badge>\n<Badge variant="vip"><StarIcon /> VIP</Badge>`}
    >
      <Badge variant="high">HIGH</Badge>
      <Badge variant="medium">MEDIUM</Badge>
      <Badge variant="low">LOW</Badge>
      <Badge variant="vip"><StarIcon /> VIP</Badge>
      <Badge variant="success">활성</Badge>
      <Badge variant="default">기본</Badge>
    </ShowcaseBlock>

    <ShowcaseBlock
      title="TrendIndicator"
      description="상승/하락 트렌드 표시 — size: sm / md / lg"
      code={`<TrendIndicator value={5.2} isPositive={true} comparison="지난주 대비" icon={<UpIcon />} />\n<TrendIndicator value={3.1} isPositive={false} comparison="전월 대비" icon={<DownIcon />} />`}
      vertical
    >
      <div className="space-y-3">
        <div className="flex items-center gap-6">
          <TrendIndicator value={5.2} isPositive={true} comparison="지난주 대비" icon={<UpIcon />} size="sm" />
          <TrendIndicator value={5.2} isPositive={true} comparison="지난주 대비" icon={<UpIcon />} size="md" />
          <TrendIndicator value={5.2} isPositive={true} comparison="지난주 대비" icon={<UpIcon />} size="lg" />
        </div>
        <div className="flex items-center gap-6">
          <TrendIndicator value={3.1} isPositive={false} comparison="전월 대비" icon={<DownIcon />} size="sm" />
          <TrendIndicator value={3.1} isPositive={false} comparison="전월 대비" icon={<DownIcon />} size="md" />
          <TrendIndicator value={3.1} isPositive={false} comparison="전월 대비" icon={<DownIcon />} size="lg" />
        </div>
        <TrendIndicator value={12.5} isPositive={true} />
      </div>
    </ShowcaseBlock>

    <ShowcaseBlock
      title="Avatar"
      description="이미지 없을 때 fallback 텍스트 또는 기본 아이콘 표시 — size: xs / sm / md / lg / xl"
      code={`<Avatar fallback="김" size="md" />\n<Avatar src="https://..." alt="user" size="lg" />`}
    >
      <Avatar size="xs" fallback="김" />
      <Avatar size="sm" fallback="이" />
      <Avatar size="md" fallback="박" />
      <Avatar size="lg" fallback="최" />
      <Avatar size="xl" fallback="한" />
      <Avatar size="md" src="https://broken-url.jpg" alt="broken" fallback="오" />
      <Avatar size="md" />
    </ShowcaseBlock>

    <ShowcaseBlock
      title="Spinner"
      description="로딩 스피너 — size: sm / md / lg"
      code={`<Spinner size="sm" />\n<Spinner size="md" />\n<Spinner size="lg" />`}
    >
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Spinner size="sm" />
        <span>데이터 불러오는 중...</span>
      </div>
    </ShowcaseBlock>
  </div>
);

export default BadgeSection;
