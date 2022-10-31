import { useState, useEffect, SetStateAction } from "react";
import axios from "axios";
import { MDBContainer, MDBInput, MDBBtn } from "mdb-react-ui-kit";
import { Modal } from "react-bootstrap";
import { validateToken, IMethodResult } from "../../../../helper";
import "bootstrap/dist/css/bootstrap.min.css";

interface IStock {
  id: number;
  name: string;
}

interface IWatchlist {
  id: number;
  name: string;
}

interface IProps {
  show: boolean;
  handleClose: () => void;
  selectedStock: IStock;
  watchlists: IWatchlist[];
}

function AddStockToWatchlistModal(props: IProps) {
  const [selectedWatchlist, setSelectedWatchlist] = useState<IWatchlist>();

  const addStockToWatchlist = async (): Promise<boolean> => {
    const token = localStorage.getItem("BearerToken");
    if (!(await validateToken())) {
    }

    if (selectedWatchlist === null) {
      return false;
    }

    await axios
      .post<IMethodResult<IStock[]>>(
        `https://localhost:7074/Watchlist/AddStockToWatchlist?stringToken=${token}&stockId=${props.selectedStock.id}&watchlistId=${selectedWatchlist?.id}`
      )
      .then((response) => {})
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
    <MDBContainer className="wm-fit-content">
      <Modal className="modal" show={props.show} onHide={props.handleClose}>
        <Modal.Header className="modal-header justify-content-center">
          <Modal.Title className="text-center">
            Add stock to selected watchlist
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center pt-4 pb-4 flex-column">
          {props.watchlists.map((item, index) => (
            <MDBContainer className="mb-1" key={index}>
              <input
                className="form-check-input"
                value={item.name}
                type="radio"
                checked={selectedWatchlist === item}
                onChange={() => setSelectedWatchlist(item)}
              />
              <label>{item.name}</label>
            </MDBContainer>
          ))}
          <MDBBtn
            className="mx-2 mt-2"
            color="primary"
            onClick={() => addStockToWatchlist()}
          >
            Add stock
          </MDBBtn>
        </Modal.Body>
      </Modal>
    </MDBContainer>
  );
}

export default AddStockToWatchlistModal;
