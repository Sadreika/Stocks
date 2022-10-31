import { useState, ChangeEvent } from "react";
import axios from "axios";
import { MDBContainer, MDBInput, MDBBtn } from "mdb-react-ui-kit";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CreateWatchlistModal.css";

interface IWatchlist {
  name: string;
}

interface IProps {
  show: boolean;
  handleClose: () => void;
  getWatchlists: () => Promise<boolean>;
}

function CreateWatchlistModal(props: IProps) {
  const [formData, setFormData] = useState<IWatchlist>({
    name: "",
  });

  const HandleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => {
      return { ...prevFormData, [name]: value };
    });
  };

  const CreateWatchlist = async (): Promise<boolean> => {
    const token = localStorage.getItem("BearerToken");
    await axios
      .post<IWatchlist[]>(
        `https://localhost:7074/Watchlist/CreateWatchlist?stringToken=${token}`,
        {
          Name: formData.name,
        }
      )
      .then((response) => {
        props.getWatchlists();
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
          <Modal.Title className="text-center">Create watchlist</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center pt-4 pb-4 flex-column">
          <MDBInput
            label="Watchlist name"
            className="modal-input"
            maxLength={200}
            name="name"
            value={formData.name}
            onChange={HandleChange}
            type="text"
          />
          <MDBBtn className="mt-2" color="primary" onClick={CreateWatchlist}>
            Create
          </MDBBtn>
        </Modal.Body>
      </Modal>
    </MDBContainer>
  );
}

export default CreateWatchlistModal;
