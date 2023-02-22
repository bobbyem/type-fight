import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FightItem from "../components/FightItem";
import { Fight } from "../types/types";
import { urls } from "../utils/url";

const Fights = () => {
  const router = useRouter();
  const [fights, setFights] = useState<Fight[] | []>();
  useEffect(() => {
    if (_checkForToken()) {
      _fetchFights();
      return;
    }
    router.push({ pathname: "/auth", query: { type: "login" } });
  }, []);

  function _fetchFights(): void {
    try {
      fetch(urls.api + "/fights", {
        method: "GET",
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setFights(data);
          }
        });
    } catch (error) {}
  }

  async function _handleJoin(_id: string): Promise<void> {
    try {
      fetch(`${urls.api}/fight/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id,
        }),
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data.room) {
            router.push({
              pathname: "/fight",
              query: { id: data.room },
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  function _checkForToken(): boolean {
    const token = sessionStorage.getItem("_tftoken");
    if (!token) return false;
    return true;
  }

  return (
    <div className="flex flex-col gap-2">
      <button onClick={() => router.push("/fightform")} className="border-2">
        Create Fight
      </button>
      {fights?.length > 0
        ? fights.map((fight: Fight) => (
            <FightItem key={fight._id} fight={fight} join={_handleJoin} />
          ))
        : null}
    </div>
  );
};
export default Fights;