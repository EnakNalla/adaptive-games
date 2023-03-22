import {type Video} from "@ag/db";
import {TRPCError} from "@trpc/server";

const BASE_URL = "https://www.googleapis.com/youtube/v3";

interface YTSearchResponse {
  nextPageToken?: string;
  items: YTVideo[];
}

interface YTVideo {
  id: string | {videoId: string};
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: {url: string; width: number; height: number};
      default: {url: string; width: number; height: number};
    };
  };
}

const mapVideo = (video: YTVideo): Video => ({
  id: typeof video.id === "string" ? video.id : (video.id as {videoId: string}).videoId,
  ...video.snippet,
  timers: []
});

export const getVideoFromYT = async (id: string) => {
  const res = await fetch(
    `${BASE_URL}/videos?part=snippet&id=${id}&key=${process.env.YT_API_KEY!}`
  );
  const data = (await res.json()) as YTSearchResponse;

  if (data.items[0]) {
    return mapVideo(data.items[0]);
  }

  throw new TRPCError({code: "NOT_FOUND", message: "Video not found"});
};

export const searchYT = async (q: string, pageToken?: string) => {
  const params = new URLSearchParams({
    q,
    key: process.env.YT_API_KEY!,
    part: "snippet",
    type: "video",
    maxResults: "50"
  });
  if (pageToken) params.append("pageToken", pageToken);

  const res = await fetch(`${BASE_URL}/search?${params.toString()}`);
  const data = (await res.json()) as YTSearchResponse;

  return {
    videos: data.items.map(mapVideo),
    pageToken: data.nextPageToken
  };
};
