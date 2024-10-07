import {SyntheticEvent, useEffect, useState} from "react";
import {BACKEND, Question as QuestionModel, QuizInfo} from "../../common/service.ts";

export function EditQuiz(props: {quiz: number}) {
    const [quiz, setQuiz] = useState<QuizInfo>();
    const [questionIds, setQuestionIds] = useState<number[]>();
    const [questions, setQuestions] = useState<QuestionModel[]>();
    const [name, setName] = useState("");

    useEffect(() => {
        if (quiz === undefined) {
            BACKEND.getQuizzes().then((quizzes) => setQuiz(quizzes.find((quiz) => quiz.id == props.quiz)));
        }
    }, [props.quiz, quiz]);

    useEffect(() => {
        if (questionIds === undefined) {
            BACKEND.getQuiz(props.quiz).then(setQuestionIds);
        }
    }, [props.quiz, questionIds]);

    useEffect(() => {
        if (questions === undefined && questionIds !== undefined) {
            setQuestions((prev) => {
                if (prev === undefined) {
                    prev = [];
                }
                return prev;
            });
            questionIds.forEach((id, i) => {
                BACKEND.getQuestion(props.quiz, id).then((question) => {
                    setQuestions((prev) => {
                        if (prev === undefined) {
                            prev = [];
                        }
                        prev[i] = question;
                        return [...prev];
                    })
                })
            });
        }
    }, [props.quiz, questionIds, questions]);

    useEffect(() => {
        if (quiz !== undefined) {
            setName(quiz.name);
        }
    }, [quiz]);

    const onSubmitName = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const elements = e.currentTarget.elements as HTMLFormControlsCollection & {
            name: HTMLInputElement,
        };
        if (elements.name.value === "") {
            alert("you should put a name in the text box to the right of this button!");
            return;
        }
        BACKEND.updateQuiz(props.quiz, elements.name.value).then(() => {});
    }

    const reload = () => {
        setQuiz(undefined);
        setQuestionIds(undefined);
        setQuestions(undefined);
    };

    if (
        quiz === undefined
            || questionIds === undefined
            || questions === undefined
            || questions.length !== questionIds.length
            || questions.reduce((p, c) => c === undefined || p, false)
    ) {
        return <></>
    }

    return (
        <>
            <form className="flex gap-2 my-2" onSubmit={onSubmitName}>
                <input className="w-1/3 bg-slate-300 p-1 rounded-md" type="text" id="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>
                <input className="w-1/3 bg-blue-600 text-white p-1 rounded-md px-10" type="submit" value="Update name"/>
                <button className="w-1/3 bg-blue-600 text-white p-1 rounded-md px-10" onClick={(e) => {
                    e.preventDefault();
                    BACKEND.createQuestion(props.quiz, "", ["", ""]).then(reload);
                }}>
                    Add a new question
                </button>
            </form>
            <div className="flex flex-col gap-2">
                {
                    [...questions].reverse().map((question, i) => <Question quizId={props.quiz} question={question} reload={reload} key={i}/>)
                }
            </div>
        </>
    )
}

function Question(props: {quizId: number, question: QuestionModel, reload: () => void}) {
    const [question, setQuestion] = useState("");
    const [answers, setAnswers] = useState(["", ""]);

    useEffect(() => {
        setQuestion(props.question.question)
    }, [props.question.question]);

    useEffect(() => {
        setAnswers(props.question.answers)
    }, [props.question.answers]);

    return (
        <form className="flex flex-col gap-2 bg-slate-200 p-2 rounded-lg" onSubmit={(e) => {
            e.preventDefault();
            BACKEND.updateQuestion(props.quizId, props.question.id, question, answers).then(props.reload);
        }}>
            <label htmlFor="question"> Question:</label>
            <input
                className="bg-slate-50 p-1 rounded-md"
                type="text"
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />
            Answers:
            {
                answers.map((answer, i) => {
                    return (
                        <input
                            key={i}
                            className={"p-1 rounded-md " + (i === 0 ? "bg-green-100" : "bg-red-100")}
                            type="text"
                            value={answer}
                            onChange={(e) => setAnswers((prev) => {
                                prev[i] = e.target.value;
                                return [...prev];
                            })}
                        />
                    )
                })
            }
            <div className="flex gap-2">
                <button className="w-1/2 bg-blue-600 text-white p-1 rounded-md" onClick={(e) => {
                    e.preventDefault();
                    setAnswers((prev) => [...prev, ""]);
                }}>
                    Add an answer
                </button>
                <button className={"w-1/2 text-white p-1 rounded-md " + (answers.length <= 2 ? " bg-slate-400" : "bg-blue-600")} onClick={(e) => {
                    e.preventDefault();
                    setAnswers((prev) => prev.slice(0, prev.length - 1));
                }} disabled={answers.length <= 2}>
                    Remove an answer
                </button>
            </div>
            <div className="flex gap-2">
                <input className="w-1/2 bg-blue-600 text-white p-1 rounded-md" type="submit" value="Save"/>
                <button className="w-1/2 bg-blue-600 text-white p-1 rounded-md" onClick={(e) => {
                    e.preventDefault();
                    if (confirm(`Are you sure you want to delete this quiz? (${props.question.question})`)) {
                        BACKEND.deleteQuestion(props.quizId, props.question.id).then(props.reload);
                    }
                }}>
                    Delete
                </button>
            </div>
        </form>
    )
}
