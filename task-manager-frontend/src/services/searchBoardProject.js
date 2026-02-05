import { getUserBoardProjects } from "./boardProjectService.js";


export async function searchBoardProjects(query, container) {
    if (query.length > 0) {

        const allBoards = await getUserBoardProjects();
        const filteredBoards = allBoards.filter(board =>
            board.includes(query.toLowerCase())
        );

        container.innerHTML = '';
        filteredBoards.forEach(board => {
            const element = document.createElement('div');
            element.textContent = board.title;
            container.appendChild(element);
        });
    }
}
