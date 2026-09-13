export type ScreenTab = 'chats' | 'explore' | 'stems-music' | 'profile';

export interface CreatorStory {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  badge?: string;
  badgeType?: 'live' | 'vocal' | 'music' | 'repeat' | 'add';
  isLive?: boolean;
  listenerCount?: number;
  snippetTitle?: string;
  bpm?: number;
  key?: string;
}

export interface ChatItem {
  id: string;
  type: 'channel' | 'dm' | 'group';
  categories: ('all' | 'dms' | 'channels' | 'stems')[];
  title: string;
  handle?: string;
  avatar?: string;
  avatarType?: 'image' | 'icon' | 'grid';
  iconName?: string;
  avatarGrid?: { label: string; bg: string }[];
  isPinned?: boolean;
  isVerified?: boolean;
  time: string;
  statusText?: string;
  previewText: string;
  badgeCount?: number;
  isDelivered?: boolean;
  isTyping?: boolean;
  typingUser?: string;
  hasAudioPreview?: boolean;
  audioDetails?: {
    bpm: number;
    key: string;
    fileName: string;
    duration?: string;
  };
  hasVoiceMemo?: boolean;
  voiceMemoDuration?: string;
  voiceMemoDesc?: string;
  badges?: { text: string; icon?: string; color: string; bg: string }[];
  membersCount?: number;
}

export interface SearchMatch {
  id: string;
  handle: string;
  displayName: string;
  avatar?: string;
  isChannel?: boolean;
  channelIcon?: string;
  isVerified?: boolean;
  badge?: string;
  badgeColor?: string;
  subtitle: string;
  statusIndicator?: {
    type: 'online' | 'voice_jam' | 'members' | 'follows';
    text: string;
    icon?: string;
  };
  actionType: 'message' | 'join' | 'connect';
}

export interface TrendingStem {
  id: string;
  title: string;
  creatorHandle: string;
  listeners: string;
  bpm: number;
  key: string;
  audioTag: string;
  duration: string;
  fileName: string;
  waveformType: 'primary' | 'muted';
}

export interface MixerTrack {
  id: string;
  name: string;
  db: string;
  icon: string;
  color: string;
  isSolo: boolean;
  isMute: boolean;
  level: number;
  animated: boolean;
}

export interface CommunityStem {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  description: string;
  bpm: number;
  key: string;
  fileName: string;
  audioSpec: string;
  remixesCount: number;
  fileSize: string;
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'other';
  senderName?: string;
  text?: string;
  timestamp: string;
  stemAttachment?: {
    fileName: string;
    bpm: number;
    key: string;
    duration: string;
  };
  voiceMemo?: {
    duration: string;
  };
}
