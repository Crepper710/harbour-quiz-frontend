import {useContext, useEffect, useState} from "react";
import {BACKEND} from "../common/service.ts";
import {Question} from "./Question.tsx";
import {IDetectedBarcode, Scanner} from "@yudiel/react-qr-scanner";
import {LobbyContext} from "./LobbyContext.ts";

const CODE_PATTERN = /^(?<quizId>\d+):(?<questionId>\d+)$/;

export function Quiz(props: { quizId: number }) {
    const [questions, setQuestions] = useState<number[]>();
    const [score, setScore] = useState(0);
    const [questionId, setQuestionId] = useState<number>();
    const [answeredQuestions, setAnsweredQuestions] = useState<(undefined | boolean)[]>();
    const [isScanning, setIsScanning] = useState(false);
    const lobby = useContext(LobbyContext);

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
            if (lobby !== undefined) {
                BACKEND.addPoint(lobby.name, lobby.id).then();
            }
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
                <div className={"flex" + (lobby !== undefined ? " justify-end" : "")}>
                    {lobby !== undefined ? `Lobby: ${lobby.id}` : ""}
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
            <ScoreDisplay total={answeredQuestionsCount} score={score}/>
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
        <div className="flex flex-col my-2 gap-4">
            {
                lobby !== undefined ? (
                    <div>
                        Lobby: {lobby.id}
                    </div>
                ) : (
                    <></>
                )
            }
            <button className="button" onClick={() => setIsScanning(true)}>
                Scan QR-Code
            </button>
        </div>
    );
}

function ScoreDisplay(props: {total: number, score: number}) {
    const [points, setPoints] = useState<Map<string, number>>();
    const lobby = useContext(LobbyContext);

    useEffect(() => {
        if (lobby !== undefined && points === undefined) {
            BACKEND.getRank(lobby.id).then(setPoints)
        }
    }, [lobby, points]);

    const displayScore = (score: number) => {
        return `${(Math.round(score / props.total * 1000) / 10).toLocaleString()}%`
    }

    if (lobby === undefined) {
        return (
            <div className="flex">
                <div className="text-2xl mx-auto mt-10">
                    Score {displayScore(props.score)}
                </div>
            </div>
        );
    }

    if (points === undefined) {
        return <></>;
    }

    return (
        <div className="grid grid-cols-2 gap-2">
            <button className="button col-span-2" onClick={() => setPoints(undefined)}>
                Refresh Leaderboard
            </button>
            <div className="underline">Player</div>
            <div className="underline">Score</div>
            {
                Array.from(points, a => a).sort((a1, a2) => a2[1] - a1[1]).map(([name, points]) => {
                    const classes = lobby.name === name ? "font-bold" : "";

                    return (
                        <>
                            <div className={classes} children={name}/>
                            <div className={classes} children={displayScore(points)}/>
                        </>
                    );
                })
            }
        </div>
    )
}
