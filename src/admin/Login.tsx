import {SyntheticEvent, useState} from "react";
import {BACKEND} from "../common/service.ts";

export function Login(props: {setToken: (s: string | undefined) => void}) {
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const onSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const elements = e.currentTarget.elements as HTMLFormControlsCollection & {
            username: HTMLInputElement,
            password: HTMLInputElement,
        };
        setIsLoggingIn(true);
        BACKEND.login(elements.username.value, elements.password.value).then((token) => {
            props.setToken(token);
        }).catch((err) => {
            console.error(err);
            setIsLoggingIn(false);
        });
    }

    if (isLoggingIn) {
        return (
            <></>
        );
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