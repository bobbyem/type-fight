import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { urls } from "../utils/url";

interface Data {
  insertedId: string;
}

const FightForm = () => {
  const router = useRouter();
  const [settings, setSettings] = useState({
    complexity: 0,
    maxPlayers: 0,
  });

  useEffect(() => {
    if (_checkForToken()) {
      return;
    }
    async () => router.push({ pathname: "/auth", query: { type: "login" } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function _handleSubmit() {
    try {
      await fetch(`${urls.api}/fight`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })
        .then((resp) => resp.json())
        .then((data: Data) => {
          if (data.insertedId) {
            async () => router.push("/fights");
          }
        });
    } catch (error) {
      console.error(error);
    }
  }

  function _checkForToken(): boolean {
    if (typeof window !== undefined) {
      const token = sessionStorage.getItem("_tftoken");
      if (!token) return false;
      return true;
    }
  }

  return (
    <form className="mb-4 rounded bg-white px-8 pt-6 pb-8 shadow-md">
      <h1>Create a fight</h1>
      <div className="mb-4">
        <label htmlFor="complexity">Word Complexity</label>
        <input
          type="range"
          name="complexity"
          id="complexity"
          min={4}
          max={20}
          onChange={(e) =>
            setSettings({ ...settings, complexity: parseInt(e.target.value) })
          }
          value={settings.complexity}
        />
        <p>{settings.complexity}</p>
      </div>
      <div>
        <label htmlFor="players">Max Players</label>
        <input
          className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
          type="number"
          name="players"
          id="players"
          onChange={(e) =>
            setSettings({ ...settings, maxPlayers: parseInt(e.target.value) })
          }
        />
        <p>0 = Infinite amount</p>
      </div>
      <button
        disabled={settings.complexity <= 0}
        className="rounded border-b-4 border-blue-700 bg-blue-500 py-2 px-4 font-bold text-white hover:border-blue-500 hover:bg-blue-400"
        onClick={() => _handleSubmit()}
      >
        Create Fight
      </button>
    </form>
  );
};

export default FightForm;
