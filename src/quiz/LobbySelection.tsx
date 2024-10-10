import {useState, ReactNode, SyntheticEvent} from "react";
import {LobbyContext, LobbyInfo} from "./LobbyContext.ts";

export function LobbySelection(props: {children: ReactNode}) {
    const [lobby, setLobby] = useState<LobbyInfo>();
    const [hasChosen, setHasChosen] = useState(false);

    if (hasChosen) {
        return (
            <LobbyContext.Provider value={lobby} children={props.children}/>
        )
    }

    const handleJoinLobby = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const elements = e.currentTarget.elements as HTMLFormControlsCollection & {
            lobbyId: HTMLInputElement,
            username: HTMLInputElement,
        };


    };

    const handleCreateLobby = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const elements = e.currentTarget.elements as HTMLFormControlsCollection & {
            username: HTMLInputElement,
        };


    }

    return (
        <div className="flex flex-col gap-y-8 my-4">
            <form className="grid grid-cols-2 gap-2" onSubmit={handleJoinLobby}>
                <input type="text" className="text-field" id="lobbyId" placeholder="Lobby ID"/>
                <input type="text" className="text-field" id="username" placeholder="Nickname"/>
                <input type="submit" value="Join Lobby" className="col-span-2 button"/>
            </form>
            <form className="grid grid-cols-2 gap-2" onSubmit={handleCreateLobby}>
                <input type="text" className="text-field" id="username" placeholder="Nickname"/>
                <input type="submit" value="Create Lobby" className="button"/>
            </form>
            <button className="button" onClick={() => setHasChosen(true)}>
                Do quiz without a lobby
            </button>
        </div>
    )
}