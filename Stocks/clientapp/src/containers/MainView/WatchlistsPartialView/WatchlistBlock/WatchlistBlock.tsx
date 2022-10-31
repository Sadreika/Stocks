import { MDBBtn } from "mdb-react-ui-kit";
import { Dispatch, SetStateAction } from "react";
import "./WatchlistBlock.css";

interface IWatchlist {
  id: number;
  name: string;
}

interface IWatchlistBlock {
  watchlistId: number;
  watchlistName: string;
  getWatchListStocks: (watchlist: number) => Promise<boolean>;
  setSelectedWatchlist: Dispatch<SetStateAction<IWatchlist>>;
}

function WatchlistBlock(props: IWatchlistBlock): JSX.Element {
  return (
    <MDBBtn
      className="mx-2 mb-1 btn btn-light watchlist-button-width"
      onClick={() => {
        props.getWatchListStocks(props.watchlistId);
        props.setSelectedWatchlist({
          id: props.watchlistId,
          name: props.watchlistName,
        });
      }}
    >
      {props.watchlistName}
    </MDBBtn>
  );
}

export default WatchlistBlock;
