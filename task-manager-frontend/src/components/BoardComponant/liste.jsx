import React from 'react';

export default function TemplateBoard({ isTemplateMode = true }) {
    return isTemplateMode ? (
        <>
            <div className="min-h-screen bg-surface flex items-center justify-center pt-[60px]">
                <div className="text-center">
                    <h1 className="text-text text-4xl font-museo mb-6" data-aos="fade-up" data-aos-delay="200">
                        Template Board
                    </h1>
                </div>
            </div>
        </>
    ) :
        (
            <>
                <div className="min-h-screen bg-surface flex items-center justify-center pt-[60px]">
                    <div className="text-center">
                        <h1 className="text-text text-4xl font-museo mb-6" data-aos="fade-up" data-aos-delay="200" >
                            Template Board
                        </h1 >
                    </div >
                </div >

            </>
        );
}
