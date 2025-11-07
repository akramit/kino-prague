import { BarLoader, RingLoader, ScaleLoader} from "react-spinners";

// To be updated in later commits
const style = {
  position: "fixed",
  top: "50%",
  left: "50%",
  zIndex : 9999
};


export function LoadingSpinner({ loading, size }) {
  return (
    <div>
      <ScaleLoader
        cssOverride={style}
        size = {size}
        color="#ff7700"
        loading={loading}
      />
    </div>
  );
}
