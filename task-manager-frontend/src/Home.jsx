import React, { useEffect, useState } from "react";
import Navbar from "./components/navbar.jsx";
import Login from "./components/login.jsx";
import Welcome from "./components/welcome.jsx";
import HomeWelcome from "./components/HomeWelcome.jsx";
import CardGrid from "./components/gridProject.jsx";
import NewBoardSettings from "./components/NewBoardSettings.jsx";
import { getUserInfos, initializeUserData } from "./services/authService.js";
import { removeElements } from "./services/storage.js";
import { getUserBoardProjects, deleteBoard } from './services/BoardProject.js';
import Footer from "./components/footer.jsx";
import AOS from 'aos';
import { SendNotification } from "./utils/notifs.js";



//liste de fonction pour les toogles et les changements d'états
function setProjectsLoading(setIsLoadingProjects, isLoading) {
  setIsLoadingProjects(isLoading);
}

function updateProjectsState(setProjects, setFilteredProjects, boardProjects) {
  setProjects(boardProjects);
  setFilteredProjects(boardProjects);
}

function clearProjectsState(setProjects, setFilteredProjects) {
  setProjects([]);
  setFilteredProjects([]);
}

async function loadUserBoardProjects(setProjects, setFilteredProjects, setIsLoadingProjects) {
  setProjectsLoading(setIsLoadingProjects, true);
  try {
    const boardProjects = await getUserBoardProjects();
    updateProjectsState(setProjects, setFilteredProjects, boardProjects);
  } catch (error) {
    clearProjectsState(setProjects, setFilteredProjects);
  } finally {
    setProjectsLoading(setIsLoadingProjects, false);
  }
}



