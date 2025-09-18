import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const { get, loading, error } = useApi();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setFetchError(null);
        const response = await get('/admin/dashboard');
        console.log('Dashboard data received:', response);
        
        // Check if the response has the expected structure
        if (response && response.success && response.data) {
          setDashboardData(response.data);
        } else {
          console.error('Unexpected response format:', response);
          setFetchError('Invalid data format received from server');
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setFetchError(err.message || 'Failed to load dashboard data');
      }
    };

    fetchDashboardData();
  }, [get]);

  if (loading && !dashboardData) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if ((error || fetchError) && !dashboardData) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load dashboard data: {error || fetchError}
        </AlertDescription>
      </Alert>
    );
  }

  if (!dashboardData) {
    return <div className="p-4 text-center">No dashboard data available. Please check your connection and try again.</div>;
  }

  const { overview, recent_activity, breakdowns, trends } = dashboardData;

  // Prepare data for charts
  const registrationCategoryData = Object.entries(breakdowns.registration_by_category).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' '),
    value
  }));

  const paperCategoryData = Object.entries(breakdowns.papers_by_category).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' '),
    value
  }));

  const monthlyRegistrationData = trends.monthly_registrations.slice().reverse();

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of conference statistics and recent activity
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Registrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.total_registrations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {overview.pending_registrations} pending, {overview.confirmed_registrations} confirmed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Paper Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.total_papers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {overview.pending_papers} pending, {overview.accepted_papers} accepted
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Contact Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.total_messages}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {overview.unread_messages} unread messages
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${overview.total_revenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From confirmed registrations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity (Last 7 Days)</CardTitle>
          <CardDescription>
            Summary of recent registrations, submissions, and messages
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="flex flex-col space-y-1">
            <span className="text-muted-foreground text-sm">New Registrations</span>
            <span className="text-2xl font-bold">{recent_activity.recent_registrations}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-muted-foreground text-sm">New Paper Submissions</span>
            <span className="text-2xl font-bold">{recent_activity.recent_papers}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-muted-foreground text-sm">New Messages</span>
            <span className="text-2xl font-bold">{recent_activity.recent_messages}</span>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <Tabs defaultValue="registrations" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="registrations">Registrations</TabsTrigger>
          <TabsTrigger value="papers">Papers</TabsTrigger>
        </TabsList>
        <TabsContent value="registrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Registration Trend</CardTitle>
              <CardDescription>
                Number of registrations over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRegistrationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" name="Registrations" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Registration by Category</CardTitle>
              <CardDescription>
                Distribution of registrations across different categories
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={registrationCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {registrationCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="papers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Papers by Category</CardTitle>
              <CardDescription>
                Distribution of paper submissions across different categories
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paperCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {paperCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;