import {SortableList} from "@ag/ui";
import {useConfig, useSong, useStore} from "~/store";
import {Button, FormCheck} from "react-bootstrap";
import {open} from "@tauri-apps/api/dialog";
import {convertFileSrc} from "@tauri-apps/api/tauri";
import {basename} from "@tauri-apps/api/path";
import {useEffect, useState} from "react";

const Playlist = () => {
  const {setSongs, toggleShuffle, setSongIndex} = useStore(state => ({
    setSongs: state.setSongs,
    toggleShuffle: state.toggleShuffle,
    setSongIndex: state.setSongIndex
  }));
  const song = useSong();
  const config = useConfig();
  const [initialLoad, setInitialLoad] = useState(false);

  const getSongs = async (append: boolean) => {
    const selected = await open({
      multiple: true,
      filters: [{name: "songs", extensions: ["mp3", "ogg"]}]
    });

    if (!selected) return;

    if (Array.isArray(selected)) {
      const songs = await Promise.all(
        selected.map(async file => ({
          id: await basename(file),
          value: convertFileSrc(file)
        }))
      );

      setSongs(songs, append);
    } else {
      setSongs([{id: await basename(selected), value: convertFileSrc(selected)}], append);
    }
  };

  useEffect(() => {
    if (initialLoad) return;

    setInitialLoad(true);
    if (config.songs.length)
      document.querySelector(`[data-index='${config.songIndex}']`)?.scrollIntoView();
  }, []);

  return (
    <div>
      <div className="d-flex mb-4">
        <Button className="me-4" onClick={() => void getSongs(false)}>
          New Playlist
        </Button>
        <Button onClick={() => void getSongs(true)}>Add Songs</Button>

        <FormCheck
          className="ms-auto align-self-center"
          checked={config.shuffle}
          onChange={toggleShuffle}
          type="switch"
          label="Shuffle"
        />
      </div>

      <div className="overflow-y-auto playlist">
        <SortableList
          items={config.songs}
          useId
          active={song?.id}
          setItems={songs => setSongs(songs, false)}
          useDataIndex
          onClick={setSongIndex}
        />
      </div>
    </div>
  );
};

export default Playlist;
