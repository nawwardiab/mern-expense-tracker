import Navbar from "../components/Navbar";

const MinimalLayout = ({ children }) => {
    return (
      <div>
        <Navbar />
        <main className="p-4">{children}</main>
      </div>
    );
  };
  
  export default MinimalLayout;