// src/types/tik.json.ts
export interface TikTokApiResponse {
  status: string;
  result: {
    type: string;
    id: string;
    createTime: number;
    desc: string;
    isTurnOffComment: boolean;
    hashtag: string[];
    isADS: boolean;
    author: {
      uid: string;
      username: string;
      uniqueId: string;
      nickname: string;
      signature: string;
      region: string;
      avatarThumb: string[];
      avatarMedium: string[];
      url: string;
    };
    statistics: {
      commentCount: number;
      likeCount: number;
      shareCount: number;
      playCount: number;
      downloadCount: number;
    };
    video: {
      ratio: string;
      duration: number;
      playAddr: string[];
      downloadAddr: string[];
      cover: string[];
      dynamicCover: string[];
      originCover: string[];
    };
    music: {
      id: number;
      title: string;
      author: string;
      album: string;
      playUrl: string[];
      coverLarge: string[];
      coverMedium: string[];
      coverThumb: string[];
      duration: number;
      isCommerceMusic: boolean;
      isOriginalSound: boolean;
      isAuthorArtist: boolean;
    };
  };
}

export interface DownloadData {
  videoHD?: string;
  videoSD?: string;
  videoNoWatermark?: string;
  mp3?: string;
  avatar?: string;
  description: string;
  nickname: string;
  uploadDate: string;
}