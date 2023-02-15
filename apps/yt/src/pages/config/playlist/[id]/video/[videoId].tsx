import {ConfirmModal, FormBase, Input} from "@ag/ui";
import {useRouter} from "next/router";
import {useMemo} from "react";
import {Button, Table} from "react-bootstrap";
import {Loading} from "../../../../../components/Loading";
import {usePlaylist} from "../../../../../utils/hooks";
import {api} from "../../../../../utils/api";

const ManageVideoTimers = () => {
  const router = useRouter();
  const {data: playlist, error, isLoading, invalidate} = usePlaylist(router.query.id as string);
  const {mutateAsync: addTimer} = api.yt.addVideoTimer.useMutation({
    onSuccess: async () => await invalidate()
  });
  const {mutateAsync: deleteTimer} = api.yt.deleteVideoTimer.useMutation({
    onSuccess: async () => await invalidate()
  });
  const video = useMemo(() => {
    if (!playlist) return;

    return playlist.videos.find(video => video.id === router.query.videoId);
  }, [playlist]);

  if (isLoading || !playlist) return <Loading />;

  if (playlist && !video) {
    void router.push("/error", {query: {error: "Video not found in playlist"}});
    return null;
  }

  if (error) {
    void router.push("/error", {query: {error: error.message}});
    return null;
  }

  return (
    <>
      <h1 className="text-center mb-4">Manage {video?.title} timers</h1>

      <Table bordered responsive>
        <thead>
          <tr>
            <th>Index</th>
            <th>Pause time</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {video?.timers.map(timer => (
            <tr key={timer.index}>
              <td>{timer.index}</td>
              <td>{timer.videoTime}</td>
              <td>
                {timer.index === video.timers.length - 1 ? (
                  <ConfirmModal
                    onConfirm={() =>
                      deleteTimer({
                        videoId: video.id,
                        playlistId: playlist.id,
                        isGlobal: playlist.isGlobal
                      })
                    }
                  />
                ) : (
                  <span className="text-danger">Not allowed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h2 className="text-center mb-4">Add timer</h2>

      <FormBase
        defaultValues={{seconds: 0, mins: 0}}
        onSubmit={async time =>
          await addTimer({
            mins: Number(time.mins),
            seconds: Number(time.seconds),
            videoId: video!.id,
            isGlobal: playlist.isGlobal,
            playlistId: playlist.id
          })
        }
      >
        <div className="d-flex justify-content-between gap-5 mb-3">
          <Input name="mins" label="Minutes" className="w-50" type="number" />
          <Input name="seconds" label="Seconds" className="w-50" type="number" />
        </div>

        <Button type="submit">Add</Button>
      </FormBase>
    </>
  );
};

export default ManageVideoTimers;
