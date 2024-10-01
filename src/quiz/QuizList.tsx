import {useEffect, useState} from "react";
import { BACKEND, QuizInfo as QuizInfoModel } from "../common/service.ts";

export function QuizList(params: {onSelect: (n: number) => void}) {
    const [quizzes, setQuizzes] = useState<QuizInfoModel[]>();

    useEffect(() => {
        if (quizzes === undefined) {
            BACKEND.getQuizzes().then(setQuizzes);
        }
    }, [quizzes]);

    return (
        quizzes === undefined ? (
            <></>
        ) : (
            <>
                <h1 className="text-xl">
                    Select one of the quizzes below:
                </h1>
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {
                        quizzes.map((quiz, i) => <QuizInfo key={i} quiz={quiz} setSelectedQuiz={params.onSelect}/>)
                    }
                </div>
            </>
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