import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/admin/StatsCard";
import { Users, ShoppingCart, DollarSign, TrendingUp, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const statsData = [
  {
    title: "Total Users",
    value: "12,458",
    change: "+12.5% from last month",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Total Orders",
    value: "3,247",
    change: "+8.2% from last month",
    changeType: "positive" as const,
    icon: ShoppingCart,
  },
  {
    title: "Revenue",
    value: "$89,432",
    change: "+23.1% from last month",
    changeType: "positive" as const,
    icon: DollarSign,
  },
  {
    title: "Active Sessions",
    value: "1,823",
    change: "-2.4% from last hour",
    changeType: "negative" as const,
    icon: Activity,
  },
];

const recentOrders = [
  { id: "ORD-001", customer: "John Doe", product: "Premium Plan", status: "completed", amount: "$99.00" },
  { id: "ORD-002", customer: "Jane Smith", product: "Basic Plan", status: "pending", amount: "$29.00" },
  { id: "ORD-003", customer: "Bob Johnson", product: "Pro Plan", status: "processing", amount: "$149.00" },
  { id: "ORD-004", customer: "Alice Brown", product: "Premium Plan", status: "completed", amount: "$99.00" },
  { id: "ORD-005", customer: "Charlie Wilson", product: "Basic Plan", status: "cancelled", amount: "$29.00" },
];

const recentUsers = [
  { id: "1", name: "Sarah Johnson", email: "sarah@example.com", role: "Customer", joinDate: "2024-01-15" },
  { id: "2", name: "Mike Davis", email: "mike@example.com", role: "Premium", joinDate: "2024-01-14" },
  { id: "3", name: "Emma Wilson", email: "emma@example.com", role: "Customer", joinDate: "2024-01-13" },
  { id: "4", name: "Alex Chen", email: "alex@example.com", role: "Pro", joinDate: "2024-01-12" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your business.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <TrendingUp className="mr-2 h-4 w-4" />
          View Analytics
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from your customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex flex-col">
                    <span className="font-medium">{order.customer}</span>
                    <span className="text-sm text-muted-foreground">{order.id} • {order.product}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        order.status === "completed" ? "default" :
                        order.status === "processing" ? "secondary" :
                        order.status === "pending" ? "outline" : "destructive"
                      }
                    >
                      {order.status}
                    </Badge>
                    <span className="font-medium">{order.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle>New Users</CardTitle>
            <CardDescription>Recently registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{user.role}</Badge>
                    <span className="text-sm text-muted-foreground">{user.joinDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}