import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
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
import { AlertCircle, Search, Filter, Mail, MailOpen, CheckCircle, Clock } from 'lucide-react';

const MessagesPage = () => {
  const { get, put, loading, error } = useApi();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  });
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [responseForm, setResponseForm] = useState({
    response: '',
    status: '',
  });

  const fetchMessages = async () => {
    try {
      const { page, per_page } = pagination;
      const { status, search } = filters;
      
      const params = {
        page,
        per_page,
        ...(status && { status }),
        ...(search && { search }),
      };
      
      const response = await get('/admin/messages', params);
      setMessages(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [pagination.page, pagination.per_page, filters]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when filters change
  };

  const handleViewMessage = async (message) => {
    setSelectedMessage(message);
    setResponseForm({
      response: message.response || '',
      status: message.status,
    });
    setIsViewDialogOpen(true);
    
    // If message is new, mark it as read
    if (message.status === 'new') {
      try {
        const response = await put(`/admin/messages/${message.message_id}`, {
          status: 'read'
        });
        
        // Update the message in the local state
        setMessages((prev) =>
          prev.map((msg) =>
            msg.message_id === message.message_id
              ? { ...msg, status: 'read' }
              : msg
          )
        );
        
        // Update the selected message
        setSelectedMessage((prev) => ({ ...prev, status: 'read' }));
        setResponseForm((prev) => ({ ...prev, status: 'read' }));
      } catch (err) {
        console.error('Failed to mark message as read:', err);
      }
    }
  };

  const handleResponseFormChange = (field, value) => {
    setResponseForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSendResponse = async () => {
    try {
      // If no response is provided but status is changed to responded, show error
      if (responseForm.status === 'responded' && !responseForm.response.trim()) {
        alert('Please provide a response message');
        return;
      }
      
      const response = await put(`/admin/messages/${selectedMessage.message_id}`, {
        response: responseForm.response,
        status: responseForm.status,
      });
      
      // Update the message in the local state
      setMessages((prev) =>
        prev.map((msg) =>
          msg.message_id === selectedMessage.message_id
            ? { ...msg, ...response.data }
            : msg
        )
      );
      
      setIsViewDialogOpen(false);
    } catch (err) {
      console.error('Failed to update message:', err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new':
        return <Mail className="h-4 w-4" />;
      case 'read':
        return <MailOpen className="h-4 w-4" />;
      case 'responded':
        return <CheckCircle className="h-4 w-4" />;
      case 'closed':
        return <Clock className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'new':
        return 'default';
      case 'read':
        return 'secondary';
      case 'responded':
        return 'success';
      case 'closed':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contact Messages</h1>
        <p className="text-muted-foreground">
          Manage and respond to contact form messages
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Message List</CardTitle>
          <CardDescription>
            View and respond to contact messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email or subject..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="flex-1"
              />
            </div>
            <div>
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
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && !messages.length ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : messages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No messages found
                    </TableCell>
                  </TableRow>
                ) : (
                  messages.map((message) => (
                    <TableRow key={message.message_id} className={message.status === 'new' ? 'bg-muted/40' : ''}>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(message.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(message.status)}
                            <span className="capitalize">{message.status}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>{message.name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {message.email}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate" title={message.subject}>
                          {message.subject}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(message.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewMessage(message)}
                        >
                          {message.status === 'new' ? 'Read' : 'View'}
                        </Button>
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
                {pagination.total} messages
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

      {/* View/Respond to Message Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>
              View and respond to contact message
            </DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">{selectedMessage.subject}</h3>
                  <Badge variant={getStatusBadgeVariant(selectedMessage.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(selectedMessage.status)}
                      <span className="capitalize">{selectedMessage.status}</span>
                    </div>
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">From:</div>
                  <div className="text-sm">{selectedMessage.name} ({selectedMessage.email})</div>
                  <div className="text-sm text-muted-foreground">Date:</div>
                  <div className="text-sm">
                    {new Date(selectedMessage.created_at).toLocaleString()}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Message:</div>
                  <div className="border p-3 rounded-md bg-muted/30 text-sm whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Response</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="response">Your Response</Label>
                    <Textarea
                      id="response"
                      value={responseForm.response}
                      onChange={(e) => handleResponseFormChange('response', e.target.value)}
                      placeholder="Type your response here..."
                      rows={5}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={responseForm.status}
                      onValueChange={(value) => handleResponseFormChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="responded">Responded</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {selectedMessage.response && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-2">Previous Response</h3>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Responded by {selectedMessage.responded_by} on {' '}
                      {new Date(selectedMessage.responded_at).toLocaleString()}
                    </div>
                    <div className="border p-3 rounded-md bg-muted/30 text-sm whitespace-pre-wrap">
                      {selectedMessage.response}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendResponse} disabled={loading}>
              {loading ? 'Saving...' : 'Save Response'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessagesPage;