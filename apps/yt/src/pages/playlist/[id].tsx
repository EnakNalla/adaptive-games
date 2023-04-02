import {type Video} from "@ag/db";
import {useRouter} from "next/router";
import {useCallback, useEffect, useState} from "react";
import {Button, Card, Col, Row} from "react-bootstrap";
import {useConfig, usePlaylist} from "~/utils/hooks";
import {useAppStore} from "~/utils/useAppStore";
import styles from "./[id].module.css";

const Playlist = () => {
  const router = useRouter();
  const {data: config} = useConfig();
  const {data: playlist} = usePlaylist(router.query.id as string, router.query.isGlobal === "y");
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const containerCallback = useCallback((node: HTMLDivElement) => setContainer(node), []);
  const [setPlaylist, setVideoFromPlaylist] = useAppStore(s => [
    s.setPlaylist,
    s.setVideoFromPlaylist
  ]);

  useEffect(() => {
    if (config?.inputConfig.type === "SWITCH") {
      document.addEventListener("keyup", handleKeyup);
      document.addEventListener("keydown", handleKeydown);

      if (activeCard === null) {
        setActiveCard(0);
      }

      return () => {
        document.removeEventListener("keyup", handleKeyup);
        document.removeEventListener("keydown", handleKeydown);
      };
    }
  }, [config?.inputConfig.type]);

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.code !== "Space" || (e.target as HTMLElement).nodeName === "INPUT") return;

    e.preventDefault();
  };

  const handleKeyup = (e: KeyboardEvent) => {
    console.log(e.code);
    if (e.code !== "Space" || (e.target as HTMLElement).nodeName === "INPUT") return;

    setActiveCard(n => n! + 1);
  };

  useEffect(() => {
    if (activeCard === null || !playlist) return;

    speechSynthesis.cancel();

    if (activeCard > playlist.videos.length - 1) {
      setActiveCard(0);
    }

    const card: HTMLDivElement | null = container!.querySelector(`[data-index="${activeCard}"]`);
    if (!card) return;

    card.focus();
    card.scrollIntoView();

    if (playlist?.useSpeechSynthesis) {
      const title = playlist?.videos[activeCard]?.title;
      const utterance = new SpeechSynthesisUtterance(title);
      speechSynthesis.speak(utterance);
    }
  }, [activeCard]);

  if (!playlist) throw new Error("Playlist not found");

  const loadVideo = (video: Video) => {
    setVideoFromPlaylist(playlist.id, video);
    void router.push(`/video/${video.id}`);
  };

  const loadPlaylist = () => {
    setPlaylist(playlist.videos);
    void router.push(`/video/${playlist.videos[0]!.id}`);
  };

  return (
    <>
      <div className="d-flex mb-4 justify-content-center gap-5">
        <h1>{playlist?.name}</h1>
        <div className="align-self-center">
          <Button onClick={loadPlaylist}>Load</Button>
        </div>
      </div>
      <Row ref={containerCallback} className="row-gap-4">
        {playlist?.videos.map((video, index) => (
          <Col
            tabIndex={0}
            data-index={index}
            key={video.id}
            sm="12"
            md="6"
            lg="3"
            role="link"
            onClick={() => loadVideo(video)}
            onKeyUp={e => e.code === "Enter" && loadVideo(video)}
            className={styles.videoCard}
          >
            <Card>
              <Card.Img src={video.thumbnails.medium.url} {...video.thumbnails.medium} />
              <Card.Body>
                <Card.Title>{video.title}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Playlist;
