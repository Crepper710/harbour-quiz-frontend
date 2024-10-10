import {useEffect, useState} from "react";
import {BACKEND} from "../common/service.ts";
import {Question} from "./Question.tsx";
import {IDetectedBarcode, Scanner} from "@yudiel/react-qr-scanner";

const CODE_PATTERN = /^(?<quizId>\d+):(?<questionId>\d+)$/;

export function Quiz(props: { quizId: number }) {
    const [questions, setQuestions] = useState<number[]>();
    const [score, setScore] = useState(0);
    const [questionId, setQuestionId] = useState<number>();
    const [answeredQuestions, setAnsweredQuestions] = useState<(undefined | boolean)[]>();
    const [isScanning, setIsScanning] = useState(false);

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

    const handleScan = (scannedCodes: IDetectedBarcode[]) => {
        if (scannedCodes.length >= 0) {
            const match = CODE_PATTERN[Symbol.match](scannedCodes[0].rawValue);
            if (match === null) {
                return;
            }
            const groups = match.groups as {
                quizId: string;
                questionId: string;
            }

            const quizId = Number(groups.quizId);
            const questionId = Number(groups.questionId);

            if (quizId !== props.quizId) {
                alert("QR-Code for the wrong quiz!");
            }

            const i = questions?.indexOf(questionId);
            if (!isFinite(questionId) || i === undefined || i === -1) {
                alert("Please input a valid id");
                return;
            }

            if (answeredQuestions === undefined || answeredQuestions[i] === true) {
                alert("Question already answered");
                return;
            }

            setQuestionId(questionId);
            setIsScanning(false);
        }
    };

    if (questions === undefined || answeredQuestions === undefined) {
        return <></>;
    }

    const answeredQuestionsCount = answeredQuestions.filter(s => s === true).length;

    if (questionId !== undefined) {
        return (
            <>
                <div className="flex justify-end">
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

    if (isScanning) {
        return (
            <Scanner onScan={handleScan} onError={console.error} constraints={{
                height: 100,
            }}/>
        );
    }

    return (
        <div className="flex flex-col my-2">
            <button className="button" onClick={() => setIsScanning(true)}>
                Scan QR-Code
            </button>
        </div>
    );
}
