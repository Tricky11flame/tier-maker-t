import { useAuth0 } from "@auth0/auth0-react";
function SaveBttn({saveData }) {
  const {
    isLoading, // Loading state, the SDK needs to reach Auth0 on load
    isAuthenticated,
    error,
    loginWithRedirect: login, // Starts the login flow
    logout: auth0Logout, // Starts the logout flow
    user, // User profile
  } = useAuth0();

  if (!isAuthenticated) {
    // Trigger login, then redirect back here
    await loginWithRedirect({
      appState: { returnTo: window.location.pathname },
    });
    return;
  }

  // Save data to your backend
  // const res = await fetch('/api/save', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${token}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ data: yourData }),
  // });

  // if (res.ok) {
  //   console.log('Data saved!');
  // } else {
  //   console.error('Save failed.');
  // }

  const signup = () =>
    login({ authorizationParams: { screen_hint: "signup" } });

  const logout = () =>
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });

  if (isLoading) return "Loading...";

  return isAuthenticated ? (
    <>
      <p>Logged in as {user.email}</p>

      <h1>User Profile</h1>

      <pre>{JSON.stringify(user, null, 2)}</pre>

      <button onClick={logout}>Logout</button>
    </>
  ) : (
    <>
      {error && <p>Error: {error.message}</p>}

      <button onClick={signup}>Signup</button>

      <button onClick={login}>Login</button>
    </>
  );


  return (
    <button
    onClick={() => {
      saveData();
    }}
    className="h-[30px] w-[200px]  z-20 fixed bottom-20 left-4
    cursor-pointer rounded-lg bg-mainBackgroundColor
    border-2 border-columnBackgroundColor p-6 items-center 
    ring-rose-500 hover:ring-2 flex gap-2">
    {/* <PokeIcon/> */}
    <img className="h-8 mx-auto bg-white rounded-full border-4 border-blue-600" src={`../../2.png`} alt="pokemon"/>
    <div className="mx-auto">
      Save Board
    </div>
  </button> 
  )
}

export default SaveBttn
