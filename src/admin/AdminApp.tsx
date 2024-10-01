import {NavBar} from "../common/NavBar.tsx";
import {Login} from "./Login.tsx";
import {AuthContext} from "./AuthContext.ts";
import {useState} from "react";
import {QuizList} from "./QuizList.tsx";
import {EditQuiz} from "./quiz/EditQuiz.tsx";

export function AdminApp() {
    const [token, setToken] = useState<string>();
    const [quiz, setQuiz] = useState<number>();

    return (
        <>
            <NavBar currentPage="admin"/>
            {
                token !== undefined ? (
                    <AuthContext.Provider value={token}>
                        <div className="container mx-auto">
                            {
                                quiz === undefined ? (
                                    <QuizList onSelect={setQuiz}/>
                                ) : (
                                    <EditQuiz quiz={quiz}/>
                                )
                            }
                        </div>
                    </AuthContext.Provider>
                ) : (
                    <Login setToken={setToken}/>
                )
            }
        </>
    )
}