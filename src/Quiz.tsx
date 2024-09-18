import { useEffect, useMemo, useState } from "react";
import { BACKEND, Question } from "./service";

export function Quiz(params: {quizId: number}) {
    const [questions, setQuestions] = useState<number[]>();

    useEffect(() => {
        BACKEND.getQuiz(params.quizId).then(setQuestions)
    }, [params.quizId]);

    const [score, setScore] = useState(0);
    const [questionIndex, setQuestionIndex] = useState(0);

    useEffect(() => {
        setScore(0);
        setQuestionIndex(0);
    }, [params.quizId]);

    const [question, setQuestion] = useState<Question | undefined>();
    useEffect(() => {
        if (questions !== undefined && questionIndex < questions.length) {
            BACKEND.getQuestion(params.quizId, questions[questionIndex]).then(setQuestion);
        } else {
            setQuestion(undefined);
        }
    }, [questions, questionIndex, params.quizId]);

    const answers = useMemo(() => {
        if (question === undefined) {
            return;
        }
        const answers: [string, boolean][] = question.answers.map((answer, i) => [answer, i == 0]);
        for (let i = answers.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = answers[i];
            answers[i] = answers[j];
            answers[j] = temp;
        }
        return answers;
    }, [question])

    return (
        questions === undefined ? (
            <></>
        ) : (
            question === undefined || answers === undefined ? (
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
                        {
                            questionIndex !== 0 ? (
                                <>
                                    <div className="mx-auto">

                                    </div>
                                    <div>
                                        Score {(Math.round(score / questionIndex * 1000) / 10).toLocaleString()}%
                                    </div>
                                </>
                            ) : (<></>)
                        }
                    </div>
                    <div className="mt-3 text-lg">
                        {question.question}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {answers.map(([answer, correct], i) => (
                            <button className="bg-blue-700 text-white rounded-lg px-10 py-1 m-1" key={i} onClick={() => {
                                setQuestionIndex((old) => old + 1);
                                if (correct) {
                                    setScore((old) => old + 1);
                                }
                            }}>
                                {answer}
                            </button>
                        ))}
                    </div>
                </>
            )
        )
    );
}