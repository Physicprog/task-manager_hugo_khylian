import React, { useEffect, useState } from "react";
import Navbar from "./components/navbar.jsx";
import Login from "./components/login.jsx";
import Welcome from "./components/welcome.jsx";
import HomeWelcome from "./components/HomeWelcome.jsx";
import CardGrid from "./components/gridProject.jsx";
import NewBoardSettings from "./components/NewBoardSettings.jsx";
import { getUserInfos, initializeUserData } from "./services/authService.js";
import { removeElements } from "./services/storage.js";
import { getUserBoardProjects, deleteBoard } from './services/boardProject.js';
import Footer from "./components/footer.jsx";
import AOS from 'aos';
import { SendNotification } from "./utils/notifs.js";

function Home() {
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


  async function loadProjects() {
    setIsLoadingProjects(true);
    try {
      const boardProjects = await getUserBoardProjects();
      setProjects(boardProjects);
      setFilteredProjects(boardProjects);
    } catch (error) {
      setProjects([]);
      setFilteredProjects([]);
    } finally {
      setIsLoadingProjects(false);


      {/*
      setTimeout(() => {
        AOS.refresh();
      }, 100);
      */}
    }
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
    if (searchQuery !== "") {
      setSearchQuery("");
      setFilteredProjects(projects);
    }
    setViewBeforeSearch(null);

    {/*
    setTimeout(() => {
      AOS.refresh();
    }, 100);*/}
  }

  async function switchDeleteAll() {
    setDeletingAllBoardLoading(true);
    const boardsToDelete = await getUserBoardProjects();
    if (boardsToDelete.length === 0) {
      setDeletingAllBoardLoading(false);
      return;
    }

    for (const board of boardsToDelete) {
      const boardId = board.documentId || board.id;
      try {
        await deleteBoard(boardId);
      } catch (err) {
        SendNotification(`Error deleting board: ${err}`, true, false);
      }
    }
    setDeletingAllBoardLoading(false);
    await loadProjects();
  }


  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    async function init() {
      try {
        const userData = await initializeUserData();

        setUser(userData);
        setUserInfos(getUserInfos(userData));

        const boards = await getUserBoardProjects();
        setProjects(boards);
        setFilteredProjects(boards);
      } catch {
        removeElements({ token: 0, userInfo: 0, userGender: 0 });
      }
    }

    init();
  }, []);

  async function SwipLogin(data) {
    if (data?.user) {
      setUser(data.user);
      setUserInfos(getUserInfos(data.user));

      const boards = await getUserBoardProjects();
      setProjects(boards);
    }

    setShowLogin(false);
    setShowNewBoard(false);
  }

  function SwipLogout() {
    removeElements({ token: 0, userInfo: 0, userGender: 0 });
    setUser(null);
    setUserInfos(getUserInfos(null));
    setProjects([]);
    setShowLogin(false);
    setShowNewBoard(false);
    setView("home");
  }

  async function SwipNewBoard(newBoard) {
    await loadProjects();
    setShowNewBoard(false);
  }

  return (
    <>
      <div className="min-h-screen bg-surface">
        <Navbar userInfos={userInfos} onLoginClick={() => { setShowLogin(true); setShowNewBoard(false); }} onLogout={SwipLogout} setView={switchViewChange} currentView={view} onSearch={handleSearch} searchQuery={searchQuery} />

        <main className="pt-[75px] bg-surface relative">
          {view === "home" && <HomeWelcome userInfos={userInfos} />}

          {view === "projects" && (
            <div className="px-6 py-4">
              {user ? (
                <>
                  <div className="flex justify-between items-center mb-6" data-aos="fade-down" data-aos-delay="200">
                    <h2 className="text-[clamp(12px,2vw,24px)] font-museo text-text">
                      My projects
                    </h2>

                    <div className="flex gap-4" data-aos="fade-left" data-aos-delay="400">
                      <button className="px-3 py-2 bg-accent1 text-white text-sm font-semibold shadow-lg rounded-lg border-2 border-dashed border-text" onClick={() => setShowNewBoard(true)} >
                        New Board
                      </button>
                      <button className="px-3 py-2 bg-accent1 text-white text-sm font-semibold shadow-lg rounded-lg border-2 border-dashed border-text" onClick={() => switchDeleteAll()}>
                        Delete all boards
                      </button>
                    </div>
                  </div>

                  {deletingAllBoardLoading && (
                    <div className="text-center text-text py-4 margin-bottom-4">
                      Deleting all boards...
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
                    <CardGrid items={filteredProjects} onDelete={loadProjects} />
                  )} </>) : (<Welcome userInfos={userInfos} onLoginClick={() => setShowLogin(true)} />)}
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

      <Footer />
    </>
  );
}

export default Home;