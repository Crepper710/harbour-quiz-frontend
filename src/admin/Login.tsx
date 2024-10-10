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
            <form className="flex flex-col mt-4 mx-10 sm:w-1/2 sm:mx-auto gap-2" onSubmit={onSubmit}>
                <label htmlFor="username">Username:</label>
                <input id="username" type="text" className="text-field -mt-2"/>
                <label htmlFor="password">Password:</label>
                <input id="password" type="password" className="text-field -mt-2"/>
                <input type="submit" className="button"/>
            </form>
        </div>
    )
}