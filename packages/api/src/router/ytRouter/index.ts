import {createTRPCRouter, protectedProcedure} from "../../trpc";
import {z} from "zod";
import {getVideoFromYT, searchYT} from "./ytApi";
import {
  defaultConfig,
  inputConfigSchema,
  ytConfigSchema,
  YtConfig,
  timerSchema,
  playlistSchema,
  videoSchema
} from "./ytRouter.schemas";
import {TRPCError} from "@trpc/server";
import {InputConfig, VideoTimer} from "@ag/db";

const createDefaultConfig = (input: YtConfig) => ({
  ...input,
  ...defaultConfig
});

const getters = {
  getAllConfigs: protectedProcedure.query(async ({ctx}) => {
    const userId = ctx.session.user.id;

    return await ctx.prisma.ytConfig.findMany({where: {userId}});
  }),
  getGlobalPlaylists: protectedProcedure.query(async ({ctx}) => {
    return await ctx.prisma.playlist.findMany({where: {isGlobal: true}});
  }),
  getConfig: protectedProcedure.input(z.string().optional()).query(async ({ctx, input: id}) => {
    const userId = ctx.session.user.id;

    const query = id ? {id, userId} : {userId, isDefault: true};

    const config = await ctx.prisma.ytConfig.findFirst({where: query, include: {playlists: true}});

    if (!config && !id) {
      const user = await ctx.prisma.user.update({
        where: {id: userId},
        data: {ytConfigs: {create: createDefaultConfig({name: "Default", isDefault: true})}},
        include: {
          ytConfigs: {
            include: {playlists: true}
          }
        }
      });

      return user.ytConfigs[0];
    } else if (!config) {
      throw new TRPCError({code: "NOT_FOUND", message: "Config not found"});
    }

    return config;
  }),
  getVideo: protectedProcedure.input(z.string()).query(async ({ctx, input: id}) => {
    const userId = ctx.session.user.id;

    const playlist = await ctx.prisma.playlist.findFirst({where: {videos: {some: {id}}, userId}});
    if (!playlist) return await getVideoFromYT(id);

    return playlist.videos.find(v => v.id === id);
  }),
  getPlaylist: protectedProcedure
    .input(z.object({id: z.string(), isGlobal: z.boolean()}))
    .query(async ({ctx, input}) => {
      const userId = ctx.session.user.id;

      return await ctx.prisma.playlist.findFirst({
        where: {id: input.id, userId: input.isGlobal ? undefined : userId, isGlobal: input.isGlobal}
      });
    }),
  search: protectedProcedure
    .input(z.object({q: z.string(), pageToken: z.string().optional()}))
    .mutation(async ({input}) => {
      return await searchYT(input.q, input.pageToken);
    })
};

