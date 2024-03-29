import {type Video} from "@ag/db";
import {AdaptiveInput, ModalForm, Select} from "@ag/ui";
import Head from "next/head";
import {useRouter} from "next/router";
import {useEffect, useRef, useState} from "react";
import {Button, Col, Container, Form, FormGroup, ListGroup, Row, Spinner} from "react-bootstrap";
import {
  PauseFill,
  PlayFill,
  VolumeDown,
  VolumeMuteFill,
  VolumeUp,
  VolumeUpFill
} from "react-bootstrap-icons";
import {FullScreen, useFullScreenHandle} from "react-full-screen";
import {type OnProgressProps} from "react-player/base";
import ReactPlayer from "react-player/youtube";
import {api} from "~/utils/api";
import {queryOptions, useConfig} from "~/utils/hooks";
import {useAppStore} from "~/utils/useAppStore";
import Results from "../results";

const BASE_URL = "https://www.youtube-nocookie.com/watch?v=";

const useVideo = (id: string) => {
  const [enabled, setEnabled] = useState(false);

  const {data, isLoading} = api.yt.getVideo.useQuery(id, {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    enabled
  });

  const video = useAppStore(s => s.video);
  if (video) return {video, isLoading: false};
  else if (!enabled) setEnabled(true);

  return {video: data, isLoading};
};

