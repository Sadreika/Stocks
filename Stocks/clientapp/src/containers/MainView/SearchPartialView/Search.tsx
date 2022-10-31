import { useEffect, useState } from "react";
import axios from "axios";
import StocksTable from "./StocksTable";
import { MDBContainer, MDBBtn, MDBInput } from "mdb-react-ui-kit";
import { IMethodResult, validateToken } from "../../../helper";
import { BsSearch } from "react-icons/bs";
import Loader from "../../../components/LoaderView/Loader";
import "./Search.css";

interface IStock {
  id: number;
  name: string;
  price: number;
  currency: string;
  symbol: string;
  yield: number;
  marketCap: string;
}

interface IWatchlist {
  id: number;
  name: string;
}

function SearchPartialView() {
  const [searchInput, setSearchInput] = useState<string>();
  const [stocks, setStocks] = useState<IStock[]>([]);
  const [watchlists, setWatchlists] = useState<IWatchlist[]>([]);
  const [activeLoader, setActiveLoader] = useState<boolean>(false);

  const getAllStocks = async (): Promise<boolean> => {
    setActiveLoader(true);

    const token = localStorage.getItem("BearerToken");
    if (!(await validateToken())) {
    }
    await axios
      .get<IMethodResult<IStock[]>>(
        `https://localhost:7074/Stock/GetAllStocks`,
        {
          params: {
            stringToken: token,
          },
        }
      )
      .then((response) => {
        setStocks(response.data.content);
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

    setActiveLoader(false);
    return true;
  };

  const getWatchlists = async (): Promise<boolean> => {
    setActiveLoader(true);
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

    setActiveLoader(false);
    return true;
  };

  useEffect(() => {
    getAllStocks();
    getWatchlists();
  }, []);

  const getStock = async (): Promise<boolean> => {
    const token = localStorage.getItem("BearerToken");
    if (!(await validateToken())) {
    }
    await axios
      .get<IMethodResult<IStock[]>>(
        `https://localhost:7074/Stock/GetStockByName?name=${searchInput}`,
        {
          params: {
            stringToken: token,
          },
        }
      )
      .then((response) => {
        getAllStocks();
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

  return (
    <>
      <Loader activeLoader={activeLoader} setActiveLoader={setActiveLoader} />
      <MDBContainer className="border bg-white pt-1 pb-1 d-flex justify-content-start align-items-center ms-3 me-3 flex-column partial-view-container-height partial-view-container-width">
        <MDBContainer className="d-flex justify-content-center align-items-center flex-row">
          <div className="w-75">
            <MDBInput
              label="Search"
              className="modal-input"
              maxLength={200}
              name="name"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              type="text"
            />
          </div>
          <MDBBtn
            className="mx-2 mb-1 btn btn-primary stock-button-width"
            onClick={getStock}
          >
            <BsSearch size={20} />
          </MDBBtn>
        </MDBContainer>
        <MDBContainer>
          <StocksTable stocks={stocks} watchlists={watchlists} />
        </MDBContainer>
      </MDBContainer>
    </>
  );
}

export default SearchPartialView;
