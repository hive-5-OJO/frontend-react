import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/widgets/dashboard-layout';
import { Card, CardContent, Badge, Button, PageHeader, DeleteConfirmModal } from '@/shared/ui';
import { useChannelList, useDeleteChannel } from '@/entities/channel';
import { ROUTES } from '@/shared/constants/routes';
import { Trash2, Users, ArrowRight } from 'lucide-react';

const ChannelsPage = () => {
  const { data: channels, isLoading } = useChannelList();
  const deleteChannel = useDeleteChannel();
  const navigate = useNavigate();

  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const handleDelete = (id: number, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteTarget({ id, name });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteChannel.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 pb-6">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <PageHeader
            title="고객 채널"
            description="마케팅 및 CS 관리를 위해 분류된 고객 그룹을 관리하세요"
          />
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
                <p className="text-gray-600">채널 목록을 불러오는 중...</p>
              </div>
            </div>
          </div>
        ) : !channels || channels.length === 0 ? (
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-col items-center justify-center py-20">
              <Users className="mb-4 h-16 w-16 text-gray-300" />
              <p className="mb-2 text-lg font-semibold text-gray-600">아직 생성된 채널이 없습니다</p>
              <p className="mb-6 text-sm text-gray-400">
                고객 목록에서 고객을 선택한 후 채널을 만들어보세요
              </p>
              <Button onClick={() => navigate(ROUTES.CUSTOMERS)}>
                전체 고객 보기
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {channels.map((channel) => (
              <Card
                key={channel.id}
                className="cursor-pointer transition hover:border-primary-200 hover:shadow-md"
                onClick={() => navigate(`${ROUTES.CHANNELS}/${channel.id}`)}
              >
                <CardContent className="p-5">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-gray-900">{channel.name}</h3>
                        <Badge
                          variant={channel.status === 'ACTIVE' ? 'success' : 'secondary'}
                          className="text-[10px]"
                        >
                          {channel.status === 'ACTIVE' ? '활성' : channel.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-gray-400">
                        {new Date(channel.createdAt).toLocaleDateString('ko-KR')} 생성
                      </p>
                    </div>
                    <Badge variant="secondary">
                      <Users className="mr-1 h-3 w-3" />
                      {channel.memberCount.toLocaleString()}명
                    </Badge>
                  </div>

                  {channel.description && (
                    <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                      {channel.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <button
                      onClick={(e) => handleDelete(channel.id, channel.name, e)}
                      className="flex items-center gap-1 text-xs text-gray-400 transition hover:text-error-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      삭제
                    </button>
                    <span className="flex items-center gap-1 text-xs font-medium text-primary-600">
                      상세 보기
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="채널 삭제"
        description={`"${deleteTarget?.name}" 채널을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        isPending={deleteChannel.isPending}
      />
    </DashboardLayout>
  );
};

export default ChannelsPage;