export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showNewBoard, setShowNewBoard] = useState(false);
  const [user, setUser] = useState(null);
  const [userInfos, setUserInfos] = useState(getUserInfos(null));
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("home");
  const [viewBeforeSearch, setViewBeforeSearch] = useState(null);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [deletingAllBoardLoading, setDeletingAllBoardLoading] = useState(false);
  const [closeMenu, setCloseMenu] = useState(0);

  function loadProjects() {
    loadUserBoardProjects(setProjects, setFilteredProjects, setIsLoadingProjects);
  }




  function filterProjectsById(projects, filteredProjects, deletedBoardId) {
    const updatedProjects = projects.filter(board => board.documentId != deletedBoardId); // on va chercher dans les projets les données du board supprimé pour les retirer de la liste
    const updatedFilteredProjects = filteredProjects.filter(board => board.documentId != deletedBoardId);
    return { updatedProjects, updatedFilteredProjects };
  }

  function BoardDelete(deletedBoardId) {
    const { updatedProjects, updatedFilteredProjects } = filterProjectsById(projects, filteredProjects, deletedBoardId);
    setProjects(updatedProjects); // on met à jour les projets filtrer (rechercher) avec la nouvelle liste sans le board supprimé
    setFilteredProjects(updatedFilteredProjects);
  }

  async function BoardModificationError(boardId) {
    /* si il y a une erreur alors on le remet pour eviter des bugs de fonctionnement*/
    await BoardDelete(boardId);
    await loadProjects();
  }

  function filterProjectsByQuery(projects, query) {
    return projects.filter(board =>
      board.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  function updateSearchView(setView, setViewBeforeSearch, view, searchQuery) {
    if (searchQuery === "") {
      setViewBeforeSearch(view); //si on fait la recherche depuis la page d'acceuil alors on reste sur l'acceuil sinon dans projets
    }
    setView("projects"); 
  }

  function resetSearchView(setView, setViewBeforeSearch, viewBeforeSearch) {
    const targetView = viewBeforeSearch || "home";
    setView(targetView);
    setViewBeforeSearch(null);
  }

  function handleSearch(query) {
    setSearchQuery(query);

    if (query.length > 0) {
      updateSearchView(setView, setViewBeforeSearch, view, searchQuery);
      const filtered = filterProjectsByQuery(projects, query);
      setFilteredProjects(filtered);
    } else {
      resetSearchView(setView, setViewBeforeSearch, viewBeforeSearch);
      setFilteredProjects(projects);
    }
  }


  function clearSearch() {
    setSearchQuery("");
    setFilteredProjects(projects);
    setViewBeforeSearch(null);
  }

  function incrementCloseMenu() {
    /* si le closeMenu vaut 0 alors les menus sont fermer sinon
     ils sont ouvert donc on change sa valeur pour forcer la fermeture des menus*/
    setCloseMenu(closeMenu + 1);
  }

  function handleViewChange(newView) {
    setView(newView);
    if (searchQuery !== "") {
      clearSearch();
    }
    incrementCloseMenu();
  }


  function checkIfDeletionInProgress(deletingAllBoardLoading) {
    if (deletingAllBoardLoading) {
      SendNotification("Deleting in progress...", true, false);
      return true;
    }
    return false;
  }

  async function deleteAllBoards() {
    const boardsToDelete = await getUserBoardProjects();

    if (boardsToDelete.length === 0) {
      SendNotification("No boards to delete", true, false);
      return false;
    }

    for (const board of boardsToDelete) { //comme pour supprimer un board unique sauf qu'on boucle sur tous les boards de l'utilisateur
      await deleteBoard(board.documentId);
    }

    return true;
  }

  async function handleDeleteAllBoards() {
    if (checkIfDeletionInProgress(deletingAllBoardLoading)) {
      return;
    }

    setDeletingAllBoardLoading(true);

    try {
      const success = await deleteAllBoards();
      if (success) {
        await loadProjects();
      }
    } catch (error) {
      SendNotification("Error deleting boards", true, false);
    } finally {
      setDeletingAllBoardLoading(false);
    }
  }

  function checkToken() {
    return localStorage.getItem("token");
  }

  async function initializeUserAndProjects() {
    try {
      const userData = await initializeUserData();
      setUser(userData);
      setUserInfos(getUserInfos(userData));

      const boards = await getUserBoardProjects();
      updateProjectsState(setProjects, setFilteredProjects, boards);
    } catch (error) {
      removeElements({ token: 0, userInfo: 0, userGender: 0 });
    }
  }

  useEffect(function() {
    const token = checkToken();
    
    if (!token) {
      return;
    }

    initializeUserAndProjects();
  }, []);

  function updateUserAfterLogin(userData) {
    setUser(userData);
    setUserInfos(getUserInfos(userData));
  }

  function closeLoginAndNewBoard() {
    setShowLogin(false);
    setShowNewBoard(false);
  }

  async function loadProjectsAfterLogin() {
    try {
      const boards = await getUserBoardProjects();
      updateProjectsState(setProjects, setFilteredProjects, boards);
    } catch (error) {
      clearProjectsState(setProjects, setFilteredProjects);
    }
  }

  function checkUserData(data) {
    return data && data.user && typeof data.user === 'object'; 
  }

  async function handleLogin(data) {
    const userData = checkUserData(data);
    
    if (userData && data.user) {
      updateUserAfterLogin(data.user);
      await loadProjectsAfterLogin();
    }
    
    closeLoginAndNewBoard();
  }

  function clearUserData() {
    removeElements({ token: 0, userInfo: 0, userGender: 0 });
    setUser(null);
    setUserInfos(getUserInfos(null));
    clearProjectsState(setProjects, setFilteredProjects);
  }

  function resetAllStates() {
    clearUserData();
    closeLoginAndNewBoard();
    setView("home");
    setViewBeforeSearch(null);
  }

  function handleLogout() {
    resetAllStates();
    SendNotification("Logged out successfully", true, true);
  }

  async function handleNewBoardCreated() {
    await loadProjects();
    setShowNewBoard(false);
  }

  function showLoginModal() {
    setShowLogin(true);
    setShowNewBoard(false);
    incrementCloseMenu();
  }

  function showNewBoardModal() {
    setShowNewBoard(true);
    incrementCloseMenu();
  }

  function closeLoginModal() {
    setShowLogin(false);
  }

  function closeNewBoardModal() {
    setShowNewBoard(false);
  }

  return (
    <>
      <div className="min-h-screen bg-surface">
        <Navbar userInfos={userInfos} onLoginClick={showLoginModal} onLogout={handleLogout} setView={handleViewChange} currentView={view} onSearch={handleSearch} searchQuery={searchQuery} />

        <main className="pt-[75px] bg-surface relative">
          {view === "home" && (<HomeWelcome userInfos={userInfos} setView={handleViewChange} onNewBoardClick={showNewBoardModal} />)}

          {view === "projects" && (
            <div className="px-6 py-4">
              {user ? (
                <>
                  <div className="flex justify-between items-center mb-6" data-aos="fade-down" data-aos-delay="200">
                    <h2 className="text-[clamp(12px,2vw,24px)] font-museo text-text">My projects</h2>

                    <div className="flex gap-4" data-aos="fade-left" data-aos-delay="400">
                      <button className="px-3 py-2 bg-accent1 text-white text-sm font-semibold shadow-lg rounded-lg border-2 border-dashed border-text hover:opacity-90 transition disabled:opacity-50" onClick={showNewBoardModal} disabled={isLoadingProjects}>
                        New Board 
                      </button>
                      <button className="px-3 py-2 bg-red-600 text-white text-sm font-semibold shadow-lg rounded-lg border-2 border-dashed border-text hover:bg-red-700 transition disabled:opacity-50" onClick={handleDeleteAllBoards} disabled={deletingAllBoardLoading || isLoadingProjects || projects.length === 0}>
                        {deletingAllBoardLoading ? "Deleting..." : "Delete all boards"}
                      </button>
                    </div>
                  </div>

                  {isLoadingProjects && (
                    <div className="text-center text-text py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent1"></div>
                      <p className="mt-2">Loading projects...</p>
                    </div>
                  )}

                  {!isLoadingProjects && filteredProjects.length === 0 && searchQuery === "" && (
                    <div className="text-center text-text py-8" data-aos="fade-up" data-aos-delay="600">
                      No projects yet. Create your first board!
                    </div>
                  )}

                  {!isLoadingProjects && filteredProjects.length === 0 && searchQuery !== "" && (
                    <div className="text-center text-text py-8" data-aos="fade-up" data-aos-delay="600">
                      No boards found for "{searchQuery}".<br />
                      Feel free to adjust your search or create this board!
                    </div>
                  )}

                  {!isLoadingProjects && filteredProjects.length > 0 && (
                    <CardGrid items={filteredProjects} onDelete={loadProjects} onBoardDeleted={BoardDelete} onBoardModificationError={BoardModificationError} closeMenu={closeMenu} />
                  )}
                </>
              ) : (
                <Welcome userInfos={userInfos} onLoginClick={showLoginModal} />
              )}
            </div>
          )}
        </main>
        

        {showLogin && (
          <Login onLogin={handleLogin} onClose={closeLoginModal} />
        )}

        {showNewBoard && (
          <NewBoardSettings onClose={closeNewBoardModal} onOpen={handleNewBoardCreated} />
        )}
      </div>

      <Footer currentView={view} setView={handleViewChange} />
    </>
  );
}
