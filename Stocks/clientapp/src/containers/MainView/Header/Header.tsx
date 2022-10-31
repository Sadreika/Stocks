import React, { useEffect, useState } from "react";
import axios from "axios";
import { IMethodResult, validateToken } from "../../../helper";
import { MDBContainer } from "mdb-react-ui-kit";
import "./Header.css";

interface IUser {
  email: string;
  name: string;
  surname: string;
  username: string;
}

function Header(): JSX.Element {
  const [user, setUser] = useState<IUser>({
    email: "",
    name: "",
    surname: "",
    username: "",
  });

  const getUser = async (): Promise<boolean> => {
    const token = localStorage.getItem("BearerToken");

    if (!(await validateToken())) {
    }

    await axios
      .get<IMethodResult<IUser>>(`https://localhost:7074/User/GetUser`, {
        params: {
          stringToken: token,
        },
      })
      .then((response) => {
        setUser(response.data.content);
      })
      .catch((error) => {
        switch (error.response.status) {
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
    getUser();
  }, []);

  return (
    <MDBContainer className="border-bottom position-absolute top-0 end-0 bg-white d-flex justify-content-end mw-100 pt-2 pb-2 pe-1">
      <strong>{user.email}</strong>
    </MDBContainer>
  );
}

export default Header;
