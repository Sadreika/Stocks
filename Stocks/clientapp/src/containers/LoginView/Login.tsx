import { useState, ChangeEvent } from "react";
import axios from "axios";
import { IMethodResult } from "../../helper";
import Loader from "../../components/LoaderView/Loader";
import { MDBContainer, MDBInput, MDBBtn } from "mdb-react-ui-kit";

interface ILoginForm {
  email: string;
  password: string;
}

interface ILoginMessageForm {
  emailMessage: string;
  passwordMessage: string;
}

function Login() {
  const [formData, setFormData] = useState<ILoginForm>({
    email: "",
    password: "",
  });

  const [formMessageData, setFormMessageData] = useState<ILoginMessageForm>({
    emailMessage: "",
    passwordMessage: "",
  });

  const [activeLoader, setActiveLoader] = useState<boolean>(false);

  const HandleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => {
      return { ...prevFormData, [name]: value };
    });
  };

  const LoginUser = async () => {
    const validateForm = (): boolean => {
      let validFormData: boolean = true;
      setFormMessageData({
        emailMessage: "",
        passwordMessage: "",
      });

      if (formData.email === "") {
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

      if (formData.password === "") {
        validFormData = false;
        setFormMessageData((prevFormMessageData) => {
          return {
            ...prevFormMessageData,
            ["passwordMessage"]: "Password field is empty",
          };
        });
      }

      return validFormData;
    };

    const loginUser = async (): Promise<boolean> => {
      setActiveLoader(true);
      await axios
        .post<IMethodResult<string>>("https://localhost:7074/User/LoginUser", {
          Email: formData.email,
          Name: "",
          Surname: "",
          Password: formData.password,
          Username: "",
        })
        .then((response) => {
          localStorage.removeItem("BearerToken");
          localStorage.setItem("BearerToken", response.data.content);
        })
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

    if (await loginUser()) {
      window.location.href = "/";
    }
  };

  return (
    <>
      <Loader activeLoader={activeLoader} setActiveLoader={setActiveLoader} />
      <MDBContainer className="d-flex justify-content-center h-100 w-100">
        <MDBContainer className="d-flex justify-content-center flex-column align-items-center">
          <h2 className="text-center">
            <strong>Login</strong>
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
              label="Password"
              type="password"
              id="password"
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
            <MDBBtn className="mx-2" color="primary" onClick={LoginUser}>
              Login
            </MDBBtn>
          </div>

          <div className="p-2">
            <a href="/Registration">Registration</a>
          </div>
        </MDBContainer>
      </MDBContainer>
    </>
  );
}

export default Login;
