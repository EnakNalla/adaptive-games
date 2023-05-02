import {useConfig, useStore} from "~/store";
import {ListGroup, Container} from "react-bootstrap";
import {ConfirmModal, Input, ModalForm} from "@ag/ui";
import {useRouter} from "next/router";

const ManageConfigs = () => {
  const config = useConfig();
  const [configs, deleteConfig, addConfig] = useStore(state => [
    state.configs,
    state.deleteConfig,
    state.addConfig
  ]);
  const router = useRouter();

  const handleCreate = ({id}: {id: string}) => {
    addConfig(id);
    void router.push("/settings");
  };

  return (
    <Container>
      <h1 className="text-center">Manage configs</h1>

      <ListGroup className="mt-4">
        {configs.map(cfg => (
          <ListGroup.Item
            key={cfg.id}
            active={config.id === cfg.id}
            className="d-flex justify-content-between"
          >
            <span>{cfg.id}</span>
            {cfg.id !== config.id && <ConfirmModal onConfirm={() => deleteConfig(cfg.id)} />}
          </ListGroup.Item>
        ))}
      </ListGroup>

      <ModalForm
        defaultValues={{id: ""}}
        onSubmit={handleCreate}
        btnProps={{children: "Create", className: "mt-2"}}
        title="Create config"
      >
        <Input name="id" label="Config title" validation={{required: true}} />
      </ModalForm>
    </Container>
  );
};

export default ManageConfigs;
