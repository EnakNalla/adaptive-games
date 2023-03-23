import {type Timer} from "@ag/api";
import {Checkbox, ConfirmModal, FormBase, Input} from "@ag/ui";
import {Button, Table} from "react-bootstrap";
import {api} from "../../utils/api";
import {useConfig} from "../../utils/hooks";

const defaultTimers = ["30 seconds", "Indefinite"];

interface TimersProps {
  configId: string;
}

const ManageTimers = ({configId}: TimersProps) => {
  const {data: config, invalidate} = useConfig(configId);
  const createMutation = api.yt.addTimer.useMutation({
    onSuccess: async () => await invalidate()
  });
  const deleteMutation = api.yt.deleteTimer.useMutation({
    onSuccess: async () => await invalidate()
  });
  const makeDefaultMutation = api.yt.makeTimerDefault.useMutation({
    onSuccess: async () => await invalidate()
  });

  if (!config) throw new Error("Config not found");

  return (
    <>
      <Table bordered responsive className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Playtime</th>
            <th>Default?</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {config.timers.map(timer => (
            <tr key={timer.name}>
              <td>{timer.name}</td>
              <td>{`${timer.playtime} seconds`}</td>
              <td>
                {timer.isDefault ? (
                  <span className="text-success">Yes</span>
                ) : (
                  <Button
                    variant="warning"
                    onClick={() => {
                      makeDefaultMutation.mutate({id: config.id, name: timer.name});
                    }}
                  >
                    No
                  </Button>
                )}
              </td>
              <td>
                {defaultTimers.includes(timer.name) ? (
                  <span>Not Allowed</span>
                ) : (
                  <ConfirmModal
                    onConfirm={async () =>
                      await deleteMutation.mutateAsync({id: config.id, data: timer})
                    }
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <CreateTimer
        onSubmit={async data => await createMutation.mutateAsync({id: config.id, data})}
      />
    </>
  );
};

interface CreateTimerProps {
  onSubmit: (data: Timer) => Promise<void>;
}

const CreateTimer = ({onSubmit}: CreateTimerProps) => {
  return (
    <>
      <h2 className="text-center my-4">Create Timer</h2>
      <FormBase
        defaultValues={{
          name: "",
          playtime: 0,
          isDefault: false
        }}
        onSubmit={async values => await onSubmit({...values, playtime: Number(values.playtime)})}
      >
        <Input
          name="name"
          label="Timer name"
          validation={{required: "A timer name is required."}}
        />
        <Input
          name="playtime"
          label="Playtime"
          type="number"
          hint="Time in seconds"
          validation={{
            required: "Playtime is required",
            min: {
              value: 1,
              message: "Playtime must be at least 1 second"
            }
          }}
          className="my-3"
        />
        <Checkbox name="isDefault" label="Default?" className="mb-3" />
        <Button type="submit" variant="primary">
          Submit
        </Button>
      </FormBase>
    </>
  );
};

export default ManageTimers;
