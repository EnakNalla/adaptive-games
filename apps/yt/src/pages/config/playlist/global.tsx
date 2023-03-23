import {ManagePlaylists} from "~/components/config/ManagePlaylists";
import {api} from "~/utils/api";

const ManageGlobalPlaylists = () => {
  const {data: globalPlaylists} = api.yt.getGlobalPlaylists.useQuery();
  const utils = api.useContext();

  return (
    <>
      <h1 className="text-center mb-1">Manage Global playlists</h1>
      <ManagePlaylists
        playlists={globalPlaylists ?? []}
        invalidate={() => void utils.yt.getGlobalPlaylists.invalidate()}
      />
    </>
  );
};

export default ManageGlobalPlaylists;
