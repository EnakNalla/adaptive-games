import {Row, Col, Button} from "react-bootstrap";
import {QuickSettings} from "~/components/QuickSettings";
import {useConfig, useSong, useStore} from "~/store";
import dynamic from "next/dynamic";
import {useEffect, useRef} from "react";
import {PlayerApi} from "~/store/playerStore";
import {AdaptiveInput} from "@ag/ui";
import Visualiser from "~/components/Visualiser";
import {ConfigList} from "~/components/ConfigList";

const Playlist = dynamic(() => import("~/components/Playlist"), {ssr: false});

const Index = () => {
  const [hasStarted, playing] = useStore(state => [state.hasStarted, state.playing]);
  const song = useSong();
  const audio = useRef<HTMLAudioElement>(null);
  const playerApi = useRef<PlayerApi>(new PlayerApi());
  const config = useConfig();

  useEffect(() => {
    if (!audio.current) return;

    playerApi.current.audio = audio.current;
    document.addEventListener("keyup", playerApi.current.handleKeup);
    document.addEventListener("keydown", playerApi.current.handleKeydown);

    return () => {
      document.removeEventListener("keyup", playerApi.current.handleKeup);
      document.removeEventListener("keydown", playerApi.current.handleKeydown);
    };
  }, [audio.current]);

  const start = () => useStore.setState({hasStarted: true});

  return (
    <>
      <Row sm="1" md="2" hidden={playing || hasStarted}>
        <Col>
          <div className="d-grid">
            <Button disabled={!song} onClick={start}>
              Start
            </Button>
          </div>
          <div className="mt-2 text-center">
            <audio src={song?.value} controls ref={audio} id="audio" />
          </div>

          <QuickSettings />

          <ConfigList />
        </Col>
        <Col>
          <Playlist />
        </Col>
      </Row>

      {playing && <Visualiser onClick={playerApi.current.handleCanvasClick} />}

      {hasStarted && !playing && (
        <AdaptiveInput {...config.inputConfig} onInput={playerApi.current.play} />
      )}
    </>
  );
};

export default Index;
