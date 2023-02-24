import { urls } from "@/utils/url";
import { useEffect, useState } from "react";
import type { Fight } from "../types/types";
const FightItem = (props: {
  fight: Fight;
  join: (_id: string) => Promise<void>;
}) => {
  const { complexity, fighters, finished, maxPlayers, _id, creator } =
    props.fight;
  const [creatorName, setCreatorName] = useState<string | null>(null);
  useEffect(() => {
    if (creator) {
      (async () => {
        try {
          await fetch(`${urls.api}/fighter/name`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ _id: creator }),
          })
            .then((resp) => resp.json())
            .then((data) => {
              if (data && data.name) {
                setCreatorName(data.name);
              }
            });
        } catch (error) {
          console.error(error);
        }
      })().catch((error) => console.log(error));
    }
  }, [creator]);
  return (
    <div className="flex flex-row gap-2 border-2">
      <button
        disabled={finished}
        className="border-2"
        onClick={() => props.join(_id)}
      >
        Join
      </button>
      <p>{creatorName ? creatorName : null}</p>
      <p>Complexity: {complexity}</p>
      <p>Max players: {maxPlayers}</p>
      <p>Current players: {fighters.length}</p>
    </div>
  );
};
export default FightItem;
