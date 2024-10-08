import { useEffect, useState } from "react";
import { BACKEND } from "../common/service.ts";
import {Question} from "./Question.tsx";

export function Quiz(props: { quizId: number }) {
    const [questions, setQuestions] = useState<number[]>();
    const [score, setScore] = useState(0);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [questionId, setQuestionId] = useState<number>();

    useEffect(() => {
        BACKEND.getQuiz(props.quizId).then(setQuestions);
        setScore(0);
        setQuestionIndex(0);
    }, [props.quizId]);

    useEffect(() => {
        if (questions !== undefined) {
            setQuestionId(questions[questionIndex]);
        }
    }, [props.quizId, questionIndex, questions]);

    const handleAnswer = (correct?: boolean) => {
        if (correct === undefined) {
            return;
        }

        if (correct) {
            setScore((old) => old + 1);
        }

        setTimeout(() => {
            setQuestionIndex((old) => old + 1);
        }, 1000);
    };

    return (
        questions === undefined ? (
            <></>
        ) : (
            questionId === undefined ? (
                <div className="flex">
                    <div className="text-2xl mx-auto mt-10">
                        Score {(Math.round(score / questionIndex * 1000) / 10).toLocaleString()}%
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex">
                        <div>
                            Question {questionIndex + 1} / {questions.length}
                        </div>
                        {questionIndex !== 0 && (
                            <>
                                <div className="mx-auto"></div>
                                <div>
                                    Score {(Math.round(score / questionIndex * 1000) / 10).toLocaleString()}%
                                </div>
                            </>
                        )}
                    </div>
                    <Question quizId={props.quizId} questionId={questionId} exit={handleAnswer}/>
                </>
            )
        )
    );
}
