import React, { Dispatch, SetStateAction, useState } from "react";
import { MDBContainer, MDBBtn } from "mdb-react-ui-kit";
import { BsSearch, BsHouse } from "react-icons/bs";
import "./Menu.css";

interface IMenu {
  showSeachPartialView: boolean;
  showWatchlistsPartialView: boolean;
}

interface MenuProps {
  setMenu: Dispatch<SetStateAction<IMenu>>;
}

function Menu(props: MenuProps): JSX.Element {
  const resetMenuSelection = () => {
    props.setMenu({
      showSeachPartialView: false,
      showWatchlistsPartialView: false,
    });
  };

  return (
    <MDBContainer className="border h-fit-content w-fit-content bg-white pt-1 pb-1 d-flex justify-content-start align-items-center flex-column ms-3 me-2">
      <MDBBtn
        className="mx-2 mb-1"
        color="primary"
        onClick={() => {
          resetMenuSelection();
          props.setMenu((prevFormData) => {
            return { ...prevFormData, showWatchlistsPartialView: true };
          });
        }}
      >
        <BsHouse size={20} />
      </MDBBtn>
      <MDBBtn
        className="mx-2"
        color="primary"
        onClick={() => {
          resetMenuSelection();
          props.setMenu((prevFormData) => {
            return { ...prevFormData, showSeachPartialView: true };
          });
        }}
      >
        <BsSearch size={20} />
      </MDBBtn>
    </MDBContainer>
  );
}

export default Menu;
