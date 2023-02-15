import {Playlist} from "@ag/db";
import {Checkbox, ConfirmModal, FormBase, Input} from "@ag/ui";
import Link from "next/link";
import {Button, FormText, Table} from "react-bootstrap";
import {api} from "../../utils/api";

interface Props {
  playlists: Playlist[];
  ytConfigId?: string;
  invalidate: () => void;
}

export const ManagePlaylists = ({playlists, ytConfigId, invalidate}: Props) => {
  const {mutate: deletePlaylist} = api.yt.deletePlaylist.useMutation({
    onSuccess: () => invalidate()
  });
  const {mutateAsync: createPlaylist} = api.yt.createPlaylist.useMutation({
    onSuccess: () => invalidate()
  });

  return (
    <>
      <Table bordered responsive className="mt-3">
        <thead>
          <tr>
            <th>Title</th>
            <th>Manage videos</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {playlists.map(playlist => (
            <tr key={playlist.id}>
              <td>{playlist.name}</td>
              <td>
                <Link
                  href={`/config/playlist/${playlist.id}/videos?isGlobal=${
                    playlist.isGlobal ? "y" : "n"
                  }`}
                >
                  Manage videos
                </Link>
              </td>
              <td>
                <ConfirmModal
                  onConfirm={() => deletePlaylist({id: playlist.id, isGlobal: playlist.isGlobal})}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h2 className="text-center mt-3">Create</h2>
      <FormBase
        defaultValues={{name: "", useSpeechSynthesis: true}}
        onSubmit={async data =>
          await createPlaylist({data: {...data, isGlobal: !ytConfigId}, id: ytConfigId})
        }
      >
        <Input
          name="name"
          label="Playlist Title"
          validation={{required: "Playlist name is required"}}
          className="mb-3"
        />
        <div className="mb-3">
          <Checkbox name="useSpeechSynthesis" label="Use speech synthesis" />
          <FormText className="text-muted">
            Should the video title be spoken by the computer when you focus a video? (playlist page,
            switch only)
          </FormText>
        </div>

        <Button type="submit">Submit</Button>
      </FormBase>
    </>
  );
};