const Player = () => {
  const {
    started,
    timer,
    playlistLoaded,
    loadNextVideo,
    videoTimer,
    initPlayer,
    isPlaying,
    handlePlay,
    pauseVideo,
    playVideo,
    playlistId
  } = useAppStore();
  const router = useRouter();
  const fullscreenHandle = useFullScreenHandle();
  const {video, isLoading} = useVideo(router.query.id as string);
  const {data: config} = useConfig();
  const playerRef = useRef<ReactPlayer | null>(null);
  let timeout: NodeJS.Timeout | null;
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) return;

    return init();
  }, [isLoading]);

  if (isLoading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: "100vh"}}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );

  const init = () => {
    if (!video || !config) return;

    const handleKeyup = initPlayer(
      id => {
        void router.push(`/playlist/${id}`);
      },
      () => {
        if (timeout) clearTimeout(timeout);
        if (fullscreenHandle.active) void fullscreenHandle.exit();
      },
      video,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      config.timers.find(t => t.isDefault)!, // There will always be a default
      config.inputConfig.type
    );

    document.addEventListener("keyup", handleKeyup);

    return () => document.removeEventListener("keyup", handleKeyup);
  };

  const videoEvents = {
    onPlay() {
      if (videoTimer || timer.playtime === 0) return;

      timeout = setTimeout(pauseVideo, timer.playtime * 1000);
    },
    onPause() {
      if (timeout) clearTimeout(timeout);
    },
    onProgress({playedSeconds}: OnProgressProps) {
      setProgress(playedSeconds);
      if (!videoTimer) return;

      if (playedSeconds >= videoTimer.pauseTime) {
        pauseVideo();
      }
    },
    onEnded() {
      if (playlistLoaded) {
        loadNextVideo();
      }
    }
  };

  const reset = () => {
    useAppStore.setState({isPlaying: false, started: false});
    if (video?.timers[0]) useAppStore.setState({videoTimer: video.timers[0]});
    playerRef.current?.seekTo(0);
  };

  const handleStart = () => {
    void fullscreenHandle.enter();
    useAppStore.setState({started: true});
  };

  const selectTimer = (name: string) => {
    if (name === "video" && video?.timers[0]) {
      useAppStore.setState({videoTimer: video.timers[0]});
    } else {
      const timer = config?.timers.find(t => t.name === name);
      if (timer) useAppStore.setState({timer, videoTimer: null});
    }
  };

  const playBtnClick = () => {
    isPlaying ? pauseVideo() : playVideo();
  };

  if (!video) throw new Error("Video not found");

  const onOverlayClick = () => {
    if (timer.playtime !== 0 || videoTimer) return;
    if (config?.inputConfig.type === "TOUCH" || config?.inputConfig.type === "MOUSE") {
      if (isPlaying) pauseVideo();
    }
  };

  return (
    <Container fluid>
      <Head>
        <title dangerouslySetInnerHTML={{__html: video.title}} />
      </Head>

      <Row>
        <Col sm="12" md="8">
          <div className="d-flex justify-content-between mb-2">
            <h1 className="fw-semibold fs-3">{video?.title}</h1>
            <Button variant="warning" onClick={reset} className="align-self-center">
              Reset
            </Button>
          </div>

          <FullScreen handle={fullscreenHandle} className="d-grid">
            <div
              className={`ratio ratio-16x9 ${!started ? "" : isPlaying ? "" : "invisible"}`}
              id="player-container"
            >
              <ReactPlayer
                url={`${BASE_URL}${video?.id ?? ""}`}
                playing={isPlaying}
                width="100%"
                height="100%"
                ref={playerRef}
                volume={volume}
                muted={muted}
                onReady={e => {
                  setDuration(e.getDuration());
                  if (playlistId) handleStart();
                }}
                config={{
                  playerVars: {
                    origin: process.env.NEXTAUTH_URL
                  }
                }}
                {...videoEvents}
              />
            </div>
            <div id="player-overlay" onClick={onOverlayClick} />
            {!isPlaying && config?.inputConfig && started && (
              <AdaptiveInput {...config.inputConfig} onInput={handlePlay} />
            )}
          </FullScreen>

          <div>
            {!started && (
              <div className="d-grid">
                <Button onClick={handleStart}>Start</Button>
              </div>
            )}
            <p className="text-center mt-2">
              <Time seconds={progress} /> / <Time seconds={duration} />
            </p>
            <input
              type="range"
              min={0}
              max={duration}
              step="any"
              value={progress}
              onMouseUp={e => {
                playerRef.current?.seekTo(parseFloat((e.target as HTMLInputElement).value));
              }}
              onChange={e => {
                setProgress(parseFloat(e.target.value));
              }}
              className="form-range mt-2"
            />
            <div id="controls" className="mt-2">
              <div className="d-flex justify-content-between">
                <div className="d-flex align-items-center">
                  <VolumeDown size="24" />
                  <input
                    className="form-range"
                    type="range"
                    value={volume * 100}
                    onChange={e => setVolume(parseInt(e.target.value) / 100)}
                  />
                  <VolumeUp size="24" />
                </div>
                <Button onClick={playBtnClick}>{isPlaying ? <PauseFill /> : <PlayFill />}</Button>
                <Button variant="secondary" onClick={() => setMuted(!muted)}>
                  {muted ? <VolumeMuteFill /> : <VolumeUpFill />}
                </Button>
              </div>
            </div>
            <div className="mt-2">
              <AddVideo video={video} />
            </div>
            {timer && (
              <FormGroup controlId="timer-select" className="my-2">
                <Form.Label>Select timer</Form.Label>
                <Form.Select
                  value={videoTimer ? "video" : timer.name}
                  onChange={e => selectTimer(e.target.value)}
                >
                  {video?.timers.length && <option value="video">Video timer</option>}
                  {config?.timers.map(t => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </Form.Select>
              </FormGroup>
            )}
            {videoTimer && (
              <ListGroup>
                {video?.timers.map(t => (
                  <ListGroup.Item key={t.index} active={t.index === videoTimer.index}>
                    {t.index} - {t.videoTime} seconds
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>
        </Col>
        <Col sm="12" md="4">
          <Results sidebar />
        </Col>
      </Row>
    </Container>
  );
};

const AddVideo = ({video}: {video?: Video}) => {
  const {mutateAsync: addVideo} = api.yt.addVideo.useMutation();
  const {data: globalPlaylists} = api.yt.getGlobalPlaylists.useQuery();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const {data: userPlaylists} = api.yt.getUserPlaylists.useQuery(undefined, queryOptions);

  useEffect(() => {
    console.log(userPlaylists);
  }, [userPlaylists]);

  if (!video || !globalPlaylists || !userPlaylists) return null;

  return (
    <ModalForm
      defaultValues={{playlistId: ""}}
      btnProps={{children: "Add to playlist"}}
      title="Add to playlist"
      onSubmit={async ({playlistId}) => {
        await addVideo({
          id: playlistId,
          data: video,
          isGlobal: globalPlaylists.some(p => p.id === playlistId)
        });
      }}
    >
      <Select
        name="playlistId"
        label="Select playlist"
        options={[
          ...globalPlaylists.map(p => ({label: p.name + " (global)", value: p.id})),
          ...userPlaylists.map(p => ({label: p.name, value: p.id})),
          {value: "", label: "Please select a playlist"}
        ]}
        validation={{required: "A playlist must be selected"}}
      />
    </ModalForm>
  );
};

const Time = ({seconds}: {seconds: number}) => {
  return <time dateTime={`P${Math.round(seconds)}S`}>{timeFormat(seconds)}</time>;
};

const timeFormat = (seconds: number) => {
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = pad(date.getUTCSeconds());
  if (hh) {
    return `${hh}:${pad(mm)}:${ss}`;
  }
  return `${mm}:${ss}`;
};

const pad = (s: number) => {
  return `0${s}`.slice(-2);
};

export default Player;
