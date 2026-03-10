import { useState } from 'react';
import { Input } from '@/shared/ui/input';
import { SearchInput } from '@/shared/ui/search-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Divider } from '@/shared/ui/divider';
import ShowcaseBlock from './ShowcaseBlock';

const SearchIcon = () => (
  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const MailIcon = () => (
  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const InputSection = () => {
  const [search, setSearch] = useState('');
  const [value, setValue] = useState('');

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-gray-900">Input & Form Fields</h2>

      <ShowcaseBlock
        title="Input Types"
        description="text, email, password, number"
        code={`<Input type="text" placeholder="텍스트 입력" />\n<Input type="email" placeholder="이메일" />\n<Input type="password" placeholder="비밀번호" />`}
        vertical
      >
        <div className="w-full space-y-3">
          <Input type="text" placeholder="텍스트 입력" />
          <Input type="email" placeholder="이메일 주소" />
          <Input type="password" placeholder="비밀번호" />
          <Input type="number" placeholder="숫자 입력" />
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="With Icons"
        description="leftIcon / rightIcon prop"
        code={`<Input leftIcon={<MailIcon />} placeholder="이메일" />\n<Input leftIcon={<SearchIcon />} placeholder="검색" />`}
        vertical
      >
        <div className="w-full space-y-3">
          <Input leftIcon={<MailIcon />} placeholder="이메일 주소" />
          <Input leftIcon={<SearchIcon />} placeholder="검색어 입력" />
          <Input
            leftIcon={<SearchIcon />}
            rightIcon={<span className="text-xs text-gray-400">KR</span>}
            placeholder="아이콘 양쪽"
          />
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Error State"
        description="error prop으로 에러 메시지 표시"
        code={`<Input error="이메일 형식이 올바르지 않습니다" value="wrong@" />`}
        vertical
      >
        <div className="w-full space-y-3">
          <Input
            type="email"
            placeholder="이메일"
            value="wrong-email"
            error="이메일 형식이 올바르지 않습니다."
            onChange={() => {}}
          />
          <Input
            placeholder="필수 입력"
            error="이 필드는 필수입니다."
          />
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Controlled Input"
        description="실시간 입력 상태 반영"
        code={`const [value, setValue] = useState('');\n<Input value={value} onChange={(e) => setValue(e.target.value)} />`}
        vertical
      >
        <div className="w-full space-y-2">
          <Input
            placeholder="입력해보세요"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <p className="text-sm text-gray-500">
            입력값: <span className="font-medium text-primary-600">"{value}"</span>
            <span className="ml-2 text-gray-400">({value.length}자)</span>
          </p>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Disabled State"
        description="disabled prop"
        code={`<Input disabled placeholder="비활성화" />\n<Input disabled value="수정 불가" />`}
        vertical
      >
        <div className="w-full space-y-3">
          <Input disabled placeholder="비활성화 상태" />
          <Input disabled value="읽기 전용 값" onChange={() => {}} />
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="SearchInput"
        description="검색 전용 — 입력 시 X 버튼 자동 표시"
        code={`<SearchInput\n  placeholder="고객 이름 검색"\n  value={search}\n  onChange={(e) => setSearch(e.target.value)}\n  onClear={() => setSearch('')}\n/>`}
        vertical
      >
        <div className="w-full space-y-2">
          <SearchInput
            placeholder="고객 이름 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <p className="text-sm text-gray-500">검색어: <span className="font-medium text-primary-600">"{search}"</span></p>
          )}
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Select"
        description="드롭다운 선택 — Radix UI 기반, 완전한 커스터마이징 가능"
        code={`<Select>\n  <SelectTrigger>\n    <SelectValue placeholder="선택하세요" />\n  </SelectTrigger>\n  <SelectContent>\n    <SelectItem value="basic">Basic</SelectItem>\n    <SelectItem value="pro">Pro</SelectItem>\n  </SelectContent>\n</Select>`}
        vertical
      >
        <div className="w-full space-y-3">
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="서비스 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
          
          <Select disabled>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="비활성화 상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="disabled">비활성화</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Divider"
        description="solid / gradient, 텍스트 포함 가능, 수직 방향 지원"
        code={`<Divider />\n<Divider variant="gradient" />\n<Divider text="or" variant="gradient" />`}
        vertical
      >
        <div className="w-full space-y-4">
          <div>
            <p className="mb-2 text-xs text-gray-400">solid</p>
            <Divider />
          </div>
          <div>
            <p className="mb-2 text-xs text-gray-400">gradient</p>
            <Divider variant="gradient" />
          </div>
          <div>
            <p className="mb-2 text-xs text-gray-400">text + gradient</p>
            <Divider text="or" variant="gradient" />
          </div>
          <div>
            <p className="mb-2 text-xs text-gray-400">text + solid</p>
            <Divider text="계속하기" />
          </div>
          <div className="flex items-center gap-4">
            <p className="text-xs text-gray-400">vertical →</p>
            <div className="flex h-10 items-center gap-4">
              <span className="text-sm">왼쪽</span>
              <Divider orientation="vertical" />
              <span className="text-sm">오른쪽</span>
            </div>
          </div>
        </div>
      </ShowcaseBlock>
    </div>
  );
};

export default InputSection;
