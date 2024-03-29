import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "routes/Profile";
import Navigation from "components/Navigation";

const AppRouter = ( { isLoggedIn, userObj } ) => {

    return (
        <BrowserRouter>
            {isLoggedIn && <Navigation />}
            <Routes>
                    {isLoggedIn ?  (
                        <>
                            <Route path="/" element={<Home userObj={userObj} />} />
                            <Route path="/profile" element={<Profile />} /> 
                        </>
                    ) : (
                        <>
                            <Route path="/" element={<Auth />} />
                        </>
                    )}
                <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;