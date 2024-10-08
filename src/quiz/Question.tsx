import {useEffect, useMemo, useState} from "react";
import {BACKEND, Question as QuestionModel} from "../common/service.ts";

export function Question(props: {quizId: number, questionId: number, exit: (correct?: boolean) => void}) {
    const [error, setError] = useState<boolean>();
    const [question, setQuestion] = useState<QuestionModel>();
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number>();
    const [isAnswering, setIsAnswering] = useState(true);

    useEffect(() => {
        BACKEND.getQuestion(props.quizId, props.questionId).then(setQuestion).catch(() => setError(true));
        setSelectedAnswerIndex(undefined);
        setIsAnswering(true);
    }, [props.questionId, props.quizId]);

    const answers = useMemo(() => {
        if (question === undefined) {
            return;
        }
        const answers: [string, boolean][] = question.answers.map((answer, i) => [answer, i === 0]);
        for (let i = answers.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = answers[i];
            answers[i] = answers[j];
            answers[j] = temp;
        }
        return answers;
    }, [question]);

    const handleAnswerClick = (correct: boolean, index: number) => {
        if (!isAnswering) return;

        setSelectedAnswerIndex(index);
        setIsAnswering(false);

        setTimeout(() => {
            props.exit(correct);
        }, 1000);
    };

    if (error) {
        return (
            <div>
                Invalid Question ID
                <button onClick={() => props.exit()}>
                    Back
                </button>
            </div>
        )
    }

    if (question === undefined || answers === undefined) {
        return <></>
    }

    return (
        <>
            <div className="mt-3 text-lg">
                {question.question}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2">
                {answers.map(([answer, correct], i) => (
                    <button
                        key={i}
                        className={`bg-blue-700 text-white rounded-lg px-10 py-1 m-1${
                            selectedAnswerIndex === i && !isAnswering ? correct ? " bg-green-500" : " bg-red-500" : ""
                        }`}
                        onClick={() => handleAnswerClick(correct, i)}
                        disabled={!isAnswering}
                    >
                        {answer}
                    </button>
                ))}
            </div>
        </>
    )
}