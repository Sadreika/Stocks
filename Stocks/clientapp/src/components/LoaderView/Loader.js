import { useEffect } from "react";
import { Grid } from "react-loader-spinner";
import "./Loader.css";

function Loader(props) {
  useEffect(() => {
    props.activeLoader
      ? document.body.classList.add("overflow-hidden")
      : document.body.classList.remove("overflow-hidden");
  }, [props.activeLoader]);

  return (
    <>
      {props.activeLoader && (
        <div className="loader-div">
          <Grid
            height="80"
            width="80"
            color="#1266f1"
            ariaLabel="grid-loading"
            radius="12.5"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      )}
    </>
  );
}

export default Loader;
