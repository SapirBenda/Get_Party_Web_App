import { UserAuth } from "./ContextProvider";
import { useNavigate } from "react-router-dom";


export default function ProtectedRoute({children}) {
    const {currentUser} = UserAuth()
    const navigate = useNavigate()

    if (!localStorage.getItem("logged_in")){
        //if the user is not logged in navigate Home
        return navigate("/")
    } else {
        return children
    }

}
