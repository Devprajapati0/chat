import moment from "moment";
import {
  Box,
  Container,
  Paper,
  Stack,
  Typography,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import AdminLayout from "../../components/layout/AdminLayout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { Group, Message, NotificationAdd, Person } from "@mui/icons-material";
import { DoughnutChart, LineChart } from "../../components/specific/Charts";

const Dashboard = () => {
  return (
    <AdminLayout>
      <Container component="main" maxWidth="xl">
        {/* Appbar */}
        <Paper
          elevation={3}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 1.5rem",
            marginBottom: "1rem",
            borderRadius: "1rem",
            backgroundColor: "#1E293B",
            color: "#fff",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2} width="100%">
            <AdminPanelSettingsIcon sx={{ fontSize: "3rem", color: "#60A5FA" }} />

            {/* Search Input */}
            <TextField
              variant="outlined"
              placeholder="Search..."
              size="small"
              sx={{
                flex: 1,
                bgcolor: "white",
                borderRadius: "0.5rem",
                "& input": { padding: "0.6rem" },
                "& fieldset": { border: "none" },
              }}
            />

            <Button variant="contained" sx={{ bgcolor: "#60A5FA", color: "#fff" }}>
              Search
            </Button>

            <Box>
              <Typography>{moment().format("MMMM Do YYYY")}</Typography>
            </Box>

            <NotificationAdd sx={{ fontSize: "2rem", cursor: "pointer" }} />
          </Stack>
        </Paper>

        {/* Grid Layout */}
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Widget title="Users" value={20} icon={<Person />} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Widget title="Chats" value={20010} icon={<Group />} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Widget title="Messages" value={100} icon={<Message />} />
          </Grid>

          <Grid item xs={12} md={6}>
            <ChartCard title="Last Messages" chart={<LineChart />} />
          </Grid>
          <Grid item xs={12} md={6}>
            <ChartCard title="User vs Group" chart={<DoughnutChart />} />
          </Grid>
        </Grid>
      </Container>
    </AdminLayout>
  );
};

const Widget = ({ title, value, icon }) => (
  <Paper
    elevation={3}
    sx={{
      padding: "1.5rem",
      borderRadius: "1rem",
      bgcolor: "#1E293B",
      color: "#F8FAFC",
      textAlign: "center",
      transition: "transform 0.2s",
      "&:hover": { transform: "scale(1.05)" },
    }}
  >
    <Box sx={{ width: "4rem", height: "4rem", bgcolor: "#3B82F6", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", mb: 2 }}>
      {icon}
    </Box>
    <Typography sx={{ fontSize: "2rem", fontWeight: "bold" }}>{value}</Typography>
    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#A5B4FC" }}>
      {title}
    </Typography>
  </Paper>
);

const ChartCard = ({ title, chart }) => (
  <Paper
    elevation={3}
    sx={{
      padding: "1.5rem",
      borderRadius: "1rem",
      bgcolor: "#F8FAFC",
      textAlign: "center",
      transition: "transform 0.2s",
      "&:hover": { transform: "scale(1.05)" },
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1E293B", mb: "1rem" }}>
      {title}
    </Typography>
    <Box sx={{ width: "100%", height: "15rem" }}>{chart}</Box>
  </Paper>
);

export default Dashboard;
