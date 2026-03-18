import axiosInstance from '@/shared/lib/axios/instance';
import type {
  Channel,
  ChannelMember,
} from '../model/types';

interface CommonResponse<T> {
  status: string;
  data: T;
  message: string;
}

interface CreateChannelRequest {
  name: string;
  description: string;
}

interface AddChannelMembersRequest {
  memberIds: number[];
}

export const channelApi = {
  getList: async (): Promise<Channel[]> => {
    const response = await axiosInstance.get<CommonResponse<Channel[]>>('/api/channels');
    return response.data.data;
  },

  getMembers: async (channelId: number): Promise<ChannelMember[]> => {
    const response = await axiosInstance.get<CommonResponse<ChannelMember[]>>(
      `/api/channels/${channelId}/members`,
    );
    return response.data.data;
  },

  create: async (data: CreateChannelRequest): Promise<Channel> => {
    const response = await axiosInstance.post<CommonResponse<Channel>>('/api/channels', data);
    return response.data.data;
  },

  addMembers: async (
    channelId: number,
    memberIds: number[],
  ): Promise<ChannelMember[]> => {
    const response = await axiosInstance.post<CommonResponse<ChannelMember[]>>(
      `/api/channels/${channelId}/members`,
      { memberIds },
    );
    return response.data.data;
  },

  delete: async (channelId: number): Promise<void> => {
    await axiosInstance.delete(`/api/channels/${channelId}`);
  },

  removeMember: async (channelId: number, memberId: number): Promise<void> => {
    await axiosInstance.delete(`/api/channels/${channelId}/members/${memberId}`);
  },
};