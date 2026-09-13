import { CreatorStory, ChatItem, SearchMatch, TrendingStem, MixerTrack, CommunityStem, ChatMessage } from '../types';

export const APP_LOGO_URL =
  'https://lh3.googleusercontent.com/aida/AEtjO1Xrgo1L8H1J-Euf9AqMlFTzNRVRegfTBFU9QemmsyeicHmyd-3L3Q0EHyWjY496kGR-onzW-pW_Zg2L18GZh9Q8FbPeG-GJ0IRyyLSiTNJliFcPRjQMVNyj_74mqtU1Zg5B-bopgJNvWKfniT7nvR7Etp51Kx3wgVsZuKKiFZW52nCu10FhH5X_7kK1OUCfdd9Oo2pTDDx51fGdz-62PvwrX0kZzCmOSh-1MIyzMsmT7kNFWRXvEcmsm3o';

export const USER_PROFILE_URL =
  'https://lh3.googleusercontent.com/aida/AEtjO1UytKXyV0_uclcjJFTkqGt_NLCVg7YuSURaM3PgxW8_s6su1QQ90f4W805mTYvj-mBZYDjtQTrjVD1NDOLt5EfR8cjGYNCNlv9O-Z4KsKz72Vv2rjFExT4N3-kgRKrt3PJQTASki-PnlV3JUL4CBZQCNv-tclymXh2BHyNfMgggVGuvvsCfnIGgYGhAmGAiogUFRfMndKM5k49XSpQR9sU7li8YSaXeKNt_5Ay3ZiRAx_2jwCnFlyMGMA';

export const CREATOR_STORIES: CreatorStory[] = [
  {
    id: 'post-stem',
    name: 'Post Stem',
    handle: '',
    avatar: '',
    badgeType: 'add',
  },
  {
    id: 'kael',
    name: 'Kael Rivera',
    handle: '@kael.meki',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDCUek9J3hDyFSont32i75nN9JN_rE0jOrUBfBB5vfntJXqTq-O1xf6e0mM1ScaxB_te7IceNFfT5vxsiqWsChpXBbbv_DL7OjKh_TKp-OVwQhLBAjIz_A-xGA5ugf5ReBeD0JTAEdaENstM7g0DiWDdIagEm2C45T0M_ken5RGrbVxOBJD24xr1Rbm2IDQVx_GP9wAKoJcjL02N7RSYjMeXlMtiXcDfspJD2luZue1gFvqn6UaeK1o',
    badge: 'Live 126',
    badgeType: 'live',
    isLive: true,
    listenerCount: 126,
    snippetTitle: 'Sidechain Acid Arp Drop',
    bpm: 126,
    key: 'F#m',
  },
  {
    id: 'synth',
    name: 'Synthwave Queen',
    handle: '@synth.meki',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAN0Fka9pz3K2-isF9rgNO4MoLTSuPv_f7UK7uxz6Tf4KK4gIyff8uvemrXVPJueuobqdawb-PMr0QEY72QOgG29X_yE5laFI_e0whvdI2GxXbf1au8RcRUk9j3iS1EXkUBhsj3QY_JdVLtBswzw413soE6Tl0-ZvC8-kWaO5vLdLYZCgIg4KhCnQmjyI0t63_el6KpvuQE_ayYJiyJ6k5mW0yybqwLvRAojZwaYGwP3dr7LKPd9aEL',
    badgeType: 'music',
    snippetTitle: 'Jupiter-8 Warm Pads',
    bpm: 120,
    key: 'Am',
  },
  {
    id: 'elena',
    name: 'Elena Vance',
    handle: '@elena.audio',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCs_780w4Tx415lnWurkPAok80ntI0ftu5-dlmzfjTSCssm_RHLr2FOvhx_LJPa7iqmLN3oAM1RJs5KTzjc2VVHmRhB2ETV2oPp89eQsC-_8GH7ozJrMyZMpWSryuRbKLlZC5M1OFAuMvZvsszKEEyZb9z07i-wOCnDTXPozGuFewM9OL0_SKU-UaJ6jUvdXny3gfN9mzVHHuRV9vhZEPp-rdZCXR2x0oXgjShpC5qZIpIPjhDi9j6i',
    badge: 'Vocal Stem',
    badgeType: 'vocal',
    snippetTitle: 'Dreamy Harmonies Stem',
    bpm: 118,
    key: 'C#m',
  },
  {
    id: 'rhythm',
    name: 'Marcus Bell',
    handle: '@rhythm',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAEtJRqTqR8cD6n0XGGiN4yBy9oRfJzpESsqPBo0p9Hi_zU-X4OFdDogeSqFYcxZ_VNqA-5SsuMXJ1HhHwQWMUcggvlZxP7dWPohALIVZBKbZe2WMq-XEZfBuokBkv7lpQPAWBCtHXQ7eBAg4F6mBk5O4U8njGx7GcIIb9hpoK6z8iUHcM2FFnU-Rt4KlWUjXqQFJXF7rzyGdUvwPWkyldG_kK7Kiuj3Kiikxlun2NCrr71mP00e9Ln',
    badgeType: 'repeat',
    snippetTitle: 'Raw MPC Breakbeat 140',
    bpm: 140,
    key: 'Dm',
  },
];

