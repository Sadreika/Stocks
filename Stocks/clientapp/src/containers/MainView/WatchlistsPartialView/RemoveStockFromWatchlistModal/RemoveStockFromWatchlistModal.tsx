import axios from "axios";
import { MDBContainer, MDBBtn } from "mdb-react-ui-kit";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

interface IStock {
  id: number;
  name: string;
}

interface IWatchlist {
  id: number;
  name: string;
}

interface IStockWatchlist {
  stockId: number;
  watchlistId: number;
}

interface IProps {
  show: boolean;
  handleClose: () => void;
  selectedStock: IStock;
  selectedWatchlist: IWatchlist;
  getWatchListStocks: (watchlistId: number) => Promise<boolean>;
}

function RemoveStockFromWatchlistModal(props: IProps) {
  const RemoveStockFromWatchlist = async (): Promise<boolean> => {
    const token = localStorage.getItem("BearerToken");
    await axios
      .delete<IStockWatchlist>(
        `https://localhost:7074/Watchlist/DeleteStockFromWatchlist?stringToken=${token}`,
        {
          params: {
            stockId: props.selectedStock.id,
            watchlistId: props.selectedWatchlist.id,
          },
        }
      )
      .then((response) => {
        props.getWatchListStocks(props.selectedWatchlist.id);
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

    props.handleClose();
    return true;
  };

  return (
    <MDBContainer className="wm-fit-content">
      <Modal className="modal" show={props.show} onHide={props.handleClose}>
        <Modal.Header className="modal-header justify-content-center">
          <Modal.Title className="text-center">
            Remove stock from {props.selectedWatchlist.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center pt-4 pb-4 flex-column">
          <p>
            Do you want to remove stock from {props.selectedWatchlist.name}?
          </p>
          <MDBBtn
            className="mt-2"
            color="primary"
            onClick={() => RemoveStockFromWatchlist()}
          >
            Remove
          </MDBBtn>
        </Modal.Body>
      </Modal>
    </MDBContainer>
  );
}

export default RemoveStockFromWatchlistModal;
