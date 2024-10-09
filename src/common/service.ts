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
    abstract createQuiz(name: string, token: string): Promise<void>
    abstract updateQuiz(quizId: number, name: string, token: string): Promise<void>
    abstract deleteQuiz(quizId: number, token: string): Promise<void>
    abstract createQuestion(quizId: number, question: string, answers: string[], token: string): Promise<void>
    abstract updateQuestion(quizId: number, questionId: number, question: string, answers: string[], token: string): Promise<void>
    abstract deleteQuestion(quizId: number, questionId: number, token: string): Promise<void>
    abstract login(username: string, password: string): Promise<string>
}

const BACKEND_BASE_URL = "http://localhost:8080";

class BackendImpl extends Backend {
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
            if (obj === null) {
                return [];
            }
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

    async createQuiz(name: string, token: string): Promise<undefined> {
        await fetch(BACKEND_BASE_URL + "/quiz", {
            method: "POST",
            body: JSON.stringify({quiz_name: name}),
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });
    }

    async updateQuiz(quizId: number, name: string, token: string): Promise<void> {
        await fetch(BACKEND_BASE_URL + `/quiz/${quizId}`, {
            method: "PUT",
            body: JSON.stringify({quiz_name: name}),
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });
    }

    async deleteQuiz(quizId: number, token: string): Promise<void> {
        await fetch(BACKEND_BASE_URL + `/quiz/${quizId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });
    }

    async createQuestion(quizId: number, question: string, answers: string[], token: string): Promise<void> {
        await fetch(BACKEND_BASE_URL + `/quiz/${quizId}/question`, {
            method: "POST",
            body: JSON.stringify({question, answers}),
            headers: {
                "Authorization": `Bearer ${token}`
            },
        })
    }

    async updateQuestion(quizId: number, questionId: number, question: string, answers: string[], token: string): Promise<void> {
        await fetch(BACKEND_BASE_URL + `/quiz/${quizId}/question/${questionId}`, {
            method: "PUT",
            body: JSON.stringify({question, answers}),
            headers: {
                "Authorization": `Bearer ${token}`
            },
        })
    }

    async deleteQuestion(quizId: number, questionId: number, token: string): Promise<void> {
        await fetch(BACKEND_BASE_URL + `/quiz/${quizId}/question/${questionId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        })
    }

    async login(username: string, password: string): Promise<string> {
        const resp = await fetch(BACKEND_BASE_URL + "/login", {
            method: "POST",
            body: JSON.stringify({username, password}),
        });
        if (resp.status !== 200) {
            throw new Error("login failed");
        }
        return await resp.text();
    }
}

export const BACKEND: Backend = new BackendImpl();