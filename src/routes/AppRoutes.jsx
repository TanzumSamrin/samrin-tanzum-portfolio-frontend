import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import ProtectedRoute from './ProtectedRoute'
import HomePage from '../pages/HomePage'
import ProjectsPage from '../pages/ProjectsPage'
import ProjectDetailPage from '../pages/ProjectDetailPage'
import BlogPage from '../pages/BlogPage'
import BlogDetailPage from '../pages/BlogDetailPage'
import ContactPage from '../pages/ContactPage'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import DashboardStats from '../components/dashboard/DashboardStats'
import PostList from '../components/dashboard/PostList'
import PostForm from '../components/dashboard/PostForm'
import ProjectList from '../components/dashboard/ProjectList'
import ProjectForm from '../components/dashboard/ProjectForm'
import SkillList from '../components/dashboard/SkillList'
import ExperienceList from '../components/dashboard/ExperienceList'
import CommentModeration from '../components/dashboard/CommentModeration'
import MessageInbox from '../components/dashboard/MessageInbox'
import ProfileEdit from '../components/dashboard/ProfileEdit'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:slug" element={<ProjectDetailPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:slug" element={<BlogDetailPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>
      
      <Route path="/login" element={<LoginPage />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardStats />} />
        <Route path="posts" element={<PostList />} />
        <Route path="posts/new" element={<PostForm />} />
        <Route path="posts/:slug/edit" element={<PostForm />} />
        <Route path="projects" element={<ProjectList />} />
        <Route path="projects/new" element={<ProjectForm />} />
        <Route path="projects/:slug/edit" element={<ProjectForm />} />
        <Route path="skills" element={<SkillList />} />
        <Route path="experience" element={<ExperienceList />} />
        <Route path="comments" element={<CommentModeration />} />
        <Route path="messages" element={<MessageInbox />} />
        <Route path="profile" element={<ProfileEdit />} />
      </Route>
      
      <Route path="404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

export default AppRoutes