const mutations = {
  createConfig: protectedProcedure.input(ytConfigSchema).mutation(async ({ctx, input}) => {
    const userId = ctx.session.user.id;

    if (input.isDefault) {
      await ctx.prisma.ytConfig.updateMany({
        where: {userId, isDefault: true},
        data: {isDefault: false}
      });
    }

    return await ctx.prisma.ytConfig.create({
      data: {...defaultConfig, ...input, userId}
    });
  }),
  updateInputConfig: protectedProcedure
    .input(z.object({id: z.string(), data: inputConfigSchema}))
    .mutation(async ({ctx, input}) => {
      const userId = ctx.session.user.id;

      await ctx.prisma.ytConfig.updateMany({
        where: {id: input.id, userId},
        data: {inputConfig: input.data as InputConfig}
      });
    }),
  setDefaultConfig: protectedProcedure.input(z.string()).mutation(async ({ctx, input: id}) => {
    const userId = ctx.session.user.id;

    // only one config can be default
    await ctx.prisma.ytConfig.updateMany({
      where: {userId, isDefault: true},
      data: {isDefault: false}
    });

    await ctx.prisma.ytConfig.updateMany({where: {id, userId}, data: {isDefault: true}});
  }),
  deleteConfig: protectedProcedure.input(z.string()).mutation(async ({ctx, input: id}) => {
    if (id === "default")
      throw new TRPCError({code: "BAD_REQUEST", message: "Cannot delete default config"});

    const userId = ctx.session.user.id;

    const config = await ctx.prisma.ytConfig.findFirst({where: {id, userId}});
    if (!config) throw new TRPCError({code: "NOT_FOUND", message: "Config not found"});

    if (config.isDefault) {
      await ctx.prisma.ytConfig.updateMany({
        where: {userId, name: "Default"},
        data: {isDefault: true}
      });
    }

    await ctx.prisma.ytConfig.delete({where: {id}});
  }),
  addTimer: protectedProcedure
    .input(z.object({id: z.string(), data: timerSchema}))
    .mutation(async ({ctx, input}) => {
      const userId = ctx.session.user.id;

      const config = await ctx.prisma.ytConfig.findFirst({where: {id: input.id, userId}});
      if (!config) throw new TRPCError({code: "NOT_FOUND", message: "Config not found"});

      if (input.data.isDefault) {
        config.timers.find(t => t.isDefault)!.isDefault = false;
      }

      config.timers.push(input.data);

      await ctx.prisma.ytConfig.updateMany({
        where: {id: input.id, userId},
        data: {timers: config.timers}
      });
    }),
  makeTimerDefault: protectedProcedure
    .input(z.object({id: z.string(), name: z.string()}))
    .mutation(async ({ctx, input}) => {
      const userId = ctx.session.user.id;

      const config = await ctx.prisma.ytConfig.findFirst({where: {id: input.id, userId}});
      if (!config) throw new TRPCError({code: "NOT_FOUND", message: "Config not found"});

      config.timers.find(t => t.isDefault)!.isDefault = false;
      config.timers.find(t => t.name === input.name)!.isDefault = true;

      await ctx.prisma.ytConfig.update({
        where: {id: input.id},
        data: {timers: config.timers}
      });
    }),
  deleteTimer: protectedProcedure
    .input(z.object({id: z.string(), data: timerSchema}))
    .mutation(async ({ctx, input}) => {
      if (input.data.name === "30 seconds") {
        throw new TRPCError({code: "BAD_REQUEST", message: "Cannot delete default timer"});
      }

      const userId = ctx.session.user.id;

      const config = await ctx.prisma.ytConfig.findFirst({where: {id: input.id, userId}});
      if (!config) throw new TRPCError({code: "NOT_FOUND", message: "Config not found"});

      if (input.data.isDefault) {
        // 30 seconds is the default timer that cannot be deleted
        config.timers.find(t => t.name === "30 seconds")!.isDefault = true;
      }

      config.timers = config.timers.filter(t => t.name !== input.data.name);

      await ctx.prisma.ytConfig.updateMany({
        where: {id: input.id, userId},
        data: {timers: config.timers}
      });
    })
};

