import {Button, Table} from "react-bootstrap";
import {ConfirmModal, Input, ModalForm} from "@ag/ui";
import type {Timer} from "@ag/db";

interface TimerTableProps {
  timers: Timer[];
  setTimers: (timers: Timer[]) => void;
  setTimer: (timerId: string) => void;
}

export const TimerTable = ({timers, setTimers, setTimer}: TimerTableProps) => {
  const handleDelete = (timer: Timer) => {
    if (timer.isDefault) {
      // TODO: Show error
    } else {
      setTimers(timers.filter(x => x.name !== timer.name));
    }
  };

  const handleCreate = (data: Timer) => {
    if (timers.some(timer => timer.name === data.name)) throw new Error("Timer already exists");

    setTimers([...timers, data]);
  };

  return (
    <>
      <Table responsive bordered className="mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Playime</th>
            <th>Select</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {timers.map(timer => (
            <tr key={timer.name}>
              <td>{timer.name}</td>
              <td>{timer.playtime}</td>
              <td>
                {timer.isDefault ? (
                  <span>Selected</span>
                ) : (
                  <Button onClick={() => setTimer(timer.name)}>Select</Button>
                )}
              </td>
              <td>
                <ConfirmModal onConfirm={() => handleDelete(timer)} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ModalForm
        title="Create Timer"
        defaultValues={{name: "", playtime: 0}}
        btnProps={{children: "Create"}}
        onSubmit={data => handleCreate({...data, isDefault: false})}
      >
        <>
          <Input name="name" label="Name" validation={{required: true}} />
          <Input name="playtime" label="Playtime" type="number" validation={{required: true}} />
        </>
      </ModalForm>
    </>
  );
};
