import Link from "next/link";

const ButtonLogin = ({ isLoggedIn, name }) => {
  if (isLoggedIn) {
    return (
      <Link href="/dashboard" className="btn btn-primary">
        Welcome back, {name}
      </Link>
    );
  }

  return <button className="btn">Login</button>;
};

export default ButtonLogin;



