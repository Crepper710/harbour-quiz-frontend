import {NavBar} from "../common/NavBar.tsx";
import {Quizzes} from "./Quizzes.tsx";

export function QuizApp() {
    return (
        <>
            <NavBar currentPage="quiz"/>
            <div className="container mx-auto">
                <Quizzes/>
            </div>
        </>
    )
}
