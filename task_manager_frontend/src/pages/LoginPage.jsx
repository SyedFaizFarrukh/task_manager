function LoginPage() {

    const loggedIn = true;

    return (
        <>
            {
                loggedIn
                    ? <h2>Welcome back!</h2>
                    : <h2>Please Login</h2>
            }
        </>
    );

}

export default LoginPage;