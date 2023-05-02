import {useConfig, useStore} from "~/store";
import {ListGroup} from "react-bootstrap";
import {ConfirmModal, Input, ModalForm} from "@ag/ui";
import {useRouter} from "next/router";
import {NamedSection} from "./templates/NamedSection";

export const ConfigList = () => {
  const config = useConfig();
  const [configs, deleteConfig, addConfig, loadConfig] = useStore(state => [
    state.configs,
    state.deleteConfig,
    state.addConfig,
    state.loadConfig
  ]);
  const router = useRouter();

  const handleCreate = ({id}: {id: string}) => {
    if (configs.some(x => x.id === id)) throw new Error("Config already exists");
    addConfig(id);
    void router.push("/settings");
  };

  return (
    <NamedSection
      title="Configs"
      className="configs"
      innerClassName="overflow-y-auto configs-inner"
    >
      <ListGroup className="mt-4">
        {configs.map(cfg => (
          <ListGroup.Item
            key={cfg.id}
            active={config.id === cfg.id}
            className="d-flex justify-content-between"
            as="div"
            role="button"
            tabIndex={0}
            action
            onClick={() => loadConfig(cfg.id)}
          >
            <span>{cfg.id}</span>
            {cfg.id !== config.id && (
              <ConfirmModal btnProps={{className: "z-3"}} onConfirm={() => deleteConfig(cfg.id)} />
            )}
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
    </NamedSection>
  );
};
