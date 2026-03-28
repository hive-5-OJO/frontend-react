import type { Channel, ChannelMember } from '../model/types';

/**
 * 채널 목 데이터 (인메모리 저장소)
 */
let nextChannelId = 4;
let nextMemberId = 100;

const mockChannels: Channel[] = [
  {
    id: 1, adminId: 1, name: 'VIP 고객 채널',
    description: 'VIP 등급 고객 전용 채널', status: 'ACTIVE',
    memberCount: 3, createdAt: '2026-01-15T10:00:00', updatedAt: '2026-02-10T14:30:00',
  },
  {
    id: 2, adminId: 1, name: '이탈 우려 고객',
    description: '이탈 위험이 있는 고객 관리 채널', status: 'ACTIVE',
    memberCount: 2, createdAt: '2026-02-01T09:00:00', updatedAt: '2026-02-08T11:00:00',
  },
  {
    id: 3, adminId: 1, name: '프로모션 대상',
    description: '신규 프로모션 안내 대상 고객', status: 'ACTIVE',
    memberCount: 5, createdAt: '2026-02-20T15:00:00', updatedAt: '2026-03-01T09:00:00',
  },
];

const mockMembers: Record<number, ChannelMember[]> = {
  1: [
    { id: 1, channelId: 1, memberId: 10001 },
    { id: 2, channelId: 1, memberId: 10006 },
    { id: 3, channelId: 1, memberId: 10011 },
  ],
  2: [
    { id: 4, channelId: 2, memberId: 10004 },
    { id: 5, channelId: 2, memberId: 10009 },
  ],
  3: [
    { id: 6, channelId: 3, memberId: 10002 },
    { id: 7, channelId: 3, memberId: 10003 },
    { id: 8, channelId: 3, memberId: 10007 },
    { id: 9, channelId: 3, memberId: 10012 },
    { id: 10, channelId: 3, memberId: 10015 },
  ],
};

export const getMockChannelList = (): Channel[] => {
  return [...mockChannels];
};

export const createMockChannel = (data: { name: string; description: string }): Channel => {
  const now = new Date().toISOString();
  const channel: Channel = {
    id: nextChannelId++,
    adminId: 1,
    name: data.name,
    description: data.description,
    status: 'ACTIVE',
    memberCount: 0,
    createdAt: now,
    updatedAt: now,
  };
  mockChannels.push(channel);
  mockMembers[channel.id] = [];
  return channel;
};

export const getMockChannelMembers = (channelId: number): ChannelMember[] => {
  return mockMembers[channelId] || [];
};

export const addMockChannelMembers = (channelId: number, memberIds: number[]): void => {
  if (!mockMembers[channelId]) mockMembers[channelId] = [];
  const existing = new Set(mockMembers[channelId].map((m) => m.memberId));
  for (const memberId of memberIds) {
    if (!existing.has(memberId)) {
      mockMembers[channelId].push({ id: nextMemberId++, channelId, memberId });
    }
  }
  const ch = mockChannels.find((c) => c.id === channelId);
  if (ch) ch.memberCount = mockMembers[channelId].length;
};

export const deleteMockChannel = (channelId: number): void => {
  const idx = mockChannels.findIndex((c) => c.id === channelId);
  if (idx !== -1) mockChannels.splice(idx, 1);
  delete mockMembers[channelId];
};

export const removeMockChannelMember = (channelId: number, memberId: number): void => {
  if (!mockMembers[channelId]) return;
  mockMembers[channelId] = mockMembers[channelId].filter((m) => m.memberId !== memberId);
  const ch = mockChannels.find((c) => c.id === channelId);
  if (ch) ch.memberCount = mockMembers[channelId].length;
};
