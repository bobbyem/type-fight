import type { Fight } from "../types/types";
const FightItem = (props: {
  fight: Fight;
  join: (_id: string) => Promise<void>;
}) => {
  const { complexity, fighters, finished, maxPlayers, _id } = props.fight;
  return (
    <div className="flex flex-row gap-2 border-2">
      <button
        disabled={finished}
        className="border-2"
        onClick={() => props.join(_id)}
      >
        Join
      </button>
      <p>Complexity: {complexity}</p>
      <p>Max players: {maxPlayers}</p>
      <p>Current players: {fighters.length}</p>
    </div>
  );
};
export default FightItem;