export const CHAT_ITEMS: ChatItem[] = [
  {
    id: 'chat-meki-official',
    type: 'channel',
    categories: ['all', 'channels'],
    title: 'Meki Official',
    isPinned: true,
    isVerified: true,
    avatarType: 'icon',
    iconName: 'campaign',
    time: '12:30 AM',
    previewText:
      'Drop 04 Countdown: Modular Synth Packs unlocked in 45m! Presave is open.',
    badges: [
      {
        text: 'T-Minus 00:45:12',
        icon: 'timer',
        color: '#4edea3',
        bg: '#262a33',
      },
      {
        text: 'Free Pass',
        icon: 'token',
        color: '#dbb8ff',
        bg: '#262a33',
      },
    ],
  },
  {
    id: 'chat-kael',
    type: 'dm',
    categories: ['all', 'dms', 'stems'],
    title: 'Kael Rivera',
    handle: '@kael.meki',
    avatarType: 'image',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC-w6jWzWlOjEHQgMudNQFiuum0xtB-b71yFD21yaD9PzBUa_61pSBhX-Yoga2CF8o92yFIIotANAUZ65Gu3YJREvnb4aIWRbwUxLYxohA2VmOpJowu2eHMreP43rz0FtTaYS9EwXn1X-bnZoPLdRjQx9z_IL48cVz02m_Ku9z-gwi2GtvA6pAmb-i8q2ER10YpohSM6FE4c76k30bPT9fGJZuWHOSVMLheDOb_nOE3rL_w__2GVDpd',
    time: '12:15 AM',
    statusText: 'Delivered',
    isDelivered: true,
    badgeCount: 2,
    previewText: 'Check this sidechain stem before we fuse master.',
    hasAudioPreview: true,
    audioDetails: {
      bpm: 126,
      key: 'Fm',
      fileName: 'Sidechain_Master_126BPM.wav',
    },
  },
  {
    id: 'chat-80s-synth',
    type: 'group',
    categories: ['all', 'channels'],
    title: '80s Synth Producers',
    avatarType: 'grid',
    membersCount: 24,
    avatarGrid: [
      { label: '80s', bg: 'rgba(255, 79, 115, 0.4)' },
      { label: 'SYN', bg: 'rgba(219, 184, 255, 0.4)' },
      { label: 'LFO', bg: 'rgba(78, 222, 163, 0.4)' },
      { label: '+18', bg: '#353942' },
    ],
    time: 'Just now',
    previewText:
      'Alex: Has anyone dialed that Juno-106 chorus recreation in the master stem?',
    isTyping: true,
    typingUser: '@synth.meki',
  },
  {
    id: 'chat-elena',
    type: 'dm',
    categories: ['all', 'dms', 'stems'],
    title: 'Elena Vance',
    handle: '@elena.audio',
    avatarType: 'image',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAnBAa3Ug1mNoALNJAdiAJPEL7EFvbefr74-bCcXgIWzxkTXqu5fLf_kmJBu3QRzNOtks0UMw_0fajK4r25vftaD3ucib4-hSvxlqP0SineJarQM-95k6cMmx1vVjFuQANLY_NUHBtm5oPdvT8RK70L8pEf4KbyvC_IF3FaqFXMDBPA4gzZ0NideBWc6xSRL-01ijKx9PXOI9GWSyLboPkidZ2yZmJgazJPjFOUB5-dTDwe1FVS-u7T',
    time: 'Yesterday',
    previewText: 'Voice memo on bridge harmony progression',
    hasVoiceMemo: true,
    voiceMemoDuration: '0:42',
    voiceMemoDesc: 'Voice memo on bridge harmony progression',
  },
  {
    id: 'chat-marcus',
    type: 'dm',
    categories: ['all', 'stems'],
    title: 'Marcus Bell',
    handle: '@rhythm.beats',
    avatarType: 'image',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCetJZmjgFMAd3u571HQXdbAYOAgXiAQwC4L6S5Fl2beN9JAVsSlTQDbEfQShM68Feus5CMAtmBxjisqMCi0Wq9q-IJc0XRXSN8UvsbakVpTkH5mdF8tVvuO8bwH2PHHbEuRm6X1tZ_uocYse2aO6arWXr161L7UqNdX1wWg97DQv-C7aG22Gt80PQ6oPW4MEUavwZGZXGBrgkzgi129MCXt1dDTM-p0cBsKAG5lA4PSeGI8gOYaMLq',
    time: '3d ago',
    previewText: 'Sent 3 stems (.wav)',
    badges: [
      {
        text: 'Remix Collab Invite',
        icon: 'tune',
        color: '#d0a6ff',
        bg: '#6807ba',
      },
    ],
  },
];

