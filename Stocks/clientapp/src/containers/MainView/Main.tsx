import React, { useState } from "react";
import SearchPartialView from "./SearchPartialView/Search";
import WatchlistsPartialView from "./WatchlistsPartialView/Watchlists";
import Menu from "./Menu/Menu";
import Header from "./Header/Header";
import { MDBContainer } from "mdb-react-ui-kit";
import "./Main.css";

interface IMenu {
  showSeachPartialView: boolean;
  showWatchlistsPartialView: boolean;
}

function Main() {
  const [menu, setMenu] = useState<IMenu>({
    showSeachPartialView: false,
    showWatchlistsPartialView: true,
  });

  return (
    <>
      <Header />
      <MDBContainer className="light-slate-gray container-height mw-100 pt-5 pe-2 ps-2 d-flex justify-content-start">
        <Menu setMenu={setMenu} />
        {menu.showSeachPartialView && <SearchPartialView />}
        {menu.showWatchlistsPartialView && <WatchlistsPartialView />}
      </MDBContainer>
    </>
  );
}

export default Main;
