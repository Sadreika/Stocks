import axios from "axios";
import { MDBContainer, MDBBtn } from "mdb-react-ui-kit";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dispatch, SetStateAction } from "react";

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

interface IProps {
  show: boolean;
  handleClose: () => void;
  getWatchlists: () => Promise<boolean>;
  selectedWatchlist: IWatchlist;
  setSelectedWatchlist: Dispatch<SetStateAction<IWatchlist>>;
  setWatchlistStocks: Dispatch<SetStateAction<IStock[]>>;
}

function DeleteWatchlistModal(props: IProps) {
  const DeleteWatchlist = async (): Promise<boolean> => {
    const token = localStorage.getItem("BearerToken");
    await axios
      .delete<IWatchlist[]>(
        `https://localhost:7074/Watchlist/DeleteWatchlist?stringToken=${token}`,
        {
          params: { id: props.selectedWatchlist.id },
        }
      )
      .then((response) => {
        props.getWatchlists();
        props.setWatchlistStocks([]);
        props.setSelectedWatchlist({
          id: 0,
          name: "Watchlist",
        });
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
            Delete {props.selectedWatchlist.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center pt-4 pb-4 flex-column">
          <p>Do you want to remove {props.selectedWatchlist.name}?</p>
          <MDBBtn className="mt-2" color="primary" onClick={DeleteWatchlist}>
            Delete
          </MDBBtn>
        </Modal.Body>
      </Modal>
    </MDBContainer>
  );
}

export default DeleteWatchlistModal;
