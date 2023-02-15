import {ConfirmModal} from "@ag/ui";
import Link from "next/link";
import {useRouter} from "next/router";
import {Table} from "react-bootstrap";
import {Loading} from "../../../../components/Loading";
import {usePlaylist} from "../../../../utils/hooks";
import {api} from "../../../../utils/api";

const ManageVideos = () => {
  const router = useRouter();
  const isGlobal = router.query.isGlobal === "y";
  const {
    data: playlist,
    error,
    isLoading,
    invalidate
  } = usePlaylist(router.query.id as string, isGlobal);
  const {mutate: deleteVideo} = api.yt.deleteVideo.useMutation({
    onSuccess: async () => await invalidate()
  });

  if (isLoading || !playlist) return <Loading />;

  if (error) {
    void router.push("/error", {query: {error: error.message}});
    return null;
  }

  return (
    <>
      <h1 className="text-center mb-4">
        Manage {playlist.name} playlist videos {isGlobal ? "(global)" : ""}
      </h1>

      <Table bordered responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Manage timers</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {playlist.videos.map(video => (
            <tr key={video.id}>
              <td>{video.title}</td>
              <td>
                <Link href={`/config/playlist/${playlist.id}/video/${video.id}`}>
                  Manage timers
                </Link>
              </td>
              <td>
                <ConfirmModal
                  onConfirm={() => {
                    deleteVideo({
                      isGlobal: playlist.isGlobal,
                      playlistId: playlist.id,
                      videoId: video.id
                    });
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default ManageVideos;
