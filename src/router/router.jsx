import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Admin_Candidate_List from "../Page/Admin_panel/Admin_Candidate_List";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <Admin_Candidate_List />,
      },
    ],
  },

]);

export default router;
