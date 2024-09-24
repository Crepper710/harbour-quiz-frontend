import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QuizApp } from './QuizApp.tsx'
import '../common/index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QuizApp />
    </StrictMode>,
)
