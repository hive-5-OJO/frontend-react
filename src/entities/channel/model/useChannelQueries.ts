import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { channelApi } from '../api/channelApi';
import { queryKeys } from '@/shared/constants';

export const useChannelList = () => {
  return useQuery({
    queryKey: queryKeys.channel.lists(),
    queryFn: () => channelApi.getList(),
  });
};

export const useChannelMembers = (channelId: number, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.channel.members(channelId),
    queryFn: () => channelApi.getMembers(channelId),
    enabled,
  });
};

export const useCreateChannel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description: string }) =>
      channelApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.channel.all });
    },
  });
};

export const useAddChannelMembers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ channelId, memberIds }: { channelId: number; memberIds: number[] }) =>
      channelApi.addMembers(channelId, memberIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.channel.all });
    },
  });
};

export const useDeleteChannel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (channelId: number) => channelApi.delete(channelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.channel.all });
    },
  });
};

export const useRemoveChannelMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ channelId, memberId }: { channelId: number; memberId: number }) =>
      channelApi.removeMember(channelId, memberId),
    onSuccess: (_, { channelId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.channel.members(channelId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.channel.lists() });
    },
  });
};
