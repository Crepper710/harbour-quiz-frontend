import {SyntheticEvent, useEffect, useState} from "react";
import { BACKEND } from "../common/service.ts";
import {Question} from "./Question.tsx";

export function Quiz(props: { quizId: number }) {
    const [questions, setQuestions] = useState<number[]>();
    const [score, setScore] = useState(0);
    const [questionId, setQuestionId] = useState<number>();
    const [answeredQuestions, setAnsweredQuestions] = useState<(undefined | boolean)[]>();

    useEffect(() => {
        BACKEND.getQuiz(props.quizId).then(setQuestions);
        setScore(0);
        setQuestionId(undefined);
        setAnsweredQuestions(undefined);
    }, [props.quizId]);

    useEffect(() => {
        if (questions !== undefined) {
            setAnsweredQuestions((prev) => prev !== undefined ? prev : new Array(questions.length).fill(undefined));
        }
    }, [questions]);

    const handleAnswer = (correct?: boolean) => {
        setTimeout(() => {
            setQuestionId(undefined);
        }, 1000);

        if (correct === undefined) {
            return;
        }

        if (questionId !== undefined) {
            setAnsweredQuestions((prev) => {
                const i = questions?.indexOf(questionId);
                if (prev === undefined || i === undefined || i === -1) {
                    return prev;
                }
                prev[i] = true;
                return [...prev];
            })
        }

        if (correct) {
            setScore((old) => old + 1);
        }
    };

    const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const elements = e.currentTarget.elements as HTMLFormControlsCollection & {
            questionId: HTMLInputElement,
        };
        const value = Number(elements.questionId.value);

        const i = questions?.indexOf(value);

        if (!isFinite(value) || i === undefined || i === -1) {
            alert("Please input a valid id");
            return;
        }

        if (answeredQuestions === undefined || answeredQuestions[i] === true) {
            alert("Question already answered");
            return;
        }

        setQuestionId(value);
    }

    if (questions === undefined || answeredQuestions === undefined) {
        return <></>;
    }
    const answeredQuestionsCount = answeredQuestions.filter(s => s === true).length;

    if (questionId !== undefined) {
        return (
            <>
                <div className="flex">
                    <div>
                        Question {answeredQuestionsCount + 1} / {questions.length}
                    </div>
                    {answeredQuestionsCount !== 0 && (
                        <>
                            <div className="mx-auto"></div>
                            <div>
                                Score {(Math.round(score / answeredQuestionsCount * 1000) / 10).toLocaleString()}%
                            </div>
                        </>
                    )}
                </div>
                <Question quizId={props.quizId} questionId={questionId} exit={handleAnswer}/>
            </>
        );
    }

    if (questions.length === answeredQuestionsCount) {
        return (
            <div className="flex">
                <div className="text-2xl mx-auto mt-10">
                    Score {(Math.round(score / answeredQuestionsCount * 1000) / 10).toLocaleString()}%
                </div>
            </div>
        );
    }

    return (
        <form className="flex" onSubmit={handleSubmit}>
            <label>Please Enter a QuestionId ({questions.filter((_, i) => answeredQuestions[i] === undefined)}, {answeredQuestions})</label>
            <input type="number" id="questionId"/>
            <input type="submit"/>
        </form>
    );
}
