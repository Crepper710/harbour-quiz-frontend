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
        <form className={"grid sm:grid-cols-2 gap-2 my-2"} onSubmit={onSubmit}>
            <input className="bg-slate-300 p-1 rounded-md" type="text" id="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>
            <input className="bg-blue-600 text-white p-1 rounded-md px-10" type="submit" value="Create a new quiz"/>
        </form>
    )
}