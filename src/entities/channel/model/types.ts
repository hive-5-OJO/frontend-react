export interface Channel {
  id: number;
  adminId: number;
  name: string;
  description: string;
  status: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChannelResponse {
  status: string;
  data: Channel;
  message: string;
}

export interface ChannelListResponse {
  status: string;
  data: Channel[];
  message: string;
}

export interface AddMembersResponse {
  status: string;
  message: string;
}

export interface ChannelMember {
  id: number;
  channelId: number;
  memberId: number;

  name: string;
  phone?: string | null;
  email?: string | null;

  service?: string | null;
  servicePeriod?: string | null;
  consultCategory?: string | null;
  consultFrequency?: string | null;
  vip?: string | null;

  createdAt?: string;
}

export interface ChannelMembersResponse {
  status: string;
  data: ChannelMember[];
  message: string;
}