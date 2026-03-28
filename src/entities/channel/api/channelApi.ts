import axiosInstance from '@/shared/lib/axios/instance';
import type { Channel, ChannelResponse, ChannelListResponse, AddMembersResponse, ChannelMember, ChannelMembersResponse } from '../model/types';
import { getMockChannelList, createMockChannel, getMockChannelMembers, addMockChannelMembers, deleteMockChannel, removeMockChannelMember } from './mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const channelApi = {
  getList: async (): Promise<Channel[]> => {
    if (USE_MOCK) {
      await delay(300);
      return getMockChannelList();
    }
    const response = await axiosInstance.get<ChannelListResponse>('/api/channels');
    return response.data.data;
  },

  create: async (data: { name: string; description: string }): Promise<Channel> => {
    if (USE_MOCK) {
      await delay(300);
      return createMockChannel(data);
    }
    const response = await axiosInstance.post<ChannelResponse>('/api/channels', data);
    return response.data.data;
  },

  getMembers: async (channelId: number): Promise<ChannelMember[]> => {
    if (USE_MOCK) {
      await delay(200);
      return getMockChannelMembers(channelId);
    }
    const response = await axiosInstance.get<ChannelMembersResponse>(
      `/api/channels/${channelId}/members`,
    );
    return response.data.data;
  },

  addMembers: async (channelId: number, memberIds: number[]): Promise<void> => {
    if (USE_MOCK) {
      await delay(300);
      addMockChannelMembers(channelId, memberIds);
      return;
    }
    await axiosInstance.post<AddMembersResponse>(
      `/api/channels/${channelId}/members`,
      { memberIds },
    );
  },

  delete: async (channelId: number): Promise<void> => {
    if (USE_MOCK) {
      await delay(200);
      deleteMockChannel(channelId);
      return;
    }
    await axiosInstance.delete(`/api/channels/${channelId}`);
  },

  removeMember: async (channelId: number, memberId: number): Promise<void> => {
    if (USE_MOCK) {
      await delay(200);
      removeMockChannelMember(channelId, memberId);
      return;
    }
    await axiosInstance.delete(`/api/channels/${channelId}/members/${memberId}`);
  },
};
