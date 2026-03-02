import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const landscape = '/landscapeMontain.webp';

export default function HomeWelcome({ userInfos, onNewBoardClick, setView }) {
    const navigate = useNavigate();

    function goToTemplateBoard() {
        navigate("/template-board");
    }

    function goToProjects() {
        if (setView) {
            setView("projects");
        }
    }

    function checkIfUserConnected() {
        return userInfos && userInfos.isConnected;
    }

    return (
        <>
            <section id="hero" className="relative h-screen w-full flex justify-center items-center top-[-75px] overflow-hidden">
                <img src={landscape} alt="Mountain landscape background" className="absolute top-0 left-0 object-cover w-full h-screen filter brightness-[40%] blur-[2px]" />
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col gap-6">

                    <h1 data-aos="fade-up" data-aos-delay="200" className="font-museo text-6xl md:text-7xl text-white font-bold mb-2 drop-shadow-2xl">
                        Task Manager
                    </h1>

                    <p data-aos="fade-up" data-aos-delay="400" className="text-white text-xl md:text-2xl font-light max-w-2xl mx-auto leading-relaxed">
                        Organize your work, track progress, and collaborate seamlessly
                    </p>

                    <div data-aos="fade-up" data-aos-delay="600" className="flex justify-center mt-4 gap-4">
                        <a href="#projects" className="px-20 py-4 bg-accent1 hover:bg-accentLight text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer transform">How does it work?</a>
                    </div>
                </div>

                <a href="#projects" className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-background via-background/50 to-transparent cursor-pointer flex justify-center items-end pb-8 group">
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-cyan-100 text-sm font-medium group-hover:text-white transition-colors">
                            Scroll to explore
                        </p>
                        <p className="text-4xl text-cyan-100 group-hover:text-white animate-upDown transition-colors">
                            ↓
                        </p>
                    </div>
                </a>
            </section>


            <main id="projects" className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-bold text-center text-text mb-4">
                        A Task Manager That Works For You
                    </h2>
                    <p data-aos="fade-up" data-aos-delay="200" className="text-center text-gray-400 text-lg mb-16 max-w-2xl mx-auto">
                        Designed to boost your productivity and keep your tasks on track. Simple, powerful, and built for real work.
                    </p>

                    <div className="flex flex-wrap justify-center">
                        <div data-aos="fade-up" data-aos-delay="300" className="w-80 m-4 bg-cardBg p-8 rounded-lg border border-gray-800 hover:border-accent1 transition-all duration-300">
                            <div className="w-12 h-12 bg-accent1/20 rounded-lg flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined">
                                    check_circle
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold text-text mb-3">
                                Stay Organized
                            </h3>
                            <p className="text-gray-400">
                                Keep all your tasks in one place. No need to switch between apps.
                            </p>
                        </div>

                        <div data-aos="fade-up" data-aos-delay="400" className="w-80 m-4 bg-cardBg p-8 rounded-lg border border-gray-800 hover:border-accent1 transition-all duration-300">
                            <div className="w-12 h-12 bg-accent1/20 rounded-lg flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined">
                                    work
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold text-text mb-3">
                                Work better
                            </h3>
                            <p className="text-gray-400">
                                Keep your daily tasks organized and prioritized for maximum efficiency.
                            </p>
                        </div>

                        <div data-aos="fade-up" data-aos-delay="500" className="w-80 m-4 bg-cardBg p-8 rounded-lg border border-gray-800 hover:border-accent1 transition-all duration-300">
                            <div className="w-12 h-12 bg-accent1/20 rounded-lg flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined">
                                    hourglass
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold text-text mb-3">
                                Never Miss Deadlines
                            </h3>
                            <p className="text-gray-400">
                                Set due dates and get a clear view of what's coming up.
                            </p>
                        </div>

                        <div data-aos="fade-up" data-aos-delay="600" className="w-80 m-4 bg-cardBg p-8 rounded-lg border border-gray-800 hover:border-accent1 transition-all duration-300">
                            <div className="w-12 h-12 bg-accent1/20 rounded-lg flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined">
                                    bar_chart_4_bars
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold text-text mb-3">
                                Track Progress
                            </h3>
                            <p className="text-gray-400">
                                See what's coming, what's in progress, and what's done. Stay on top of your work.
                            </p>
                        </div>

                        <div data-aos="fade-up" data-aos-delay="700" className="w-80 m-4 bg-cardBg p-8 rounded-lg border border-gray-800 hover:border-accent1 transition-all duration-300">
                            <div className="w-12 h-12 bg-accent1/20 rounded-lg flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined">
                                    lightning_stand
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold text-text mb-3">
                                Simple & Fast
                            </h3>
                            <p className="text-gray-400">
                                Drag and drop your tasks. No complicated menus or confusing features. Simple, efficient.
                            </p>
                        </div>

                        <div data-aos="fade-up" data-aos-delay="800" className="w-80 m-4 bg-cardBg p-8 rounded-lg border border-gray-800 hover:border-accent1 transition-all duration-300">
                            <div className="w-12 h-12 bg-accent1/20 rounded-lg flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined">
                                    shield
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold text-text mb-3">
                                Your Data, Protected
                            </h3>
                            <p className="text-gray-400">
                                Secure account and private boards. Only you can access your work.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <main id="HowItWorks" className="py-20 px-6 bg-cardBg/30">
                <div className="max-w-5xl mx-auto">
                    <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-bold text-center text-text mb-4">
                        How It Works
                    </h2>
                    <p data-aos="fade-up" data-aos-delay="200" className="text-center text-gray-400 text-lg mb-16 max-w-2xl mx-auto">
                        Get started in seconds. Here's how to make the most of Task Manager.
                    </p>

                    <div className="space-y-12">
                        <div data-aos="fade-right" data-aos-delay="300" className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 rounded-full bg-accent1/20 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-text">1</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-semibold text-text mb-3">Create Your Board</h3>
                                <p className="text-gray-400 text-lg">
                                    In <strong>Project</strong> section, start by creating a new board for your project. Give it a name, caption, deadlines and you're ready to go.
                                </p>
                            </div>
                        </div>

                        <div data-aos="fade-left" data-aos-delay="400" className="flex flex-col md:flex-row gap-8 items-center">
                            <div className=" flex-shrink-0">
                                <div className="w-16 h-16 rounded-full bg-accent1/20 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-text">2</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-semibold text-text mb-3">Add Lists & Cards</h3>
                                <p className="text-gray-400 text-lg">
                                    Organize your workflow with lists like "<strong>To Do</strong>", "<strong>Close To Do</strong>", "<strong>In Progress</strong>",  "<strong>To Review</strong>", and "<strong>Done</strong>". Add cards for each task with descriptions, labels, and due dates.
                                </p>
                            </div>
                        </div>

                        <div data-aos="fade-right" data-aos-delay="500" className="flex flex-col md:flex-row gap-8 items-center">
                            <div className=" flex-shrink-0">
                                <div className="w-16 h-16 rounded-full bg-accent1/20 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-text">3</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-semibold text-text mb-3"><strong>D</strong>rag, <strong>D</strong>rop, <strong>D</strong>one</h3>
                                <p className="text-gray-400 text-lg">
                                    Move cards between lists as work progresses. Everything updates automatically.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <section id="WhyUs" className="py-20 px-6 bg-background">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-bold text-text mb-4">
                            Why <strong>Task Manager</strong> ?
                        </h2>
                        <p data-aos="fade-up" data-aos-delay="150" className="text-gray-400 text-lg max-w-2xl mx-auto" >
                            Built for productivity. No wasted time.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div data-aos="fade-right" data-aos-delay="0" className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-lg bg-accent1/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined">visibility</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-text mb-2">Visual Organization</h3>
                                    <p className="text-gray-400">
                                        See your entire workflow at a glance. Know exactly what needs attention and what's already done.
                                    </p>
                                </div>
                            </div>

                            <div data-aos="fade-right" data-aos-delay="150" className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-lg bg-accent1/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined">update</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-text mb-2">Saving</h3>
                                    <p className="text-gray-400">
                                        Changes will always be saved. Never worry about losing your work again.
                                    </p>
                                </div>
                            </div>

                            <div data-aos="fade-right" data-aos-delay="300" className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-lg bg-accent1/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined">arrow_split</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-text mb-2">Flexible Workflows</h3>
                                    <p className="text-gray-400">
                                        Adapt the board to your process, whatever your industry. Customizable lists and cards to fit your needs.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div data-aos="fade-left" data-aos-delay="0" className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-lg bg-accent1/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined">label</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-text mb-2">Labels</h3>
                                    <p className="text-gray-400">
                                        Color-code your tasks for quick identification. Filter by priority, category, or whatever you want.
                                    </p>
                                </div>
                            </div>

                            <div data-aos="fade-left" data-aos-delay="150" className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-lg bg-accent1/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined">date_range</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-text mb-2">Due Dates</h3>
                                    <p className="text-gray-400">
                                        Set deadlines and get a clear view of upcoming tasks. Never miss an important date again.
                                    </p>
                                </div>
                            </div>

                            <div data-aos="fade-left" data-aos-delay="300" className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-lg bg-accent1/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined">expand_content</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-text mb-2">No Limits</h3>
                                    <p className="text-gray-400">
                                        Create boards, lists, and cards, up to 20 boards. Scalable from small projects to complex workflows.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {!checkIfUserConnected() ? (
                <section className="py-20 px-6 bg-gradient-to-br from-accent1/10 to-accentLight/10" >
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 data-aos="zoom-in" className="text-4xl md:text-5xl  font-bold text-text mb-6">
                            Want to give it a <strong>try</strong> ?
                        </h2>
                        <p data-aos="zoom-in" data-aos-delay="200" className="text-gray-300 text-xl mb-8 max-w-2xl mx-auto">
                            Start managing your tasks better. Don't need an account to get started!
                        </p>
                        <a data-aos="zoom-in" data-aos-delay="400" onClick={goToTemplateBoard} className="inline-block px-12 py-4 bg-accent1 hover:bg-accentLight text-white text-lg font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer transform">
                            Try a template board now
                        </a>
                    </div>
                </section>
            ) : (
                <section className="py-20 px-6 bg-gradient-to-br from-accent1/10 to-accentLight/10" >
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 data-aos="zoom-in" className="text-4xl md:text-5xl  font-bold text-text mb-6">
                            You have new project idea ?
                        </h2>
                        <p data-aos="zoom-in" data-aos-delay="200" className="text-gray-300 text-xl mb-8 max-w-2xl mx-auto">
                            Go now create a new projects!
                        </p>
                        <div className="flex justify-center gap-4" data-aos="zoom-in" data-aos-delay="400">
                            <a onClick={goToProjects} className="inline-block px-12 py-4 bg-accent1 hover:bg-accentLight text-white text-lg font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer transform">
                                View my projects
                            </a>
                        </div>
                    </div>
                </section>
            )}

        </>
    );
}