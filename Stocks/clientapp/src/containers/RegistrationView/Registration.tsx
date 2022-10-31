import { useState, ChangeEvent } from "react";
import axios from "axios";
import { IMethodResult } from "../../helper";
import Loader from "../../components/LoaderView/Loader";
import { MDBContainer, MDBInput, MDBBtn } from "mdb-react-ui-kit";

interface IRegistrationForm {
  email: string;
  name: string;
  surname: string;
  password: string;
  username: string;
}

interface IRegistrationMessageForm {
  emailMessage: string;
  nameMessage: string;
  surnameMessage: string;
  passwordMessage: string;
  usernameMessage: string;
}

function Registration() {
  const [activeLoader, setActiveLoader] = useState<boolean>(false);

  const [formData, setFormData] = useState<IRegistrationForm>({
    email: "",
    name: "",
    surname: "",
    password: "",
    username: "",
  });

  const [formMessageData, setFormMessageData] =
    useState<IRegistrationMessageForm>({
      emailMessage: "",
      nameMessage: "",
      surnameMessage: "",
      passwordMessage: "",
      usernameMessage: "",
    });

  const HandleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => {
      return { ...prevFormData, [name]: value };
    });
  };

  const RegistrateUser = async () => {
    const validateForm = (): boolean => {
      let validFormData: boolean = true;
      setFormMessageData({
        emailMessage: "",
        nameMessage: "",
        surnameMessage: "",
        passwordMessage: "",
        usernameMessage: "",
      });

      if (formData.email == "") {
        validFormData = false;

        setFormMessageData((prevFormMessageData) => {
          return {
            ...prevFormMessageData,
            ["emailMessage"]: "Email field is empty",
          };
        });
      } else if (!formData.email.includes("@")) {
        validFormData = false;

        setFormMessageData((prevFormMessageData) => {
          return {
            ...prevFormMessageData,
            ["emailMessage"]: "Email is not valid",
          };
        });
      }

      if (formData.name == "") {
        validFormData = false;

        setFormMessageData((prevFormMessageData) => {
          return {
            ...prevFormMessageData,
            ["nameMessage"]: "Name field is empty",
          };
        });
      }

      if (formData.surname == "") {
        validFormData = false;

        setFormMessageData((prevFormMessageData) => {
          return {
            ...prevFormMessageData,
            ["surnameMessage"]: "Surname field is empty",
          };
        });
      }

      if (formData.password == "") {
        validFormData = false;

        setFormMessageData((prevFormMessageData) => {
          return {
            ...prevFormMessageData,
            ["passwordMessage"]: "Password field is empty",
          };
        });
      }

      if (formData.username == "") {
        validFormData = false;

        setFormMessageData((prevFormMessageData) => {
          return {
            ...prevFormMessageData,
            ["usernameMessage"]: "Username field is empty",
          };
        });
      }

      return validFormData;
    };

    const registrateUser = async (): Promise<boolean> => {
      setActiveLoader(true);
      await axios
        .post<IMethodResult<string>>(
          "https://localhost:7074/User/RegistrateUser",
          {
            Email: formData.email,
            Name: formData.name,
            Surname: formData.surname,
            Password: formData.password,
            Username: formData.username,
          }
        )
        .then((response) => {})
        .catch((error) => {
          if (error.response.status === 500) {
            window.location.href = "/500";
          } else {
          }
          return false;
        });

      setActiveLoader(false);
      return true;
    };

    if (!validateForm()) return;

    if (await registrateUser()) {
      window.location.href = "/Login";
    }
  };

  return (
    <>
      <Loader activeLoader={activeLoader} setActiveLoader={setActiveLoader} />
      <MDBContainer className="d-flex justify-content-center h-100 w-100">
        <MDBContainer className="d-flex justify-content-center flex-column align-items-center">
          <h2 className="text-center">
            <strong>Registration</strong>
          </h2>

          <div className="p-2">
            <MDBInput
              label="Email address"
              maxLength={320}
              name="email"
              value={formData.email}
              onChange={HandleChange}
              type="email"
            />
            <div className="text-danger small">
              {formMessageData.emailMessage}
            </div>
          </div>
          <div className="p-2">
            <MDBInput
              label="Name"
              maxLength={50}
              name="name"
              value={formData.name}
              onChange={HandleChange}
            />
            <div className="text-danger small">
              {formMessageData.nameMessage}
            </div>
          </div>
          <div className="p-2">
            <MDBInput
              label="Username"
              maxLength={50}
              name="username"
              value={formData.username}
              onChange={HandleChange}
            />
            <div className="text-danger small">
              {formMessageData.usernameMessage}
            </div>
          </div>
          <div className="p-2">
            <MDBInput
              label="Password"
              type="password"
              maxLength={50}
              name="password"
              value={formData.password}
              onChange={HandleChange}
            />
            <div className="text-danger small">
              {formMessageData.passwordMessage}
            </div>
          </div>
          <div className="p-2">
            <MDBInput
              label="Surname"
              maxLength={50}
              name="surname"
              value={formData.surname}
              onChange={HandleChange}
            />
            <div className="text-danger small">
              {formMessageData.surnameMessage}
            </div>
          </div>

          <div className="p-2">
            <MDBBtn className="mx-2" color="primary" onClick={RegistrateUser}>
              Registrate
            </MDBBtn>
          </div>

          <div className="p-2">
            <a href="/Login">Login</a>
          </div>
        </MDBContainer>
      </MDBContainer>
    </>
  );
}

export default Registration;
