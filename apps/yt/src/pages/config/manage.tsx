import {ConfirmModal, InlineForm} from "@ag/ui";
import Link from "next/link";
import {useRouter} from "next/router";
import {Button, Table} from "react-bootstrap";
import {Loading} from "../../components/Loading";
import {useAllConfigs} from "../../utils/hooks";
import {useAppStore} from "../../utils/useAppStore";
import {api} from "../../utils/api";

const ManageConfigs = () => {
  const router = useRouter();
  const configId = useAppStore(s => s.configId);
  const {data: allConfigs, isLoading, error, invalidate} = useAllConfigs();
  const {mutate: deleteConfig} = api.yt.deleteConfig.useMutation({
    onSuccess: () => invalidate()
  });
  const {mutate: setDefault} = api.yt.setDefaultConfig.useMutation({
    onSuccess: () => invalidate()
  });
  const {mutateAsync: createConfig} = api.yt.createConfig.useMutation({
    onSuccess: data => router.push(`/config/${data.id}/manage`)
  });

  if (error) void router.push("/error", {query: {error: error.message}});

  if (isLoading || !allConfigs) return <Loading />;

  const loadConfig = (id: string) => {
    useAppStore.setState({configId: id});
  };

  return (
    <>
      <h1 className="text-center mb-4">Manage configs</h1>

      <Table bordered responsive>
        <thead>
          <tr>
            <td>Name</td>
            <td>Loads on start</td>
            <td>Load</td>
            <td>Manage</td>
            <td>Delete</td>
          </tr>
        </thead>
        <tbody>
          {allConfigs.map(config => (
            <tr key={config.id}>
              <td>{config.name}</td>
              <td>
                {config.isDefault ? (
                  <span className="text-success">Yes</span>
                ) : (
                  <Button variant="warning" onClick={() => setDefault(config.id)}>
                    No
                  </Button>
                )}
              </td>
              <td>
                {configId === config.id ? (
                  <span>Loaded</span>
                ) : (
                  <Button onClick={() => loadConfig(config.id)}>Load</Button>
                )}
              </td>
              <td>
                <Link href={`/config/${config.id}/manage`}>Manage</Link>
              </td>
              <td>
                {config.name === "Default" ? (
                  "Not allowed"
                ) : (
                  <ConfirmModal onConfirm={() => deleteConfig(config.id)} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h2 className="text-center mt-4">Create</h2>
      <InlineForm
        initialValue=""
        showLabel
        validation={{required: "A name is required"}}
        id="name"
        label="Config name"
        onSubmit={async name => {
          await createConfig({name, isDefault: false});
        }}
      />
    </>
  );
};

export default ManageConfigs;
