import {useEffect, useState} from "react";
import { BACKEND, QuizInfo as QuizInfoModel } from "./service";
import { Quiz } from "./Quiz";

export function Quizzes(params: {selectedQuiz: number| undefined, setSelectedQuiz: (n: number) => void}) {
    const [quizzes, setQuizzes] = useState<QuizInfoModel[]>();

    useEffect(() => {
        BACKEND.getQuizzes().then(setQuizzes)
    }, []);

    return (
        quizzes === undefined ? (
            <></>
        ) : (
            params.selectedQuiz !== undefined ? (
                <Quiz quizId={params.selectedQuiz}/>
            ) : (
                <>
                    <h1 className="text-xl">
                        Select one of the quizzes below:
                    </h1>
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {
                            quizzes.map((quiz, i) => <QuizInfo key={i} quiz={quiz} setSelectedQuiz={params.setSelectedQuiz}/>)
                        }
                    </div>
                </>
            )
        )
    );
}

function QuizInfo(params: {quiz: QuizInfoModel, setSelectedQuiz: (n: number) => void}) {
    return (
        <div className="rounded-lg bg-slate-200 p-2 m-2">
            <div className="text-lg">
                {params.quiz.name}
            </div>
            <button className="bg-blue-700 text-white rounded-lg px-10 py-1 mt-1" onClick={() => params.setSelectedQuiz(params.quiz.id)}>
                Select
            </button>
        </div>
    );
}