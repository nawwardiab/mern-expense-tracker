import Navbar from "../components/reusable/Navbar";



const ProtectedLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main className="p-4">{children}</main>
    </div>
  );
};

export default ProtectedLayout;
