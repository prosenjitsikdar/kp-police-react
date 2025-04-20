import { BrowserRouter, useRoutes } from 'react-router-dom'; // Import BrowserRouter
import Login from "./components/auth/login/index.jsx";
import Register from "./components/auth/register/index.jsx";
import Header from "./components/header/index.jsx";
import Home from "./components/home/index.jsx";
import { AuthProvider } from "./contexts/authContext/index.jsx";
import AddCategoryForm from "./components/category/add.jsx";
import AddSubCategoryForm from "./components/subcategory/add.jsx";
import AddPoliceStationForm from "./components/PoliceStation/add.jsx";
import UserDataList from "./components/UserData/list.jsx";
import CsvDownload from "./components/csv/list.jsx";

function App() {
    const routesArray = [
        {
            path: "*",
            element: <Login />, // Catch-all route for all non-matching paths
        },
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/register",
            element: <Register />,
        },
        {
            path: "/home",
            element: <Home />,
        },
        {
            path: "/add-category",
            element: <AddCategoryForm />,
        },
        {
            path: "/sub-category",
            element: <AddSubCategoryForm />,
        },
        {
            path: "/police-station",
            element: <AddPoliceStationForm />,
        },
        {
            path: "/user-data",
            element: <UserDataList />,
        },
        {
            path: "/csv-download",
            element: <CsvDownload />,
        },
    ];

    // Define routes using useRoutes hook
    let routesElement = useRoutes(routesArray);

    return (
        <AuthProvider>
            <Header />
            <div className="w-full h-screen flex flex-col">
                {routesElement}
            </div>
        </AuthProvider>
    );
}

// Wrap the App component in BrowserRouter for routing to work
export default function AppWrapper() {
    return (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
}
