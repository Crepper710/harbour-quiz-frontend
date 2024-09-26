export class QuizInfo {
    constructor(readonly id: number, readonly name: string) {}
}

export class Question {
    constructor(readonly id: number, readonly question: string, readonly answers: Array<string>) {}
}

export abstract class Backend {
    abstract getQuizzes(): Promise<Array<QuizInfo>>
    abstract getQuiz(quizId: number): Promise<Array<number>>
    abstract getQuestion(quizId: number, questionId: number): Promise<Question>
}

class DebugBackend extends Backend {
    private readonly db: [QuizInfo, Question[]][] = [
        [
            new QuizInfo(1, "Quiz 1"),
            [
                new Question(1, "bla", ["1", "longerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr", "3"]),
                new Question(2, "bla", ["right", "not right", "far off"]),
                new Question(3, "no", ["yes", "maybe", "f off"]),
            ]
        ],
        [
            new QuizInfo(2, "Quiz 2"),
            [
                new Question(1, "bla", ["1", "longerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr", "3"]),
                new Question(2, "bla", ["right", "not right", "far off"]),
                new Question(3, "no", ["yes", "maybe", "f off"]),
            ]
        ]
    ]

    async getQuizzes(): Promise<Array<QuizInfo>> {
        return this.db.map(([quiz]) => quiz);
    }

    async getQuiz(quizId: number): Promise<Array<number>> {
        const quiz = this.db[quizId];
        if (quiz === undefined) {
            throw new Error("invalid quiz id");
        }
        return quiz[1].map((question) => question.id);
    }

    async getQuestion(quizId: number, questionId: number): Promise<Question> {
        const quiz = this.db[quizId];
        if (quiz === undefined) {
            throw new Error("invalid quiz id");
        }

        const question = quiz[1][questionId];
        if (question === undefined) {
            throw new Error("invalid question id");
        }

        return question
    }
}

const BACKEND_BASE_URL = "http://localhost:8080";

class RealBackend extends Backend {
    async getQuizzes(): Promise<Array<QuizInfo>> {
        const resp = await fetch(BACKEND_BASE_URL + "/quiz");
        const obj = await resp.json();
        if (Array.isArray(obj)) {
            return obj.map((obj) => {
                if (typeof obj.id !== "number") {
                    throw new Error("id should be a number");
                }
                if (typeof obj.quiz_name !== "string") {
                    throw new Error("name should be a string");
                }
                return new QuizInfo(obj.id, obj.quiz_name);
            });
        } else {
            throw new Error("unexpected element from the API");
        }
    }

    async getQuiz(quizId: number): Promise<Array<number>> {
        const resp = await fetch(BACKEND_BASE_URL + `/quiz/${quizId}/question`)
        const obj = await resp.json();
        if (Array.isArray(obj)) {
            return obj.map((obj) => {
                if (typeof obj.id !== "number") {
                    throw new Error("id should be a number");
                }
                return obj.id;
            });
        } else {
            throw new Error("unexpected element from the API");
        }
    }

    async getQuestion(quizId: number, questionId: number): Promise<Question> {
        const resp = await fetch(BACKEND_BASE_URL + `/quiz/${quizId}/question/${questionId}`)
        const obj = await resp.json();
        if (typeof obj.id !== "number") {
            throw new Error("id should be a number");
        }
        if (typeof obj.question !== "string") {
            throw new Error("id should be a number");
        }
        const rawAnswers = obj.answers;
        let answers;
        if (Array.isArray(rawAnswers)) {
            answers = rawAnswers.map((question) => {
                if (typeof question !== "string") {
                    throw new Error("answer should be a string");
                }
                return question;
            });
        } else {
            throw new Error("unexpected element from the API");
        }
        return new Question(obj.id, obj.question, answers);
    }
}

export const BACKEND: Backend = import.meta.env.PROD ? new RealBackend() : new DebugBackend();