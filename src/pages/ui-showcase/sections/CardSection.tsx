import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/shared/ui/card';
import { MetricCard } from '@/shared/ui/metric-card';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import ShowcaseBlock from './ShowcaseBlock';

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

const CardSection = () => (
  <div>
    <h2 className="mb-6 text-xl font-bold text-gray-900">Card & MetricCard</h2>

    <ShowcaseBlock
      title="Card — 기본"
      description="기본 Card 컴포넌트"
      code={`<Card>\n  <p>카드 내용</p>\n</Card>`}
    >
      <Card>
        <p className="text-sm text-gray-600">기본 카드입니다. 어떤 내용이든 담을 수 있어요.</p>
      </Card>
    </ShowcaseBlock>

    <ShowcaseBlock
      title="Card — 구조화된 레이아웃"
      description="CardHeader, CardTitle, CardDescription, CardContent, CardFooter 조합"
      code={`<Card>\n  <CardHeader>\n    <CardTitle>제목</CardTitle>\n    <CardDescription>설명</CardDescription>\n  </CardHeader>\n  <CardContent>내용</CardContent>\n  <CardFooter>푸터</CardFooter>\n</Card>`}
      vertical
    >
      <Card>
        <CardHeader>
          <CardTitle>고객 요약</CardTitle>
          <CardDescription>이번 달 주요 지표</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>총 고객 수</span>
              <span className="font-semibold text-gray-900">100,850명</span>
            </div>
            <div className="flex justify-between">
              <span>신규 고객</span>
              <span className="font-semibold text-green-600">+850명</span>
            </div>
            <div className="flex justify-between">
              <span>VIP 고객</span>
              <Badge variant="vip">20명</Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" fullWidth>자세히 보기</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>최근 상담</CardTitle>
          <CardDescription>오늘 처리된 상담 건수</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary-600">24건</p>
          <p className="mt-1 text-sm text-gray-500">어제보다 3건 증가</p>
        </CardContent>
      </Card>
    </ShowcaseBlock>

    <ShowcaseBlock
      title="MetricCard"
      description="대시보드용 지표 카드 — trend, icon 지원"
      code={`<MetricCard\n  label="현재 고객"\n  value="100,850"\n  unit="명"\n  trend={{ value: 5.2, isPositive: true, comparison: '지난주 대비' }}\n  icon={<UpIcon />}\n/>`}
    >
      <MetricCard
        label="현재 고객"
        value="100,850"
        unit="명"
        trend={{ value: 5.2, isPositive: true, comparison: '지난주 대비' }}
        icon={<UpIcon />}
      />
      <MetricCard
        label="이탈 고객"
        value="320"
        unit="명"
        trend={{ value: 1.8, isPositive: false, comparison: '전월 대비' }}
        icon={<DownIcon />}
      />
      <MetricCard
        label="신규 가입"
        value="850"
        unit="명"
        trend={{ value: 12.3, isPositive: true, comparison: '지난달 대비' }}
        icon={<UpIcon />}
      />
      <MetricCard
        label="총 매출"
        value="₩48.2M"
      />
    </ShowcaseBlock>

    <ShowcaseBlock
      title="PageHeader"
      description="페이지 상단 헤더 — title, description, actions"
      code={`<PageHeader\n  title="고객 목록"\n  description="고객 정보를 관리하세요"\n  actions={<Button>추가</Button>}\n/>`}
      vertical
    >
      <div className="w-full space-y-6">
        <div className="rounded-lg border border-gray-200 p-4">
          <PageHeader title="고객 목록" />
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <PageHeader
            title="고객 목록"
            description="고객 정보를 한눈에 관리하고 상담 현황을 추적하세요"
          />
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <PageHeader
            title="고객 목록"
            description="고객 정보를 한눈에 관리하고 상담 현황을 추적하세요"
            actions={
              <div className="flex gap-2">
                <Button variant="outline" size="sm">내보내기</Button>
                <Button size="sm">고객 추가</Button>
              </div>
            }
          />
        </div>
      </div>
    </ShowcaseBlock>
  </div>
);

export default CardSection;
