import Authentication from "./authentication/page";

const Home = () => {
  return (
    <div className="flex flex-col w-full py-50 items-center gap-6 ">
      <Authentication />
    </div>
  );
};

export default Home;
