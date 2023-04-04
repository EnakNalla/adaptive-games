import {SortableList, type SortableItem} from "@ag/ui";
import {useEffect, useRef, useState} from "react";
import {Button, ButtonGroup, Col, ListGroup, Row} from "react-bootstrap";

const VALID_KEYS = ["Escape", "Enter", "Space"];

const App = () => {
  const [songs, setSongs] = useState<SortableItem[]>([]);
  const [started, setStarted] = useState(false);
  const player = useRef<HTMLAudioElement>(null);

  const getSongs = async (append = false) => {
    const songList = await window.api.selectSongs();

    if (append) setSongs([...songs, ...songList]);
    else setSongs(songList);
  };

  const start = () => {
    setStarted(true);
  };

  const handleKeyup = (e: KeyboardEvent) => {
    if (!VALID_KEYS.includes(e.key)) return;

    if (e.code === "Escape") {
      setStarted(false);
      player.current?.pause();
      return;
    }

    if (e.code === "Space") {
    }
  };

  useEffect(() => {
    document.addEventListener("keyup", handleKeyup);

    return () => document.removeEventListener("keyup", handleKeyup);
  }, []);

  return (
    <Row className="mt-4">
      <Col>
        <div className="d-grid">
          <Button onClick={start}>Start</Button>
        </div>

        <audio ref={player} hidden={!started} controls />

        <ListGroup className="mt-4"></ListGroup>
      </Col>
      <Col>
        <div className="d-flex justify-content-center">
          <ButtonGroup>
            <Button onClick={() => void getSongs()}>New playlist</Button>
            <Button onClick={() => void getSongs(true)}>Add Songs</Button>
          </ButtonGroup>
        </div>

        <SortableList items={songs} setItems={setSongs} useId className="mt-4" />
      </Col>
    </Row>
  );
};

export default App;