export const SEARCH_MATCHES: SearchMatch[] = [
  {
    id: 'match-1',
    handle: '@synth.meki',
    displayName: 'Synthwave Queen',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCF3fx4SjQnZJkQAyOliB-31wSBE-Oz2iwdX4NZz-mmKJZkVjVLRmuncHzX4YwxuLK2WvFGIhNj-cOaTMO862PUNEKurpTml5fusHEE9PqN5QQjxLREiJDQWAaCgDdRpLp8jC2kbmwLHzMHfIcL94wBLjwPw0o_Eji1JGvFMZ-mjNmRzHl3E9J-nN9HgwK2o9hRNd2HfJmnHsodwb0VeXntCByhVmPioY2klApmc9lZqJJuy7yeS-7w',
    isVerified: true,
    subtitle: 'Synthwave producer • 12 stems shared',
    statusIndicator: {
      type: 'online',
      text: 'Online now',
    },
    actionType: 'message',
  },
  {
    id: 'match-2',
    handle: '@kael.meki',
    displayName: 'Kael Rivera',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBNGsuiS5VEO_hiYEEeVSIFB_wVXoy9twlmiW1wj7xwRtirgTbwTqsBAr7O02kIYSyVeRR8HZbZHAAOu7UzDGhN-2zcfeyIyyICPZ4-ml5aGK3gBg3YW_LIqHyOO0EY8r8hnFda1IV0evb2Vnw2Q67CjXZwCkxZ7R0J9NXTOv4WM0h1buF9QTgCX7HSYQ43QyEKaDfxe5j2IvL3V-Tit7Jy8auJ4pTVTnHeFmBwKQ377UoGPj2MNHjt',
    isVerified: true,
    subtitle: 'Analog synth enthusiast & vocalist',
    statusIndicator: {
      type: 'voice_jam',
      text: 'In voice jam',
      icon: 'graphic_eq',
    },
    actionType: 'message',
  },
  {
    id: 'match-3',
    handle: '@synth_lab',
    displayName: 'Synth Lab Archive',
    isChannel: true,
    channelIcon: 'groups',
    badge: 'Hub',
    badgeColor: '#ff4f73',
    subtitle: 'Community patch archive & stem lab',
    statusIndicator: {
      type: 'members',
      text: '1.4k members active',
    },
    actionType: 'join',
  },
  {
    id: 'match-4',
    handle: '@synthia_r',
    displayName: 'Synthia R',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBgeX9EKIo4vzp8YlczOWnHVrVl8IRRJpD9tD_k5yFRm91Gdl6Miv-6AYb4Km03xm4HC5brWP2MKFJLkTRoRaFnBoiu4IV5HLiXY8Kd9mcCz8qCGQEIZAkaDf833ISJXKQqGpW3uvBvU0muzo9ecWoOlkVN_PyVrL3WKkiRIeZuo77_Ep8DCw2VplCcRXknOe2GEKY0TSiNmfceQ2_SLyI-dikKXd3GuU3ad1DkzUJ0E_HuVu3UjAFM',
    badge: 'New',
    subtitle: 'Modular patch designer • 3 mutuals',
    statusIndicator: {
      type: 'follows',
      text: 'Follows @meki_official',
    },
    actionType: 'connect',
  },
];

export const TRENDING_STEMS: TrendingStem[] = [
  {
    id: 'stem-1',
    title: 'Neon Horizon Lead V3',
    creatorHandle: '@synth.meki',
    listeners: '8.4k',
    bpm: 126,
    key: 'F# Minor',
    audioTag: 'Dry Audio',
    duration: '0:32',
    fileName: 'Neon_Horizon_Lead_V3.wav',
    waveformType: 'primary',
  },
  {
    id: 'stem-2',
    title: 'Sub-Bass Genesis (Analog 808)',
    creatorHandle: '@synth_lab',
    listeners: '4.2k',
    bpm: 140,
    key: 'C Minor',
    audioTag: 'Bass Stem',
    duration: '0:45',
    fileName: 'Sub_Bass_Genesis_808.wav',
    waveformType: 'muted',
  },
];

