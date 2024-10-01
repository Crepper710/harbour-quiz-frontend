import {NavBar} from "../common/NavBar.tsx";
import {QuizList} from "./QuizList.tsx";
import {useState} from "react";
import {Quiz} from "./Quiz.tsx";

export function QuizApp() {
    const [selectedQuiz, setSelectedQuiz] = useState<number>();
    return (
        <>
            <NavBar currentPage="quiz"/>
            <div className="container mx-auto">
                {
                    selectedQuiz === undefined ? (
                        <QuizList onSelect={setSelectedQuiz}/>
                    ) : (
                        <Quiz quizId={selectedQuiz}/>
                    )
                }
            </div>
        </>
    )
}
