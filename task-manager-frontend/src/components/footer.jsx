import React from 'react';

function scrollToElement(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: "smooth" });
    }
}

function scrollToElementWithDelay(sectionId) {
    setTimeout(function() {
        scrollToElement(sectionId);
    }, 100);
}

export default function Footer({ WantToAddLink = true, currentView, setView }) {
    function handleSectionClick(e, sectionId) {
        e.preventDefault();

        if (currentView !== "home" && setView) {
            setView("home");
            scrollToElementWithDelay(sectionId);
        } else {
            scrollToElement(sectionId);
        }
    }

    function handleBackToTop(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <>
            <footer className="relative w-full bg-secondary text-white border border-accent1 rounded-2xl px-6 py-8">
                <div className="absolute top-0 left-0 right-0 h-[3px]" />

                <div className="max-w-[1600px] mx-auto">
                    <div className="mb-12">
                        <h1 className="text-[5rem] text-text">
                            Task Manager
                        </h1>
                        <p className="text-xl text-text border-b-[1.5px] border-text">
                            Organize your work, track progress, and collaborate seamlessly
                        </p>
                    </div>

                    <div className="flex flex-row justify-between gap-8">
                        <div className="flex-1 min-w-[250px]">
                            <h3 className="text-xl text-text mb-4">
                                Contact
                            </h3>

                            <div className="flex flex-col gap-4">
                                <a href="tel:0895234069" className="flex flex-row items-center gap-2 text-text hover:text-accent1 transition-colors duration-300 whitespace-nowrap">
                                    <span className="material-symbols-outlined">
                                        call
                                    </span>
                                    08 95 23 40 69
                                </a>

                                <a href="mailto:support@taskmanager.com" className="flex flex-row items-center gap-2 text-text whitespace-nowrap">
                                    <span className="material-symbols-outlined">
                                        mail
                                    </span>
                                    support@taskmanager.com
                                </a>

                            </div>
                        </div>

                        <div className="flex-1 min-w-[250px] flex justify-end">
                            <nav className="flex flex-col items-end ">
                                {WantToAddLink && (
                                    <div className="text-text flex flex-col items-end text-xl font-black gap-3 underline transition-colors duration-300 whitespace-nowrap">
                                        <a href="#" onClick={handleBackToTop} className='hover:text-accent1'>
                                            Back to top
                                        </a>
                                        <a href="#HowItWorks" onClick={function(e) { handleSectionClick(e, "HowItWorks"); }} className='hover:text-accent1'>
                                            How it works
                                        </a>
                                        <a href="#WhyUs" onClick={function(e) { handleSectionClick(e, "WhyUs"); }} className='hover:text-accent1'>
                                            Why us ?
                                        </a>
                                    </div>
                                )}
                            </nav>
                        </div>
                    </div>

                    <div className="text-center text-text pt-8 border-t border-white/10 mt-8">
                        <p className="text-sm text-white/50">
                            2026 Khylian Griffon--Nicolas & Hugo Turmel. All right reserved.
                        </p>
                    </div>
                </div >
            </footer >
        </>
    );
}