export const MIXER_INITIAL_TRACKS: MixerTrack[] = [
  {
    id: 'drums',
    name: 'Drums',
    db: '0.0 dB',
    icon: 'album',
    color: '#4edea3',
    isSolo: false,
    isMute: false,
    level: 70,
    animated: true,
  },
  {
    id: 'subbass',
    name: 'Sub Bass',
    db: '-2.0 dB',
    icon: 'graphic_eq',
    color: '#dbb8ff',
    isSolo: false,
    isMute: false,
    level: 58,
    animated: true,
  },
  {
    id: 'juno',
    name: 'Juno-106',
    db: '+3.0 dB',
    icon: 'piano',
    color: '#ff4f73',
    isSolo: true,
    isMute: false,
    level: 88,
    animated: true,
  },
  {
    id: 'vocals',
    name: 'Vocals',
    db: 'Wet 40%',
    icon: 'mic',
    color: '#4edea3',
    isSolo: false,
    isMute: false,
    level: 40,
    animated: false,
  },
];

export const COMMUNITY_STEMS: CommunityStem[] = [
  {
    id: 'comm-1',
    authorName: 'Aria Vance',
    authorHandle: '@aria_synth',
    authorAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDeV2OQnf0L12wDb9AeqEzi9Tkm3ywR6P2h6WYLWhdx_SHVWkiOjtFZ3w906PPC-6mTJCiEJ224WNeGUa2TX3-llipq04Ts57zFRRNfrW5fMsUnNgtR8ceWhjgBhR9QSb-2RbQ9IqwxTf3YMZNaiYmLCMqus1ncA2RqKQCELWkHMwXduPD5oXqwzE5x_qWZjq9N73IIb2v5P31FzyhyAQ2IGdymVrxDQ6aD4i8U-HhryjKgCeHuTIoP',
    description: 'Shared Juno Lead & Reverb Stem',
    bpm: 126,
    key: 'F# Min',
    fileName: 'Juno_Lead_Dry_Stem.wav',
    audioSpec: '24-bit / 48kHz',
    remixesCount: 48,
    fileSize: '18.4 MB',
  },
  {
    id: 'comm-2',
    authorName: 'Kai Sterling',
    authorHandle: '@kaibeats',
    authorAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDL16PU0eQbfF9_p3YC4V83nkERncrDrlu7e_U7kkplWsDWwCahOCcz8DIZxQIljiX5YfDdNyukeWnZ-mTBiWDI-SXMcjV_Fb2T-T8wsh5BwteA9mfYvirkj0MhTPPankfLxvl08R6Dks9ul8QebirhFUbidJNYjRC0tVBqhGQNjM41z0_sTa5OagMIqxTFuB2uRNyu2rUDiQWylHiyGedSTpW4khQ_uwHO2bPHjp9B_oDTwjXwx5gv',
    description: 'Modular Moog Sub-Osc & 808 Loop',
    bpm: 126,
    key: 'D# Min',
    fileName: 'Analog_808_Sub_Punch.wav',
    audioSpec: '32-bit Float',
    remixesCount: 31,
    fileSize: '12.1 MB',
  },
];

export const INITIAL_CONVERSATION: Record<string, ChatMessage[]> = {
  'chat-kael': [
    {
      id: 'm-1',
      sender: 'other',
      senderName: 'Kael Rivera',
      text: 'Yo! Just finished rendering the second pass on that analog lead.',
      timestamp: '12:08 AM',
    },
    {
      id: 'm-2',
      sender: 'me',
      text: 'Send it over, I got the mixer bus calibrated to 126 BPM.',
      timestamp: '12:12 AM',
    },
    {
      id: 'm-3',
      sender: 'other',
      senderName: 'Kael Rivera',
      text: 'Check this sidechain stem before we fuse master.',
      stemAttachment: {
        fileName: 'Sidechain_Master_126BPM.wav',
        bpm: 126,
        key: 'Fm',
        duration: '0:34',
      },
      timestamp: '12:15 AM',
    },
  ],
  'chat-elena': [
    {
      id: 'e-1',
      sender: 'other',
      senderName: 'Elena Vance',
      text: 'Hey! Recorded some ethereal backing vocal takes for the bridge section.',
      timestamp: 'Yesterday 8:20 PM',
    },
    {
      id: 'e-2',
      sender: 'other',
      senderName: 'Elena Vance',
      voiceMemo: {
        duration: '0:42',
      },
      text: 'Voice memo on bridge harmony progression',
      timestamp: 'Yesterday 8:22 PM',
    },
    {
      id: 'e-3',
      sender: 'me',
      text: 'The harmonies around 0:24 sound super lush with that tape saturation!',
      timestamp: 'Yesterday 9:15 PM',
    },
  ],
};
