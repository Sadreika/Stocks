import { useEffect, useState } from "react";
import axios from "axios";
import CreateWatchlistModal from "./CreateWatchlistModal/CreateWatchlistModal";
import WatchlistBlock from "./WatchlistBlock/WatchlistBlock";
import { IMethodResult, validateToken } from "../../../helper";
import { MDBContainer, MDBBtn } from "mdb-react-ui-kit";
import { BsPlusCircle } from "react-icons/bs";
import { BsTrash } from "react-icons/bs";
import DeleteWatchlistModal from "./DeleteWatchlistModal/DeleteWatchlistModal";
import WatchlistsTable from "./WatchlistsTable";
import "./WatchlistBlock/WatchlistBlock.css";
import "./Watchlists.css";

interface IWatchlist {
  id: number;
  name: string;
}

interface IStock {
  id: number;
  name: string;
  price: number;
  currency: string;
  symbol: string;
  yield: number;
  marketCap: string;
}

function WatchlistsPartialView() {
  const [watchlists, setWatchlists] = useState<IWatchlist[]>([]);
  const [watchListStocks, setWatchlistStocks] = useState<IStock[]>([]);
  const [selectedWatchlist, setSelectedWatchlist] = useState<IWatchlist>({
    id: 0,
    name: "Watchlist",
  });

  const [showCreateWatchlistModal, setShowCreateWatchlistModal] =
    useState(false);
  const handleShowCreateWatchlistModalClose = () =>
    setShowCreateWatchlistModal(false);
  const handleShowCreateWatchlistModalOpen = () =>
    setShowCreateWatchlistModal(true);

  const [showDeleteWatchlistModal, setShowDeleteWatchlistModal] =
    useState(false);
  const handleShowDeleteWatchlistModalClose = () =>
    setShowDeleteWatchlistModal(false);
  const handleShowDeleteWatchlistModalOpen = () =>
    setShowDeleteWatchlistModal(true);

  const getWatchlists = async (): Promise<boolean> => {
    const token = localStorage.getItem("BearerToken");
    if (!(await validateToken())) {
    }
    await axios
      .get<IMethodResult<IWatchlist[]>>(
        `https://localhost:7074/Watchlist/GetWatchlists`,
        {
          params: {
            stringToken: token,
          },
        }
      )
      .then((response) => {
        setWatchlists(response.data.content);
      })
      .catch((error) => {
        switch (error.response.status) {
          case 403:
            window.location.href = "/Login";
            break;
          case 400:
            break;
          default:
            window.location.href = `/Error?status=${error.response.status}`;
            break;
        }

        return false;
      });

    return true;
  };

  const getWatchListStocks = async (watchlistId: number): Promise<boolean> => {
    const token = localStorage.getItem("BearerToken");
    if (!(await validateToken())) {
    }

    await axios
      .get<IMethodResult<IStock[]>>(
        `https://localhost:7074/Stock/GetStocksByWatchlistId?stringToken=${token}&watchlistId=${watchlistId}`
      )
      .then((response) => {
        setWatchlistStocks(response.data.content);
      })
      .catch((error) => {
        switch (error.response.status) {
          case 403:
            window.location.href = "/Login";
            break;
          case 400:
            break;
          default:
            window.location.href = `/Error?status=${error.response.status}`;
            break;
        }
        return false;
      });

    return true;
  };

  useEffect(() => {
    getWatchlists();
  }, []);

  return (
    <>
      <MDBContainer className="d-flex justify-content-start ms-1 me-1 ps-0 pe-0">
        <MDBContainer className="watchlist-width ps-1 pe-1 ms-1 me-1 d-flex justify-content-start flex-column ms-1">
          <div className="watchlist-div">
            {watchlists.length !== 0 &&
              watchlists.map((watchlist) => (
                <WatchlistBlock
                  key={watchlist.id}
                  watchlistId={watchlist.id}
                  watchlistName={watchlist.name}
                  getWatchListStocks={getWatchListStocks}
                  setSelectedWatchlist={setSelectedWatchlist}
                />
              ))}
          </div>
          <CreateWatchlistModal
            show={showCreateWatchlistModal}
            handleClose={handleShowCreateWatchlistModalClose}
            getWatchlists={getWatchlists}
          />
          <DeleteWatchlistModal
            show={showDeleteWatchlistModal}
            handleClose={handleShowDeleteWatchlistModalClose}
            getWatchlists={getWatchlists}
            selectedWatchlist={selectedWatchlist}
            setSelectedWatchlist={setSelectedWatchlist}
            setWatchlistStocks={setWatchlistStocks}
          />
          <MDBBtn
            className="mx-2 mt-1 mb-1 btn btn-primary watchlist-button-width"
            onClick={handleShowCreateWatchlistModalOpen}
          >
            <BsPlusCircle size={20} /> Create
          </MDBBtn>
        </MDBContainer>
        <MDBContainer className="wm-stock-container border w-25 h-fit-content w-fit-content bg-white pt-1 pb-1 d-flex justify-content-start align-items-center flex-column ms-1 me-1">
          <MDBContainer className=" d-flex justify-content-between flex-row mb-1 align-items-center">
            <strong>{selectedWatchlist.name}</strong>
            {selectedWatchlist.id !== 0 && (
              <MDBBtn
                className="ripple ripple-surface ripple-surface-light btn btn-primary btn btn-light"
                onClick={handleShowDeleteWatchlistModalOpen}
              >
                <BsTrash size={20} />
              </MDBBtn>
            )}
          </MDBContainer>
          <MDBContainer>
            <WatchlistsTable
              watchListStocks={watchListStocks}
              selectedWatchlist={selectedWatchlist}
              getWatchListStocks={getWatchListStocks}
            />
          </MDBContainer>
        </MDBContainer>
      </MDBContainer>
    </>
  );
}

export default WatchlistsPartialView;
