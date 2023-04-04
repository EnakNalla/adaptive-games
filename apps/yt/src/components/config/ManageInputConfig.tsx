import {type InputConfig} from "@ag/api";
import {AdaptiveInputConfig} from "@ag/ui";
import {api} from "~/utils/api";

interface InputConfigProps {
  configId: string;
  inputConfig: InputConfig;
}
export const ManageInputConfig = ({configId, inputConfig}: InputConfigProps) => {
  const {mutateAsync} = api.yt.updateInputConfig.useMutation();

  const handleSubmit = async (values: InputConfig) => {
    const data = {...values, dwellTime: Number(values.dwellTime)};
    await mutateAsync({id: configId, data: data});
  };

  return <AdaptiveInputConfig inputConfig={inputConfig} onSubmit={handleSubmit} />;
};
