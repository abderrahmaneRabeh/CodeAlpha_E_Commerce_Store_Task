import Footer from "./Footer";
import Navbar from "./Navbar";

// eslint-disable-next-line react/prop-types
export default function Content({ children }) {
  return (
    <>
      <Navbar />
      <div>{children}</div>
      <Footer />
    </>
  );
}
