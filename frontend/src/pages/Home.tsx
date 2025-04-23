import { FC } from "react";
import LogoutButton from "../components/account/LogoutButton";

const Home: FC = () => {
  return (
    <>
      <div>
        <h1>Welcome to the Home Page</h1>
        <p>This is the home page of our application.</p>
      </div>
      <LogoutButton />
    </>
  );
};

export default Home;
