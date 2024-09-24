import logo from "../logo.png";

export function NavBar(params: {currentPage: "quiz" | "admin"}) {
    const currentClasses = "rounded-md bg-gray-900 px-3 py-2 font-medium text-white";
    const otherClasses = "rounded-md px-3 py-2 font-medium text-gray-300 hover:bg-gray-700 hover:text-white";

    return (
        <nav className="bg-gray-500">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex flex-shrink-0 items-center">
                            <img className="h-12 w-auto" src={logo} alt="Your Company"/>
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                <a href="/">
                                    <button
                                        className={(params.currentPage === "quiz" ? currentClasses : otherClasses) + " text-sm"}
                                        aria-current={params.currentPage === "quiz" ? "page" : undefined}
                                    >
                                        Quizzes
                                    </button>
                                </a>
                                <a href="/admin/">
                                    <button
                                        className={(params.currentPage === "admin" ? currentClasses : otherClasses) + " text-sm"}
                                        aria-current={params.currentPage === "admin" ? "page" : undefined}
                                    >
                                        Admin
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div
                        className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    </div>
                </div>
            </div>
            <div className="sm:hidden" id="mobile-menu">
                <div className="space-y-1 px-2 pb-3 pt-2">
                    <a href="/">
                        <button
                            className={(params.currentPage === "quiz" ? currentClasses : otherClasses) + " text-base"}
                            aria-current={params.currentPage === "quiz" ? "page" : undefined}
                        >
                            Quizzes
                        </button>
                    </a>
                    <a href="/admin/">
                        <button
                            className={(params.currentPage === "admin" ? currentClasses : otherClasses) + " text-base"}
                            aria-current={params.currentPage === "admin" ? "page" : undefined}
                        >
                            Admin
                        </button>
                    </a>
                </div>
            </div>
        </nav>
    )
}
