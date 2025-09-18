import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AlertCircle, Search, Download, Eye, Filter } from 'lucide-react';

const RegistrationsPage = () => {
  const { get, put, loading, error } = useApi();
  const [registrations, setRegistrations] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: '',
  });
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    status: '',
    payment_status: '',
    payment_amount: '',
    payment_reference: '',
  });

  const fetchRegistrations = async () => {
    try {
      const { page, per_page } = pagination;
      const { status, category, search } = filters;
      
      const params = {
        page,
        per_page,
        ...(status && { status }),
        ...(category && { category }),
        ...(search && { search }),
      };
      
      const response = await get('/admin/registrations', params);
      setRegistrations(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Failed to fetch registrations:', err);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [pagination.page, pagination.per_page, filters]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when filters change
  };

  const handleViewRegistration = (registration) => {
    setSelectedRegistration(registration);
    setIsViewDialogOpen(true);
  };

  const handleEditRegistration = (registration) => {
    setSelectedRegistration(registration);
    setEditForm({
      status: registration.status,
      payment_status: registration.payment_status || '',
      payment_amount: registration.payment_amount?.toString() || '',
      payment_reference: registration.payment_reference || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleEditFormChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      const response = await put(`/admin/registrations/${selectedRegistration.registration_id}`, editForm);
      
      // Update the registration in the local state
      setRegistrations((prev) =>
        prev.map((reg) =>
          reg.registration_id === selectedRegistration.registration_id
            ? { ...reg, ...response.data }
            : reg
        )
      );
      
      setIsEditDialogOpen(false);
    } catch (err) {
      console.error('Failed to update registration:', err);
    }
  };

  const handleExportCSV = async () => {
    try {
      // Create a link to download the CSV
      const link = document.createElement('a');
      link.href = `http://localhost:5002/api/admin/export/registrations`;
      link.setAttribute('download', 'registrations.csv');
      
      // Add the JWT token as a query parameter
      const token = localStorage.getItem('accessToken');
      if (token) {
        link.href += `?token=${token}`;
      }
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to export registrations:', err);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'destructive';
      case 'paid':
        return 'default';
      default:
        return 'outline';
    }
  };

  const getPaymentStatusBadgeVariant = (status) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Registrations</h1>
          <p className="text-muted-foreground">
            Manage conference registrations and payments
          </p>
        </div>
        <Button onClick={handleExportCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Registration List</CardTitle>
          <CardDescription>
            View and manage all conference registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email or affiliation..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>{filters.status || 'Filter by status'}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>{filters.category || 'Filter by category'}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  <SelectItem value="presenting">Presenting</SelectItem>
                  <SelectItem value="non-presenting">Non-Presenting</SelectItem>
                  <SelectItem value="spectator">Spectator</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Registration ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && !registrations.length ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : registrations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No registrations found
                    </TableCell>
                  </TableRow>
                ) : (
                  registrations.map((registration) => (
                    <TableRow key={registration.registration_id}>
                      <TableCell className="font-medium">
                        {registration.registration_id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>{registration.full_name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {registration.email}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {registration.category}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(registration.status)}>
                          {registration.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {registration.payment_status ? (
                          <Badge variant={getPaymentStatusBadgeVariant(registration.payment_status)}>
                            {registration.payment_status}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Not set</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewRegistration(registration)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditRegistration(registration)}
                          >
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.per_page + 1} to{' '}
                {Math.min(pagination.page * pagination.per_page, pagination.total)} of{' '}
                {pagination.total} registrations
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === pagination.pages ||
                      Math.abs(page - pagination.page) <= 1
                  )
                  .map((page, i, array) => (
                    <React.Fragment key={page}>
                      {i > 0 && array[i - 1] !== page - 1 && (
                        <Button variant="outline" size="sm" disabled>
                          ...
                        </Button>
                      )}
                      <Button
                        variant={pagination.page === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    </React.Fragment>
                  ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Registration Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registration Details</DialogTitle>
            <DialogDescription>
              View complete registration information
            </DialogDescription>
          </DialogHeader>
          {selectedRegistration && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-sm text-muted-foreground">Full Name:</div>
                    <div className="text-sm">{selectedRegistration.full_name}</div>
                    <div className="text-sm text-muted-foreground">Email:</div>
                    <div className="text-sm">{selectedRegistration.email}</div>
                    <div className="text-sm text-muted-foreground">Phone:</div>
                    <div className="text-sm">{selectedRegistration.phone}</div>
                    <div className="text-sm text-muted-foreground">Affiliation:</div>
                    <div className="text-sm">{selectedRegistration.affiliation}</div>
                    <div className="text-sm text-muted-foreground">Country:</div>
                    <div className="text-sm">{selectedRegistration.country}</div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Registration Details</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-sm text-muted-foreground">Registration ID:</div>
                    <div className="text-sm">{selectedRegistration.registration_id}</div>
                    <div className="text-sm text-muted-foreground">Category:</div>
                    <div className="text-sm">{selectedRegistration.category}</div>
                    <div className="text-sm text-muted-foreground">Status:</div>
                    <div className="text-sm">
                      <Badge variant={getStatusBadgeVariant(selectedRegistration.status)}>
                        {selectedRegistration.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">Created At:</div>
                    <div className="text-sm">
                      {new Date(selectedRegistration.created_at).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Updated At:</div>
                    <div className="text-sm">
                      {new Date(selectedRegistration.updated_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Payment Information</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-sm text-muted-foreground">Payment Status:</div>
                    <div className="text-sm">
                      {selectedRegistration.payment_status ? (
                        <Badge variant={getPaymentStatusBadgeVariant(selectedRegistration.payment_status)}>
                          {selectedRegistration.payment_status}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Not set</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">Payment Amount:</div>
                    <div className="text-sm">
                      {selectedRegistration.payment_amount
                        ? `$${selectedRegistration.payment_amount.toFixed(2)}`
                        : 'Not set'}
                    </div>
                    <div className="text-sm text-muted-foreground">Payment Reference:</div>
                    <div className="text-sm">
                      {selectedRegistration.payment_reference || 'Not set'}
                    </div>
                  </div>
                </div>
                {selectedRegistration.paper_title && (
                  <div>
                    <h3 className="text-lg font-medium">Paper Information</h3>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="text-sm text-muted-foreground">Paper Title:</div>
                      <div className="text-sm">{selectedRegistration.paper_title}</div>
                    </div>
                  </div>
                )}
                {selectedRegistration.special_requirements && (
                  <div>
                    <h3 className="text-lg font-medium">Special Requirements</h3>
                    <div className="mt-2">
                      <div className="text-sm">{selectedRegistration.special_requirements}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsViewDialogOpen(false);
              handleEditRegistration(selectedRegistration);
            }}>
              Edit Registration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Registration Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Registration</DialogTitle>
            <DialogDescription>
              Update registration status and payment information
            </DialogDescription>
          </DialogHeader>
          {selectedRegistration && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Registration Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(value) => handleEditFormChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_status">Payment Status</Label>
                <Select
                  value={editForm.payment_status}
                  onValueChange={(value) => handleEditFormChange('payment_status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Not set</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_amount">Payment Amount</Label>
                <Input
                  id="payment_amount"
                  type="number"
                  step="0.01"
                  value={editForm.payment_amount}
                  onChange={(e) => handleEditFormChange('payment_amount', e.target.value)}
                  placeholder="Enter payment amount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_reference">Payment Reference</Label>
                <Input
                  id="payment_reference"
                  value={editForm.payment_reference}
                  onChange={(e) => handleEditFormChange('payment_reference', e.target.value)}
                  placeholder="Enter payment reference"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegistrationsPage;