import axiosInstance from '@/shared/lib/axios/instance';
import type { Channel, ChannelResponse, ChannelListResponse, AddMembersResponse, ChannelMember, ChannelMembersResponse } from '../model/types';

export const channelApi = {
  getList: async (): Promise<Channel[]> => {
    const response = await axiosInstance.get<ChannelListResponse>('/api/channels');
    return response.data.data;
  },

  create: async (data: { name: string; description: string }): Promise<Channel> => {
    const response = await axiosInstance.post<ChannelResponse>('/api/channels', data);
    return response.data.data;
  },

  getMembers: async (channelId: number): Promise<ChannelMember[]> => {
    const response = await axiosInstance.get<ChannelMembersResponse>(
      `/api/channels/${channelId}/members`,
    );
    return response.data.data;
  },

  addMembers: async (channelId: number, memberIds: number[]): Promise<void> => {
    await axiosInstance.post<AddMembersResponse>(
      `/api/channels/${channelId}/members`,
      { memberIds },
    );
  },

  delete: async (channelId: number): Promise<void> => {
    await axiosInstance.delete(`/api/channels/${channelId}`);
  },

  removeMember: async (channelId: number, memberId: number): Promise<void> => {
    await axiosInstance.delete(`/api/channels/${channelId}/members/${memberId}`);
  },
};
