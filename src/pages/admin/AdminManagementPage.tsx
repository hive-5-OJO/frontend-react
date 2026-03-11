import { useState } from 'react';
import { DashboardLayout } from '@/widgets/dashboard-layout';
import { useAdminList } from '@/entities/admin';
import { useUpdateAdminRole } from '@/features/admin/update-role/model/useUpdateAdminRole';
import { useUpdateAdminStatus } from '@/features/admin/update-status/model/useUpdateAdminStatus';
import {
  PageHeader,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Pagination,
  SearchInput,
  FilterToggleButton,
} from '@/shared/ui';
import type { Admin } from '@/entities/admin/model/types';

const AdminManagementPage = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const { data, isLoading, error } = useAdminList({ page, size: pageSize });
  const { mutate: updateRole } = useUpdateAdminRole();
  const { mutate: updateStatus } = useUpdateAdminStatus();

  const admins = data?.content || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 1;

  // 검색 필터링 (클라이언트 사이드)
  const filteredAdmins = searchTerm.trim()
    ? admins.filter(
        (admin) =>
          admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          admin.phone.includes(searchTerm)
      )
    : admins;

  const getRoleBadgeVariant = (role: string) => {
    if (role === 'ADMIN' || role === 'ROLE_ADMIN') return 'primary';
    if (role === 'MARKETING') return 'info';
    if (role === 'CS') return 'default';
    return 'default';
  };

  const getStatusBadgeVariant = (status: string) => {
    if (status === 'ACTIVE') return 'success';
    if (status === 'INACTIVE') return 'error';
    return 'default';
  };

  const getRoleLabel = (role: string) => {
    if (role === 'ADMIN' || role === 'ROLE_ADMIN') return '관리자';
    if (role === 'MARKETING') return '마케팅';
    if (role === 'CS') return '상담사';
    if (role === 'GUEST') return '게스트';
    return role;
  };

  const getStatusLabel = (status: string) => {
    if (status === 'ACTIVE') return '활성';
    if (status === 'INACTIVE') return '비활성';
    return status;
  };

  const handleRoleChange = (admin: Admin, newRole: string) => {
    updateRole({ adminId: admin.adminId, role: newRole });
  };

  const handleStatusChange = (admin: Admin, newStatus: string) => {
    updateStatus({ adminId: admin.adminId, status: newStatus });
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const displayPage = page + 1;
  const start = page * pageSize;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 pb-6">
        {/* 필터 섹션 */}
        <div className="flex-shrink-0 rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="p-6 pb-4">
            <PageHeader
              title="관리자 권한 설정"
              description="관리자 계정의 권한과 상태를 관리합니다"
              actions={
                <FilterToggleButton
                  isOpen={isFilterOpen}
                  onToggle={() => setIsFilterOpen(!isFilterOpen)}
                />
              }
            />

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <h3 className="text-sm font-semibold text-gray-700">검색</h3>
              </div>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="text-right">
                  <p className="text-xl font-bold text-primary-600 md:text-2xl">
                    {isLoading ? '...' : totalElements}
                  </p>
                  <p className="text-xs text-gray-500">명의 관리자</p>
                </div>
              </div>
            </div>
          </div>

          {isFilterOpen && (
            <div className="space-y-4 px-6 pb-6">
              <SearchInput
                placeholder="관리자 이름, 이메일, 전화번호 검색"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              {searchTerm && (
                <div className="rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700">
                  <span className="font-medium">"{searchTerm}"</span> 검색 결과:{' '}
                  {filteredAdmins.length}명
                </div>
              )}
            </div>
          )}
        </div>

        {/* 테이블 */}
        <div className="flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
                <p className="text-gray-600">관리자 목록을 불러오는 중...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className="max-w-md text-center">
                <div className="mb-4 flex justify-center">
                  <svg
                    className="h-16 w-16 text-error-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <p className="mb-2 text-lg font-semibold text-error-600">
                  데이터를 불러오는데 실패했습니다
                </p>
                <p className="mb-4 text-sm text-gray-600">잠시 후 다시 시도해주세요</p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <div
                  className="table-scroll overflow-y-auto scroll-smooth"
                  style={{ height: '589px', minWidth: '800px' }}
                >
                  <table className="w-full">
                    <thead className="sticky top-0 z-10 border-b border-gray-200 bg-primary-50">
                      <tr>
                        <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700">
                          구분
                        </th>
                        <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700">
                          이름
                        </th>
                        <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700">
                          이메일
                        </th>
                        <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700">
                          전화번호
                        </th>
                        <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700">
                          로그인 방식
                        </th>
                        <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700">
                          권한
                        </th>
                        <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700">
                          상태
                        </th>
                        <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700">
                          가입일
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAdmins.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-16 text-center">
                            <div className="flex flex-col items-center justify-center gap-3">
                              <svg
                                className="h-16 w-16 text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <div>
                                <p className="text-lg font-medium text-gray-700">
                                  검색 결과가 없습니다
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                  검색어를 다시 확인해주세요
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredAdmins.map((admin, idx) => (
                          <tr
                            key={admin.adminId}
                            className="border-b border-gray-100 transition hover:bg-primary-50/30"
                          >
                            <td className="px-4 py-3 text-center text-sm text-gray-500">
                              {start + idx + 1}
                            </td>
                            <td className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                              {admin.name}
                            </td>
                            <td className="px-4 py-3 text-center text-sm text-gray-600">
                              {admin.email}
                            </td>
                            <td className="px-4 py-3 text-center text-sm text-gray-600">
                              {admin.phone}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Badge variant={admin.google ? 'info' : 'default'}>
                                {admin.google ? 'Google' : '일반'}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex justify-center">
                                <Select
                                  value={admin.role}
                                  onValueChange={(value) => handleRoleChange(admin, value)}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue>
                                      <Badge variant={getRoleBadgeVariant(admin.role)}>
                                        {getRoleLabel(admin.role)}
                                      </Badge>
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="ADMIN">관리자</SelectItem>
                                    <SelectItem value="MARKETING">마케팅</SelectItem>
                                    <SelectItem value="CS">상담사</SelectItem>
                                    <SelectItem value="GUEST">게스트</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex justify-center">
                                <Select
                                  value={admin.status}
                                  onValueChange={(value) => handleStatusChange(admin, value)}
                                >
                                  <SelectTrigger className="w-24">
                                    <SelectValue>
                                      <Badge variant={getStatusBadgeVariant(admin.status)}>
                                        {getStatusLabel(admin.status)}
                                      </Badge>
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="ACTIVE">활성</SelectItem>
                                    <SelectItem value="INACTIVE">비활성</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center text-sm text-gray-600">
                              {new Date(admin.createdAt).toLocaleDateString('ko-KR')}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-gray-100 bg-white px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6 md:py-4">
                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">{start + 1}</span>
                    <span className="mx-1 text-gray-400">-</span>
                    <span className="font-semibold">
                      {Math.min(start + pageSize, totalElements)}
                    </span>
                    <span className="mx-1 text-gray-400">/</span>
                    <span className="font-semibold text-primary-600">{totalElements}</span>
                    <span className="ml-1 text-gray-500">명</span>
                  </div>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(val) => {
                      setPageSize(parseInt(val, 10));
                      setPage(0);
                    }}
                  >
                    <SelectTrigger size="sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10개/페이지</SelectItem>
                      <SelectItem value="20">20개/페이지</SelectItem>
                      <SelectItem value="50">50개/페이지</SelectItem>
                      <SelectItem value="100">100개/페이지</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-center md:justify-end">
                  <Pagination
                    currentPage={displayPage}
                    totalPages={totalPages}
                    onPageChange={(p) => setPage(p - 1)}
                    maxVisible={5}
                    showFirstLast
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminManagementPage;
