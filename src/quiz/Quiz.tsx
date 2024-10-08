import { useEffect, useMemo, useState } from "react";
import { BACKEND, Question } from "../common/service.ts";

export function Quiz(params: { quizId: number }) {
    const [questions, setQuestions] = useState<number[]>();
    const [score, setScore] = useState(0);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [question, setQuestion] = useState<Question | undefined>();
    const [feedback, setFeedback] = useState<null | boolean>(null); 
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null); 
    const [isAnswering, setIsAnswering] = useState(true); 

    useEffect(() => {
        BACKEND.getQuiz(params.quizId).then(setQuestions);
    }, [params.quizId]);

    useEffect(() => {
        setScore(0);
        setQuestionIndex(0);
    }, [params.quizId]);

    useEffect(() => {
        if (questions !== undefined && questionIndex < questions.length) {
            BACKEND.getQuestion(params.quizId, questions[questionIndex]).then(setQuestion);
            setFeedback(null); 
            setSelectedAnswerIndex(null); 
            setIsAnswering(true); 
        } else {
            setQuestion(undefined);
        }
    }, [questions, questionIndex, params.quizId]);

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
        setFeedback(correct); 
        setIsAnswering(false); 

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
                        {questionIndex !== 0 && (
                            <>
                                <div className="mx-auto"></div>
                                <div>
                                    Score {(Math.round(score / questionIndex * 1000) / 10).toLocaleString()}%
                                </div>
                            </>
                        )}
                    </div>
                    <div className="mt-3 text-lg">
                        {question.question}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {answers.map(([answer, correct], i) => (
                            <button
                                key={i}
                                className={`bg-blue-700 text-white rounded-lg px-10 py-1 m-1 ${
                                    selectedAnswerIndex === i
                                        ? feedback === true && correct
                                            ? "bg-green-500"
                                            : feedback === false && selectedAnswerIndex === i
                                            ? "bg-red-500"
                                            : ""
                                        : ""
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
        )
    );
}
