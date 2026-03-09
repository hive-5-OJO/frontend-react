import { useState } from 'react';
import { Checkbox } from '@/shared/ui/checkbox';
import { Radio } from '@/shared/ui/radio';
import { FormField } from '@/shared/ui/form-field';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Button } from '@/shared/ui/button';
import ShowcaseBlock from './ShowcaseBlock';

const FormSection = () => {
  const [checked, setChecked] = useState(false);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [radioVal, setRadioVal] = useState('phone');
  const [formData, setFormData] = useState({ name: '', email: '', service: '', agree: false });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleItem = (val: string) => {
    setCheckedItems((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val],
    );
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name) e.name = '이름을 입력해주세요.';
    if (!formData.email) e.email = '이메일을 입력해주세요.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = '올바른 이메일 형식이 아닙니다.';
    if (!formData.service) e.service = '서비스를 선택해주세요.';
    if (!formData.agree) e.agree = '약관에 동의해주세요.';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) setSubmitted(true);
  };

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-gray-900">Form Controls</h2>

      <ShowcaseBlock
        title="Checkbox"
        description="단일 / 그룹 / 비활성화"
        code={`<Checkbox label="동의합니다" checked={checked} onChange={(e) => setChecked(e.target.checked)} />`}
        vertical
      >
        <div className="space-y-3">
          <Checkbox
            label="단일 체크박스"
            checked={checked}
            onCheckedChange={(checked) => setChecked(checked === true)}
          />
          <p className="text-xs text-gray-500">상태: {checked ? '✅ 체크됨' : '⬜ 미체크'}</p>

          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-gray-700">서비스 선택 (다중)</p>
            {['Basic', 'Pro', 'Enterprise'].map((item) => (
              <Checkbox
                key={item}
                label={item}
                checked={checkedItems.includes(item)}
                onChange={() => toggleItem(item)}
              />
            ))}
            <p className="text-xs text-gray-500">선택됨: {checkedItems.join(', ') || '없음'}</p>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-gray-700">비활성화</p>
            <Checkbox label="비활성화 (미체크)" disabled />
            <Checkbox label="비활성화 (체크됨)" disabled checked onChange={() => {}} />
          </div>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Radio"
        description="라디오 그룹 — 단일 선택"
        code={`<Radio label="휴대폰 인증" name="auth" value="phone" checked={radioVal === 'phone'} onChange={() => setRadioVal('phone')} />`}
        vertical
      >
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">인증 방식</p>
          {[
            { value: 'phone', label: '휴대폰 인증' },
            { value: 'email', label: '이메일 인증' },
            { value: 'kakao', label: '카카오 인증' },
          ].map((opt) => (
            <Radio
              key={opt.value}
              label={opt.label}
              name="auth-method"
              value={opt.value}
              checked={radioVal === opt.value}
              onChange={() => setRadioVal(opt.value)}
            />
          ))}
          <p className="text-xs text-gray-500">선택됨: {radioVal}</p>

          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-gray-700">비활성화</p>
            <Radio label="비활성화 옵션" disabled />
            <Radio label="비활성화 (선택됨)" disabled checked onChange={() => {}} />
          </div>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="FormField"
        description="label + input + error 메시지를 하나로 묶는 래퍼"
        code={`<FormField label="이름" required error="이름을 입력해주세요.">\n  <Input placeholder="홍길동" />\n</FormField>`}
        vertical
      >
        <div className="w-full space-y-4">
          <FormField label="이름" required>
            <Input placeholder="홍길동" />
          </FormField>
          <FormField label="이메일" required error="올바른 이메일 형식이 아닙니다.">
            <Input type="email" placeholder="example@email.com" value="wrong-email" onChange={() => {}} />
          </FormField>
          <FormField label="서비스" helperText="이용할 서비스를 선택하세요">
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="비고" helperText="선택 입력">
            <Input placeholder="추가 메모 (선택)" />
          </FormField>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="실제 폼 예제"
        description="유효성 검사 포함 — 빈 칸으로 제출해보세요"
        code={`// 유효성 검사 + FormField + Checkbox 조합 폼`}
        vertical
      >
        <div className="w-full">
          {submitted ? (
            <div className="rounded-lg bg-success-50 p-6 text-center">
              <p className="text-lg font-bold text-success-700">✅ 제출 완료!</p>
              <p className="mt-1 text-sm text-success-600">이름: {formData.name} / 이메일: {formData.email}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', service: '', agree: false }); }}>
                다시 시도
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="이름" required error={errors.name}>
                <Input
                  placeholder="홍길동"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={errors.name}
                />
              </FormField>
              <FormField label="이메일" required error={errors.email}>
                <Input
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={errors.email}
                />
              </FormField>
              <FormField label="서비스" required error={errors.service}>
                <Select
                  value={formData.service}
                  onValueChange={(value) => setFormData({ ...formData, service: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <Checkbox
                label="이용약관에 동의합니다 (필수)"
                checked={formData.agree}
                onCheckedChange={(checked) => setFormData({ ...formData, agree: checked === true })}
              />
              {errors.agree && <p className="text-xs text-error-600">{errors.agree}</p>}
              <Button type="submit" fullWidth>제출하기</Button>
            </form>
          )}
        </div>
      </ShowcaseBlock>
    </div>
  );
};

export default FormSection;
