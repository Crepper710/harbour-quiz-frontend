import { useState } from "react";
import { NavBar } from "./NavBar";
import { Quizzes } from "./Quizzes";

export function App() {
  const [selectedQuiz, setSelectedQuiz] = useState<number | undefined>();

  return (
    <>
      <NavBar setSelectedQuiz={setSelectedQuiz}/>
      <div className="container mx-auto">
        <Quizzes selectedQuiz={selectedQuiz} setSelectedQuiz={setSelectedQuiz}/>
      </div>
    </>
  )
}
