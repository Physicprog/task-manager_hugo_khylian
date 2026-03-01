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


  async function loadProjects() {
    setIsLoadingProjects(true);
    try {
      const boardProjects = await getUserBoardProjects();

      setProjects(boardProjects); //met a jour les projets
      setFilteredProjects(boardProjects); //met a jour les projets affichés 
    } catch (error) {
      setProjects([]); //refresh les projets de force pour eviter les bugs
      setFilteredProjects([]);
    } finally {
      setIsLoadingProjects(false);
    }
  }




  async function BoardDelete(deletedBoardId) { //boucle pour summprimer tout les boards du front pour pas revenir sur la page
    const updatedProjects = projects.filter(board => board.documentId != deletedBoardId);  //on prend les projets et on filtre en comparant les id supprimer avec les id des projets, si ils sont different on les garde, sinon on les supprime si les id sont les memes on les supprime
    const updatedFilteredProjects = filteredProjects.filter(board => board.documentId != deletedBoardId); //pareil pour les projets affichés
    setProjects(updatedProjects);
    setFilteredProjects(updatedFilteredProjects);
  }

  async function BoardModificationError(boardId) {
    await BoardDelete(boardId);
    await loadProjects();
  }

  function handleSearch(query) {
    setSearchQuery(query);

    if (query.length > 0) {
      if (searchQuery === "") {
        setViewBeforeSearch(view);
      }
      setView("projects");
      const filtered = projects.filter(board =>
        board.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProjects(filtered);
    } else {
      const targetView = viewBeforeSearch || "home";
      setView(targetView);
      setViewBeforeSearch(null);
      setFilteredProjects(projects);
    }
  }


  function switchViewChange(newView) {
    setView(newView);
    if (searchQuery !== "") { //si on est sur home > reste sur home, si on est sur projects > reste sur projects
      setSearchQuery("");
      setFilteredProjects(projects);
    }
    setViewBeforeSearch(null);
    setCloseMenu(closeMenu + 1);
  }


  async function switchDeleteAll() {
    if (deletingAllBoardLoading) {
      SendNotification("Deletion already in progress...", true, false);
      return;
    }

    setDeletingAllBoardLoading(true);

    try {
      const boardsToDelete = await getUserBoardProjects();

      if (boardsToDelete.length === 0) {
        SendNotification("No boards to delete", true, false);
        setDeletingAllBoardLoading(false);
        return;
      }

      for (const board of boardsToDelete) {
        await deleteBoard(board.documentId);
      }

      SendNotification("All boards deleted successfully", true, true);
      await loadProjects();
    } catch (error) {
      SendNotification("Error deleting boards", true, false);
    } finally {
      setDeletingAllBoardLoading(false);
    }
  }

  useEffect(() => { //charge les projets au debut 
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    async function init() {
      try {
        const userData = await initializeUserData();

        setUser(userData);
        setUserInfos(getUserInfos(userData));

        const boards = await getUserBoardProjects();

        setProjects(boards);
        setFilteredProjects(boards);
      } catch (error) {
        removeElements({ token: 0, userInfo: 0, userGender: 0 });
      }
    }

    init(); //premiere chose a faire au debut pour charger les projets et les infos de l'utilisateur
  }, []);

  async function SwipLogin(data) {
    if (data?.user) { //le ?. veut dire si data et user existe alors on continue
      setUser(data.user);
      setUserInfos(getUserInfos(data.user));

      try {
        const boards = await getUserBoardProjects();
        setProjects(boards);
        setFilteredProjects(boards);
      } catch (error) {
        setProjects([]);
        setFilteredProjects([]);
      }
    } else {
      SendNotification("Login failed: No user data received", true, false);
    }
    setShowLogin(false);
    setShowNewBoard(false);
  }

  function SwipLogout() {
    removeElements({ token: 0, userInfo: 0, userGender: 0 });
    setUser(null);
    setUserInfos(getUserInfos(null));
    setProjects([]);
    setFilteredProjects([]);
    setShowLogin(false);
    setShowNewBoard(false);
    setView("home");
    SendNotification("Logged out successfully", true, true);
  }

  async function SwipNewBoard() {
    await loadProjects();
    setShowNewBoard(false);
  }

  // Suppression de compte désactivée

  return (
    <>
      <div className="min-h-screen bg-surface">
        <Navbar userInfos={userInfos} onLoginClick={() => { setShowLogin(true); setShowNewBoard(false); setCloseMenu(closeMenu + 1); }} onLogout={SwipLogout} //fait + 1 pour fermer les menus deroulants (passe une prop qui change a chaque fois pour forcer le rechargement des composants qui ont cette prop)
          setView={switchViewChange} currentView={view} onSearch={handleSearch} searchQuery={searchQuery} />

        <main className="pt-[75px] bg-surface relative">
          {view === "home" && (<HomeWelcome userInfos={userInfos} setView={switchViewChange} onNewBoardClick={() => { setShowNewBoard(true); setCloseMenu(closeMenu + 1); }} />)}

          {view === "projects" && (
            <div className="px-6 py-4">
              {user ? ( //si l'user est connecté
                <>
                  <div className="flex justify-between items-center mb-6" data-aos="fade-down" data-aos-delay="200">
                    <h2 className="text-[clamp(12px,2vw,24px)] font-museo text-text">
                      My projects
                    </h2>

                    <div className="flex gap-4" data-aos="fade-left" data-aos-delay="400">
                      <button className="px-3 py-2 bg-accent1 text-white text-sm font-semibold shadow-lg rounded-lg border-2 border-dashed border-text hover:opacity-90 transition disabled:opacity-50" onClick={() => { setShowNewBoard(true); setCloseMenu(closeMenu + 1); }} disabled={isLoadingProjects}>
                        New Board </button>
                      <button className="px-3 py-2 bg-red-600 text-white text-sm font-semibold shadow-lg rounded-lg border-2 border-dashed border-text hover:bg-red-700 transition disabled:opacity-50" onClick={switchDeleteAll} disabled={deletingAllBoardLoading || isLoadingProjects || projects.length === 0}>
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
                <Welcome userInfos={userInfos} onLoginClick={() => setShowLogin(true)} />
              )}
            </div>
          )}
        </main>


        {showLogin && (
          <Login onLogin={SwipLogin} onClose={() => setShowLogin(false)} />
        )}

        {showNewBoard && (
          <NewBoardSettings onClose={() => setShowNewBoard(false)} onOpen={SwipNewBoard} />
        )}
      </div>

      <Footer currentView={view} setView={switchViewChange} />
    </>
  );
}
