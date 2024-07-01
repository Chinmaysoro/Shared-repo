import React from "react";

export default function PrivatePage({ loggedIn, ...props }) {
  React.useEffect(() => {
    if (loggedIn) return;
    Router.replace("/login", { shallow: true });
  }, [loggedIn]);

  if (!loggedIn) return <LoginPage />;
}
