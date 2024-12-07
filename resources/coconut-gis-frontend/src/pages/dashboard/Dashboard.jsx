import React from "react";
import { useAdminStore } from "../../store/admin";

const Dashboard = () => {
    const admin = useAdminStore((state) => state.admin);

    return <div>{admin?.name}</div>;
};

export default Dashboard;
