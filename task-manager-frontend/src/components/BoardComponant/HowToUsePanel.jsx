import React from "react";

export default function HowToUsePanel({ onClose }) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto z-[9999]">

            <button onClick={onClose} className="fixed top-8 right-[21.5vh] w-8 h-8 bg-accent1 hover:scale-110 rounded flex items-center justify-center cursor-pointer z-[99999] transition-all duration-200">
                <span className="material-symbols-outlined">
                    close
                </span>
            </button>

            <h1 className="my-6 ml-[21vh] text-5xl font-bold text-white">How to use</h1>

            <div className="bg-secondary rounded border border-gray-600 w-4/5 p-4 mx-auto my-4">
                <h2 className="mb-2 text-center text-xl font-extrabold text-text">Boards & Columns</h2>
                <div className="h-[0.6vh] w-[100%] bg-accent1 rounded-[0.55vh] mt-[-8px] mb-4 shadow-[0_0_15px_#6f00ff57]"></div>

                <div className="flex flex-row gap-8 mt-4">
                    <img className="w-[45%] rounded border border-gray-600 shadow-lg" src="/HowToUse/BoardNormal.png" />
                    <div className="flex-1">
                        <h6 className="text-xs py-1 ml-4 font-semibold text-text"> Boards Overview</h6>
                        <p className="text-xs py-1 ml-4 font-semibold text-text">• A <span className="font-extrabold text-accent1 underline">board</span> is a workspace where you can organize tasks using columns and cards.</p>
                        <p className="text-xs py-1 ml-4 font-semibold text-text">• Columns represent different <span className="font-extrabold text-accent1 underline">stages</span> of your workflow (ex. To Do, In Progress, Review, Done).</p>
                        <p className="text-xs py-1 ml-4 font-semibold text-text">• You can have <span className="font-extrabold text-accent1 underline">unlimited columns and cards</span> per board.</p>
                    </div>
                </div>

                <div className="flex items-center gap-8 mt-4">
                
                <div className="w-[50%]">
                    <h6 className="text-xs py-1 ml-4 font-semibold text-text">Column Management</h6>

                    <p className="text-xs py-1 ml-4 font-semibold text-text">• <span className="font-extrabold text-accent1 underline">Add Column:</span> Click the "Add new Column" button to create a new column in your board.</p>

                    <p className="text-xs py-1 ml-4 font-semibold text-text">• <span className="font-extrabold text-accent1 underline">Rename Column:</span> Click on the column title to edit its name.</p>

                    <p className="text-xs py-1 ml-4 font-semibold text-text">• <span className="font-extrabold text-accent1 underline">Delete Column:</span> Click the trash icon to remove a column and all its cards.</p>

                    <p className="text-xs py-1 ml-4 font-semibold text-text">• <span className="font-extrabold text-accent1 underline">Drag Columns:</span> Reorder columns by dragging them with your mouse.</p>
                </div>

                <div className="w-[50%] flex justify-center">
                    <img className="w-[35%] rounded border border-gray-600 shadow-lg" src="/HowToUse/BoardEdit.png"/>
                </div>

            </div>
            </div>

            <div className="bg-secondary rounded border border-gray-600 w-4/5 p-4 mx-auto my-4">
                <h2 className="mb-2 text-center text-xl font-extrabold text-text">Cards</h2>
                <div className="h-[0.6vh] w-[100%] bg-accent1 rounded-[0.55vh] mt-[-8px] mb-4 shadow-[0_0_15px_#6f00ff57]"></div>

                <div className="flex flex-row gap-8 mt-4">
                    <img src="/HowToUse/CardOverview.png" className="w-[45%] rounded border border-gray-600 shadow-lg" />
                    <div className="flex-1">
                        <h6 className="text-xs py-1 ml-4 font-semibold text-text"> Cards Overview</h6>
                        <p className="text-xs py-1 ml-4 font-semibold text-text">• <span className="font-extrabold text-accent1 underline">Add Card:</span> Click the "Add Card" button in each column to create a new card.</p>
                        <p className="text-xs py-1 ml-4 font-semibold text-text">• <span className="font-extrabold text-accent1 underline">Edit Card:</span> Click on the 3 dots on the cards, and then <strong>modify</strong> to edit details.</p>
                        <p className="text-xs py-1 ml-4 font-semibold text-text">• <span className="font-extrabold text-accent1 underline">Delete Card:</span> Click on the 3 dots on the cards, and then <strong>delete</strong> to remove the card.</p>
                        <p className="text-xs py-1 ml-4 font-semibold text-text">• <span className="font-extrabold text-accent1 underline">View Details:</span> Click on a card to view it in detail.</p>
                    </div>
                </div>

                <div className="flex flex-row gap-8 mt-4">
                    <div className="flex-1">
                        <p className="text-xs py-1 ml-4 font-semibold text-text">• <span className="font-extrabold text-accent1 underline">Label Colors:</span> Add custom colored labels for better organization. You can choose from multiple colors to categorize your tasks.</p>
                    </div>
                    <div className="flex-1">
                        <p className="text-xs py-1 ml-4 font-semibold text-text">• <span className="font-extrabold text-accent1 underline">Due Date:</span> Add a deadline to your card to keep track of time-sensitive tasks.</p>
                        <p className="text-xs py-1 ml-4 font-semibold text-text">• Add a <span className="font-extrabold text-accent1 underline">description</span> to provide more context about the task.</p>
                    </div>
                </div>
            </div>

            <div className="bg-secondary rounded border border-gray-600 w-4/5 p-4 mx-auto my-4">
                <h2 className="mb-2 text-center text-xl font-extrabold text-white">Drag & Drop</h2>
                <div className="h-[0.6vh] w-[100%] bg-accent1 rounded-[0.55vh] mt-[-8px] mb-4 shadow-[0_0_15px_#6f00ff57]"></div>

                <div className="flex flex-row gap-8 mt-4">
                    <img src="./a_supp.png" className="w-[45%] rounded border border-gray-600 shadow-lg" />
                    <div className="mt-12 flex-1">
                        <p className="text-xs py-1 ml-4 font-semibold text-gray-200">• <span className="font-extrabold text-accent1 underline">Drag Cards:</span> Click and hold a card or a list, then drag it to move it between columns or reorder within a column.</p>
                    </div>
                </div>

                <div className="flex flex-row gap-8 mt-4">
                    <div className="mt-8 flex-1">
                        <p className="text-xs py-1 ml-4 font-semibold text-gray-200">• <span className="font-extrabold text-accent1 underline">Visual Feedback:</span> See real-time visual feedback as you drag cards around the board.</p>
                        <p className="text-xs py-1 ml-4 font-semibold text-gray-200">• <span className="font-extrabold text-accent1 underline">Auto-Save:</span> Changes are automatically saved when you drop a card. Card's positions will still here after page refresh.</p>
                    </div>
                    <img src="./a_supp.png" className="w-[45%] rounded border border-gray-600 shadow-lg" />
                </div>

                <div className="flex flex-row gap-8 mt-4">
                    <img src="./a_supp.png" className="w-[45%] rounded border border-gray-600 shadow-lg" />
                    <div className="mt-14 flex-1">
                        <p className="text-xs py-1 ml-4 font-semibold text-gray-200">• <span className="font-extrabold text-accent1 underline">Reorder Columns:</span> Drag list to reorganize your workflow stages in the order that fits your process.</p>
                    </div>
                </div>

                <div className="flex flex-row gap-8 mt-2">
                    <div className="flex-1">
                        <p className="text-xs py-1 ml-4 font-semibold text-gray-200">• <span className="font-extrabold text-accent1 underline">Error Handling:</span> If you drag somewhere impossible, the card will return to its original position automatically.</p>
                        <p className="text-xs py-1 ml-4 font-semibold text-gray-200">• <span className="font-extrabold text-accent1 underline">Prioritize Tasks:</span> Easily move cards up and down to prioritize your work.</p>
                    </div>
                    <img src="./a_supp.png" className="w-[45%] rounded border border-gray-600 shadow-lg" />
                </div>
            </div>

            <div className="bg-secondary rounded border border-gray-600 w-4/5 p-4 mx-auto my-4 mb-8">
                <h2 className="mb-2 text-center text-xl font-extrabold text-white">Account & Security</h2>
                <div className="h-[0.6vh] w-[100%] bg-accent1 rounded-[0.55vh] mt-[-8px] mb-4 shadow-[0_0_15px_#6f00ff57]"></div>

                <div className="flex flex-row gap-8 mt-4">
                    <img src="./a_supp.png" className="w-[45%] rounded border border-gray-600 shadow-lg" />
                    <div className="flex-1">
                        <p className="text-xs py-1 ml-4 font-semibold text-text">• <span className="font-extrabold text-accent1 underline">Sign Up: </span> Create your account with email, password and username to get started.</p>
                        <p className="text-xs py-1 ml-4 font-semibold text-text">• <span className="font-extrabold text-accent1 underline">Login:</span> Access your personal boards by logging in with your username and password.</p>
                        <p className="text-xs py-1 ml-4 font-semibold text-text">• <span className="font-extrabold text-accent1 underline">Privacy:</span> Your boards are private, only you can see and manage your tasks.</p>
                        <p className="text-xs py-1 ml-4 font-semibold text-text">• <span className="font-extrabold text-accent1 underline">Session:</span> Stay logged in automatically, if you have loading error at start, make sure to run the backend (Strapi), you have tutorial in the documentation, because you are only in local.</p>
                        <p className="text-xs py-1 ml-4 font-semibold text-text">• <span className="font-extrabold text-accent1 underline">Responsive:</span> Access your boards board from desktop, tablet, or mobile devices.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}