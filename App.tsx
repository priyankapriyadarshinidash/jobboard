import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import RoleSelection from "./pages/RoleSelection";
import CandidateJobs from "./pages/CandidateJobs";
import ApplyJob from "./pages/ApplyJob";
import UploadResume from "./pages/UploadResume";
import CandidateApplications from "./pages/CandidateApplications";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";
import JobApplications from "./pages/JobApplications";
import { useAuth } from "@/_core/hooks/useAuth";

function Router() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show home page
  if (!user) {
    return (
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // If user has no role, show role selection
  if (user.role === "user" || user.role === "admin") {
    return (
      <Switch>
        <Route path={"/"} component={RoleSelection} />
        <Route path={"/role-selection"} component={RoleSelection} />
        <Route path={"/404"} component={NotFound} />
        <Route component={RoleSelection} />
      </Switch>
    );
  }

  // Candidate routes
  if (user.role === "candidate") {
    return (
      <Switch>
        <Route path={"/"} component={CandidateJobs} />
        <Route path={"/jobs"} component={CandidateJobs} />
        <Route path={"/apply/:jobId"} component={ApplyJob} />
        <Route path={"/upload-resume"} component={UploadResume} />
        <Route path={"/applications"} component={CandidateApplications} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Recruiter routes
  if (user.role === "recruiter") {
    return (
      <Switch>
        <Route path={"/"} component={RecruiterDashboard} />
        <Route path={"/recruiter/dashboard"} component={RecruiterDashboard} />
        <Route path={"/recruiter/create-job"} component={CreateJob} />
        <Route path={"/recruiter/edit-job/:jobId"} component={EditJob} />
        <Route path={"/recruiter/job/:jobId"} component={JobApplications} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return <NotFound />;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
