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
}

export interface ChannelMembersResponse {
  status: string;
  data: ChannelMember[];
  message: string;
}
