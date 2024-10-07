import {SyntheticEvent, useState} from "react";
import {BACKEND} from "../../common/service.ts";

export function CreateQuiz(props: {reload: () => void}) {
    const [name, setName] = useState("");

    const onSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const elements = e.currentTarget.elements as HTMLFormControlsCollection & {
            name: HTMLInputElement,
        };
        if (elements.name.value === "") {
            alert("you should put a name in the text box to the right of this button!");
            return;
        }
        BACKEND.createQuiz(elements.name.value).then(() => {
            setName("");
            props.reload();
        });
    }

    return (
        <form className={"flex flex-row"} onSubmit={onSubmit}>
            <input className="bg-slate-300 p-1 rounded-md m-2" type="text" id="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>
            <input className="m-2 bg-blue-600 text-white p-1 rounded-md px-10" type="submit" value="Create a new quiz"/>
        </form>
    )
}