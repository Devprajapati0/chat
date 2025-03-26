
import React, { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { Avatar, Tooltip, IconButton } from "@mui/material";
import { Delete, Visibility } from "@mui/icons-material";

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 80,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    width: 100,
    renderCell: (params) => (
      <Tooltip title={params.row.username} arrow>
        <Avatar
          src={params.row.avatar}
          alt={params.row.username}
          sx={{ width: 40, height: 40 }}
        />
      </Tooltip>
    ),
  },
  {
    field: "username",
    headerName: "Username",
    width: 200,
  },
  {
    field: "lastMessage",
    headerName: "Last Message",
    width: 300,
    renderCell: (params) => (
      <Tooltip title={params.row.lastMessage} arrow>
        <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "250px" }}>
          {params.row.lastMessage}
        </span>
      </Tooltip>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    renderCell: (params) => (
      <span
        style={{
          color: params.row.status === "Online" ? "green" : "gray",
          fontWeight: "bold",
        }}
      >
        {params.row.status}
      </span>
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => (
      <>
        <Tooltip title="View Chat">
          <IconButton onClick={() => handleViewChat(params.row.id)}>
            <Visibility color="primary" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Chat">
          <IconButton onClick={() => handleDeleteChat(params.row.id)}>
            <Delete color="error" />
          </IconButton>
        </Tooltip>
      </>
    ),
  },
];

const dummyChats = [
  {
    id: 1,
    username: "JohnDoe",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    lastMessage: "Hey, how's it going?",
    status: "Online",
  },
  {
    id: 2,
    username: "JaneSmith",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    lastMessage: "Meeting at 5 PM?",
    status: "Offline",
  },
  {
    id: 3,
    username: "AlexBrown",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    lastMessage: "Thanks for your help!",
    status: "Online",
  },
];

const MessageManagement = () => {
  const [rows, setRows] = useState(dummyChats);

  const handleDeleteChat = (id) => {
    setRows(rows.filter((chat) => chat.id !== id));
  };

  const handleViewChat = (id) => {
    alert(`Viewing chat with user ID: ${id}`);
  };

  return (
    <AdminLayout>
      <Table rows={rows} columns={columns} heading="Chat Management" />
    </AdminLayout>
  );
};

export default MessageManagement;
