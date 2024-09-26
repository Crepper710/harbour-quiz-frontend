import {SyntheticEvent} from "react";

export function Login(params: {setToken: (s: string | undefined) => void}) {
    params.setToken(undefined);

    const onSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const elements = e.currentTarget.elements as HTMLFormControlsCollection & {
            username: HTMLInputElement,
            password: HTMLInputElement,
        };
        console.log(elements.username.value, elements.password.value);
    }

    return (
        <div className="container mx-auto">
            <form className="flex flex-col mt-4 mx-10 sm:w-1/2 sm:mx-auto" onSubmit={onSubmit}>
                <label htmlFor="username">Username:</label>
                <input id="username" type="text" className="bg-slate-300 p-1 rounded-md"/>
                <label htmlFor="password" className="mt-2">Password:</label>
                <input id="password" type="password" className="bg-slate-300 p-1 rounded-md"/>
                <input type="submit" className="mt-2 bg-blue-600 text-white p-1 rounded-md"/>
            </form>
        </div>
    )
}