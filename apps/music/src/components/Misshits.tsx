import {save} from "@tauri-apps/api/dialog";
import {writeTextFile} from "@tauri-apps/api/fs";
import {documentDir} from "@tauri-apps/api/path";
import {useStore} from "~/store";
import {NamedSection} from "~/components/templates/NamedSection";
import {type MissHit, useConfig} from "~/store";
import {ListGroup, Button} from "react-bootstrap";
import {useRouter} from "next/router";

const saveMisshitFile = async (configId: string, missHits: MissHit) => {
  let content = "";

  for (const [k, v] of Object.entries(missHits)) {
    content += `${k}\n`;
    for (let i = 0; i < v.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we know it exists
      const {count, range} = v[i]!;
      content += `\t ${i}: ${count} - ${range}\n`;
    }
  }

  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const defaultPath = `${await documentDir()}/${configId} ${day}-${month}-${year}.txt`;
  const filepath = await save({defaultPath});
  if (!filepath)
    // assume user cancelled
    return;

  await writeTextFile(filepath, content);
};

const Misshits = () => {
  const missHits = useStore(state => state.missHits);
  const config = useConfig();
  const router = useRouter();

  // TODO: should this be tracked on more than just switch?
  if (config.inputConfig.type !== "SWITCH") void router.replace("/");

  const handleReset = () => {
    useStore.setState({missHits: {}});
  };

  return (
    <>
      <div className="d-flex justify-content-center">
        <h1>Session misshits</h1>
        <div className="ms-4">
          <Button onClick={() => void saveMisshitFile(config.id, missHits)}>Save</Button>
          <Button variant="warning" onClick={handleReset} className="ms-4">
            Reset
          </Button>
        </div>
      </div>
      <NamedSection
        title="Miss hits"
        className="misshit-display"
        innerClassName="overflow-y-auto misshit-display"
      >
        {Object.entries(missHits).map(([k, v]) => (
          <NamedSection title={k} key={k} smallTitle>
            <ListGroup>
              {v.map((missHit, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-around">
                  <span>{index} - </span>
                  <span>count: {missHit.count}</span>
                  <span>range: {missHit.range}</span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </NamedSection>
        ))}
      </NamedSection>
    </>
  );
};

export default Misshits;
