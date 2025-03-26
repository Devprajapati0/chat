import React, { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { Avatar, Tooltip } from "@mui/material";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 100,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 120,
    renderCell: (params) => (
      <Tooltip title={params.row.username} arrow>
        <Avatar
          src={params.row.avatar}
          alt={params.row.username}
          sx={{ width: 50, height: 50 }}
        />
      </Tooltip>
    ),
  },
  {
    field: "username",
    headerName: "Username",
    headerClassName: "table-header",
    width: 220,
  },
  {
    field: "email",
    headerName: "Email",
    headerClassName: "table-header",
    width: 280,
  },
  {
    field: "role",
    headerName: "Role",
    headerClassName: "table-header",
    width: 200,
  },
];

const dummyUsers = [
  {
    id: 1,
    username: "JohnDoe",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    email: "johndoe@example.com",
    role: "Admin",
  },
  {
    id: 2,
    username: "JaneSmith",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    email: "janesmith@example.com",
    role: "Editor",
  },
  {
    id: 3,
    username: "AlexBrown",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    email: "alexbrown@example.com",
    role: "User",
  },
];

const UserManagement = () => {
  const [rows, setRows] = useState(dummyUsers);

  return (
    <AdminLayout>
      <Table rows={rows} columns={columns} heading="All Users" />
    </AdminLayout>
  );
};

export default UserManagement;
