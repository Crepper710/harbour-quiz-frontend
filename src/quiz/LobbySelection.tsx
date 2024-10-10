import {useState, ReactNode, SyntheticEvent} from "react";
import {LobbyContext, LobbyInfo} from "./LobbyContext.ts";
import {BACKEND} from "../common/service.ts";

export function LobbySelection(props: {children: ReactNode, quizId: number}) {
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

        const username = elements.username.value;
        const lobbyId = elements.lobbyId.value;

        BACKEND.joinLobby(username, lobbyId, props.quizId).then((code) => {
            setLobby({id: code, name: username});
            setHasChosen(true);
        }).catch((err) => {
            console.error(err);
            if (err instanceof Error) {
                alert(err.message);
                return;
            }
            alert("An unknown error occurred while joining the lobby");
        })
    };

    const handleCreateLobby = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const elements = e.currentTarget.elements as HTMLFormControlsCollection & {
            username: HTMLInputElement,
        };

        const username = elements.username.value;

        BACKEND.createLobby(username, props.quizId).then((code) => {
            setLobby({id: code, name: username});
            setHasChosen(true);
        }).catch((err) => {
            console.error(err);
            alert("An error occurred while creating Lobby");
        })
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