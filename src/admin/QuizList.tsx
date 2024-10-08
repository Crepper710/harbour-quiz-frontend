import {useContext, useEffect, useState} from "react";
import { BACKEND, QuizInfo as QuizInfoModel } from "../common/service.ts";
import {CreateQuiz} from "./quiz/CreateQuiz.tsx";
import {AuthContext} from "./AuthContext.ts";

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
                <CreateQuiz reload={() => setQuizzes(undefined)}/>
                <h1 className="text-xl">
                    Select one of the quizzes below for editing
                </h1>
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {
                        quizzes.map((quiz, i) => <QuizInfo key={i} quiz={quiz} setSelectedQuiz={params.onSelect} reload={() => setQuizzes(undefined)}/>)
                    }
                </div>
            </>
        )
    );
}

function QuizInfo(params: {quiz: QuizInfoModel, setSelectedQuiz: (n: number) => void, reload: () => void}) {
    const token = useContext(AuthContext);

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete this quiz? (${params.quiz.name})`)) {
            BACKEND.deleteQuiz(params.quiz.id, token).then(params.reload);
        }
    }

    return (
        <div className="rounded-lg bg-slate-200 p-2 m-2">
            <div className="text-lg">
                {params.quiz.name}
            </div>
            <div className="flex flex-col gap-2">
                <button className="button"
                        onClick={() => params.setSelectedQuiz(params.quiz.id)}>
                    Edit
                </button>
                <button className="button"
                        onClick={handleDelete}>
                    Delete
                </button>
            </div>
        </div>
    );
}