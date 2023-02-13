import { ChangeEvent, useState } from "react";
import { urls } from "../utils/url";

const FightForm = () => {
    const [settings, setSettings] = useState({
        complexity: 0,
        maxPlayers: 0,
    })

    async function _handleSubmit(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault()
        try {
            await fetch(`${urls.api}/fight`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(settings)
            })
         } catch (error) {
            console.error(error)
        }
    }

    return <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1>Create a fight</h1>
        <div className="mb-4">
            <label htmlFor="complexity">Word Complexity</label>
            <input type="range" name="complexity" id="complexity" min={4} max={20} onChange={(e) => setSettings({ ...settings, complexity: parseInt(e.target.value) })} value={settings.complexity} />
            <p>{settings.complexity}</p>
        </div>
        <div>
            <label htmlFor="players">Max Players</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="number" name="players" id="players" onChange={(e) => setSettings({ ...settings, maxPlayers: parseInt(e.target.value) })} />
            <p>0 = Infinite amount</p>
        </div>
        <button disabled={settings.complexity <= 0} className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" onClick={(e) => _handleSubmit(e)}>Create Fight</button>
    </form>
}

export default FightForm;