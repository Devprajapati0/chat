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
    headerName: "Group Avatar",
    width: 100,
    renderCell: (params) => (
      <Tooltip title={params.row.groupName} arrow>
        <Avatar
          src={params.row.avatar}
          alt={params.row.groupName}
          sx={{ width: 40, height: 40 }}
        />
      </Tooltip>
    ),
  },
  {
    field: "groupName",
    headerName: "Group Name",
    width: 220,
  },
  {
    field: "members",
    headerName: "Members",
    width: 120,
    align: "center",
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
          color: params.row.status === "Active" ? "green" : "gray",
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
        <Tooltip title="View Group">
          <IconButton onClick={() => handleViewGroup(params.row.id)}>
            <Visibility color="primary" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Group">
          <IconButton onClick={() => handleDeleteGroup(params.row.id)}>
            <Delete color="error" />
          </IconButton>
        </Tooltip>
      </>
    ),
  },
];

const dummyGroups = [
  {
    id: 1,
    groupName: "Developers Hub",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    members: 12,
    lastMessage: "Hey team, new updates available!",
    status: "Active",
  },
  {
    id: 2,
    groupName: "UI/UX Designers",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    members: 8,
    lastMessage: "Figma designs updated, please review.",
    status: "Inactive",
  },
  {
    id: 3,
    groupName: "Tech Enthusiasts",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    members: 20,
    lastMessage: "Next meetup scheduled for Friday.",
    status: "Active",
  },
];

const ChatManagement = () => {
  const [rows, setRows] = useState(dummyGroups);

  const handleDeleteGroup = (id) => {
    setRows(rows.filter((group) => group.id !== id));
  };

  const handleViewGroup = (id) => {
    alert(`Viewing group with ID: ${id}`);
  };

  return (
    <AdminLayout>
      <Table rows={rows} columns={columns} heading="Group Management" />
    </AdminLayout>
  );
};

export default ChatManagement;
