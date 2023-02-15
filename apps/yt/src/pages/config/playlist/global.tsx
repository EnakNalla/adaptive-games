import {ManagePlaylists} from "../../../components/config/ManagePlaylists";
import {Loading} from "../../../components/Loading";
import {api} from "../../../utils/api";

const ManageGlobalPlaylists = () => {
  const {data: globalPlaylists, isLoading} = api.yt.getGlobalPlaylists.useQuery();
  const utils = api.useContext();

  if (isLoading) return <Loading />;

  return (
    <>
      <h1 className="text-center mb-1">Manage Global playlists</h1>
      <ManagePlaylists
        playlists={globalPlaylists!}
        invalidate={() => void utils.yt.getGlobalPlaylists.invalidate()}
      />
    </>
  );
};

export default ManageGlobalPlaylists;