const playlistMutations = {
  createPlaylist: protectedProcedure
    .input(z.object({id: z.string().optional(), data: playlistSchema}))
    .mutation(async ({ctx, input}) => {
      if (!input.id && !input.data.isGlobal) {
        throw new TRPCError({code: "BAD_REQUEST", message: "Must provide config id if not global"});
      }

      if (input.data.isGlobal) {
        await ctx.prisma.playlist.create({data: {...input.data}});
        return;
      }

      const userId = ctx.session.user.id;

      // enture caller owns the config
      const config = await ctx.prisma.ytConfig.findFirst({where: {id: input.id, userId}});
      if (!config) throw new TRPCError({code: "NOT_FOUND", message: "Config not found"});

      await ctx.prisma.playlist.create({
        data: {...input.data, userId, ytConfigId: config.id}
      });
    }),
  deletePlaylist: protectedProcedure
    .input(z.object({id: z.string(), isGlobal: z.boolean()}))
    .mutation(async ({ctx, input}) => {
      const userId = input.isGlobal ? undefined : ctx.session.user.id;

      await ctx.prisma.playlist.deleteMany({
        where: {id: input.id, userId, isGlobal: input.isGlobal}
      });
    }),
  addVideo: protectedProcedure
    .input(z.object({id: z.string(), data: videoSchema, isGlobal: z.boolean()}))
    .mutation(async ({ctx, input}) => {
      if ((await ctx.prisma.playlist.count({where: {videos: {some: {id: input.data.id}}}})) > 0)
        throw new TRPCError({code: "BAD_REQUEST", message: "Video already exists"});

      const userId = input.isGlobal ? undefined : ctx.session.user.id;

      await ctx.prisma.playlist.updateMany({
        where: {id: input.id, userId, isGlobal: input.isGlobal},
        data: {videos: {push: input.data}}
      });
    }),
  deleteVideo: protectedProcedure
    .input(z.object({playlistId: z.string(), videoId: z.string(), isGlobal: z.boolean()}))
    .mutation(async ({ctx, input}) => {
      const userId = input.isGlobal ? undefined : ctx.session.user.id;

      const playlist = await ctx.prisma.playlist.findFirst({
        where: {id: input.playlistId, userId, isGlobal: input.isGlobal}
      });
      if (!playlist) throw new TRPCError({code: "NOT_FOUND", message: "Playlist not found"});

      playlist.videos = playlist.videos.filter(v => v.id !== input.videoId);

      await ctx.prisma.playlist.update({
        where: {id: input.playlistId},
        data: {videos: playlist.videos}
      });
    }),
  addVideoTimer: protectedProcedure
    .input(
      z.object({
        playlistId: z.string(),
        isGlobal: z.boolean(),
        videoId: z.string(),
        mins: z.number(),
        seconds: z.number()
      })
    )
    .mutation(async ({ctx, input}) => {
      const userId = input.isGlobal ? undefined : ctx.session.user.id;

      const playlist = await ctx.prisma.playlist.findFirst({
        where: {id: input.playlistId, userId, isGlobal: input.isGlobal}
      });
      const video = playlist?.videos.find(v => v.id === input.videoId);
      if (!video) throw new TRPCError({code: "NOT_FOUND", message: "Video not found"});

      const prevTimer = video.timers.find(t => t.index === video.timers.length - 1);
      const pauseTime = input.mins * 60 + input.seconds;

      if (prevTimer && prevTimer.pauseTime >= pauseTime) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Pause timer must be greater than the previous timer"
        });
      }

      const videoTimer: VideoTimer = {
        pauseTime,
        index: video.timers.length,
        videoTime: `${input.mins}:${input.seconds}`
      };

      await ctx.prisma.playlist.update({
        where: {id: input.playlistId},
        data: {
          videos: {
            updateMany: {
              where: {id: input.videoId},
              data: {timers: {push: videoTimer}}
            }
          }
        }
      });
    }),
  deleteVideoTimer: protectedProcedure
    .input(z.object({playlistId: z.string(), videoId: z.string(), isGlobal: z.boolean()}))
    .mutation(async ({ctx, input}) => {
      const userId = input.isGlobal ? undefined : ctx.session.user.id;

      const playlist = await ctx.prisma.playlist.findFirst({
        where: {id: input.playlistId, userId, isGlobal: input.isGlobal}
      });
      const video = playlist?.videos.find(v => v.id === input.videoId);
      if (!video) throw new TRPCError({code: "NOT_FOUND", message: "Video not found"});

      video.timers.pop();

      await ctx.prisma.playlist.update({
        where: {id: input.playlistId},
        data: {videos: {updateMany: {where: {id: input.videoId}, data: {timers: video.timers}}}}
      });
    })
};

export const ytRouter = createTRPCRouter({
  ...mutations,
  ...playlistMutations,
  ...getters
});
