export function NavBar(params: {setSelectedQuiz: (n: number | undefined) => void}) {
    // params.setSelectedQuiz(undefined);
    return (
        <nav className="bg-gray-500">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                <img className="h-12 w-auto" src="https://cdn.discordapp.com/attachments/1285868148599427073/1285895846285807626/Harbor1.png?ex=66ebef54&is=66ea9dd4&hm=28ae68b469e272068f38f1ced21564b7cfdff51ab455a2ec3a39c11ff1faad5e&" alt="Your Company"/>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                    <button onClick={() => {
                        params.setSelectedQuiz(undefined);
                    }} className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white" aria-current="page">Quizzes</button>
                    <button className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Admin</button>
                </div>
                </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            </div> 
            </div>
        </div>
        <div className="sm:hidden" id="mobile-menu">
            <div className="space-y-1 px-2 pb-3 pt-2">
            <button className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white" aria-current="page">Quizzes</button>
            <button className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Admin</button>
            </div>
        </div>
        </nav>
    )
}
