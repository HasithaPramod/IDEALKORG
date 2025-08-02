import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navigation from "./components/Navigation";
import Breadcrumbs from "./components/Breadcrumbs";
import PageWrapper from "./components/PageWrapper";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import News from "./pages/News";
import Downloads from "./pages/Downloads";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Unauthorized from "./pages/Unauthorized";
import ProjectForm from "./pages/ProjectForm";
import NewsForm from "./pages/NewsForm";
import ProjectDetail from "./pages/ProjectDetail";
import NewsArticle from "./pages/NewsArticle";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background flex flex-col">
              <Navigation />
              <Breadcrumbs />
              <main className="flex-1">
                <PageWrapper>
                  <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:slug" element={<ProjectDetail />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/news/:slug" element={<NewsArticle />} />
                  <Route path="/downloads" element={<Downloads />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <Admin />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/projects/new" 
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <ProjectForm />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/projects/edit/:id" 
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <ProjectForm />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/news/new" 
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <NewsForm />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/news/edit/:id" 
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <NewsForm />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                </PageWrapper>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
