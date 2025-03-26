import { Container, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const Table = ({ rows, columns, heading, rowHeight = 60 }) => {
  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Paper
        elevation={4}
        sx={{
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "95%",
          maxWidth: "1400px",
          borderRadius: "1rem",
          backgroundColor: "#F8FAFC",
          color: "#333",
          boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Table Heading */}
        <Typography
          textAlign="center"
          variant="h5"
          sx={{
            marginBottom: "1rem",
            padding: "0.7rem",
            color: "#1E293B",
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          {heading}
        </Typography>

        {/* Data Grid Table */}
        <DataGrid
  rows={rows}
  columns={columns}
  pageSize={5}
  rowsPerPageOptions={[5, 10, 20]}
  autoHeight
  sx={{
    "& .MuiDataGrid-row": {
      height: "60px",  // 🔹 Ensure row height accommodates avatars
    },
    "& .MuiDataGrid-cell": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "visible",  // 🔹 Prevents image clipping
    },
    "& .MuiDataGrid-cell img": {
      width: "40px",  // Adjust image size
      height: "40px",
      borderRadius: "50%",  // Ensure circular shape
      objectFit: "cover",  // Prevents distortion
    },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "#334155",
      color: "black",
      fontSize: "1rem",
      fontWeight: "bold",
      textTransform: "uppercase",
      padding: "10px",
      whiteSpace: "nowrap",
    },
  }}
/>

      </Paper>
    </Container>
  );
};

export default Table;
