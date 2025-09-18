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
import { AlertCircle, Search, Download, Eye, Filter, FileText } from 'lucide-react';

const PapersPage = () => {
  const { get, put, loading, error } = useApi();
  const [papers, setPapers] = useState([]);
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
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    status: '',
    reviewer_comments: '',
    review_score: '',
  });

  const fetchPapers = async () => {
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
      
      const response = await get('/admin/papers', params);
      setPapers(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Failed to fetch papers:', err);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, [pagination.page, pagination.per_page, filters]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when filters change
  };

  const handleViewPaper = (paper) => {
    setSelectedPaper(paper);
    setIsViewDialogOpen(true);
  };

  const handleReviewPaper = (paper) => {
    setSelectedPaper(paper);
    setReviewForm({
      status: paper.status,
      reviewer_comments: paper.reviewer_comments || '',
      review_score: paper.review_score?.toString() || '',
    });
    setIsReviewDialogOpen(true);
  };

  const handleReviewFormChange = (field, value) => {
    setReviewForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveReview = async () => {
    try {
      const response = await put(`/admin/papers/${selectedPaper.submission_id}`, reviewForm);
      
      // Update the paper in the local state
      setPapers((prev) =>
        prev.map((p) =>
          p.submission_id === selectedPaper.submission_id
            ? { ...p, ...response.data }
            : p
        )
      );
      
      setIsReviewDialogOpen(false);
    } catch (err) {
      console.error('Failed to update paper review:', err);
    }
  };

  const handleExportCSV = async () => {
    try {
      // Create a link to download the CSV
      const link = document.createElement('a');
      link.href = `http://localhost:5002/api/admin/export/papers`;
      link.setAttribute('download', 'papers.csv');
      
      // Add the JWT token as a query parameter
      const token = localStorage.getItem('accessToken');
      if (token) {
        link.href += `?token=${token}`;
      }
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to export papers:', err);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'submitted':
        return 'secondary';
      case 'under_review':
        return 'warning';
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'destructive';
      case 'revision_required':
        return 'default';
      default:
        return 'outline';
    }
  };

  const formatStatusLabel = (status) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paper Submissions</h1>
          <p className="text-muted-foreground">
            Manage and review conference paper submissions
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
          <CardTitle>Paper Submissions</CardTitle>
          <CardDescription>
            View and review all submitted papers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, authors or email..."
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
                    <span>{filters.status ? formatStatusLabel(filters.status) : 'Filter by status'}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="revision_required">Revision Required</SelectItem>
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
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="case-study">Case Study</SelectItem>
                  <SelectItem value="position">Position</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submission ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Authors</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && !papers.length ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : papers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No paper submissions found
                    </TableCell>
                  </TableRow>
                ) : (
                  papers.map((paper) => (
                    <TableRow key={paper.submission_id}>
                      <TableCell className="font-medium">
                        {paper.submission_id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate" title={paper.title}>
                          {paper.title}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="max-w-[200px] truncate" title={paper.authors}>
                          {paper.authors}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {paper.category}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(paper.status)}>
                          {formatStatusLabel(paper.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {paper.review_score ? paper.review_score : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewPaper(paper)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReviewPaper(paper)}
                          >
                            Review
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
                {pagination.total} papers
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

      {/* View Paper Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Paper Submission Details</DialogTitle>
            <DialogDescription>
              View complete paper submission information
            </DialogDescription>
          </DialogHeader>
          {selectedPaper && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Paper Information</h3>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  <div className="text-sm text-muted-foreground">Title:</div>
                  <div className="text-sm font-medium">{selectedPaper.title}</div>
                  
                  <div className="text-sm text-muted-foreground mt-2">Abstract:</div>
                  <div className="text-sm border p-3 rounded-md bg-muted/30">
                    {selectedPaper.abstract}
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-2">Keywords:</div>
                  <div className="text-sm">
                    {selectedPaper.keywords.split(',').map((keyword, index) => (
                      <Badge key={index} variant="outline" className="mr-1 mb-1">
                        {keyword.trim()}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-2">Category:</div>
                  <div className="text-sm">{selectedPaper.category}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium">Author Information</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-sm text-muted-foreground">Authors:</div>
                    <div className="text-sm">{selectedPaper.authors}</div>
                    <div className="text-sm text-muted-foreground">Corresponding Email:</div>
                    <div className="text-sm">{selectedPaper.corresponding_author_email}</div>
                    <div className="text-sm text-muted-foreground">Affiliation:</div>
                    <div className="text-sm">{selectedPaper.affiliation}</div>
                    <div className="text-sm text-muted-foreground">Phone:</div>
                    <div className="text-sm">{selectedPaper.phone}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Submission Details</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-sm text-muted-foreground">Submission ID:</div>
                    <div className="text-sm">{selectedPaper.submission_id}</div>
                    <div className="text-sm text-muted-foreground">Status:</div>
                    <div className="text-sm">
                      <Badge variant={getStatusBadgeVariant(selectedPaper.status)}>
                        {formatStatusLabel(selectedPaper.status)}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">File:</div>
                    <div className="text-sm">
                      {selectedPaper.file_name ? (
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {selectedPaper.file_name}
                        </div>
                      ) : (
                        'No file attached'
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">Submitted On:</div>
                    <div className="text-sm">
                      {new Date(selectedPaper.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Review Information</h3>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  <div className="text-sm text-muted-foreground">Review Score:</div>
                  <div className="text-sm">
                    {selectedPaper.review_score ? selectedPaper.review_score : 'Not reviewed yet'}
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-2">Reviewer Comments:</div>
                  <div className="text-sm border p-3 rounded-md bg-muted/30">
                    {selectedPaper.reviewer_comments || 'No comments yet'}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsViewDialogOpen(false);
              handleReviewPaper(selectedPaper);
            }}>
              Review Paper
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Paper Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Paper</DialogTitle>
            <DialogDescription>
              Update paper status and provide review feedback
            </DialogDescription>
          </DialogHeader>
          {selectedPaper && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Paper Title</h3>
                <p className="text-sm font-medium">{selectedPaper.title}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Review Status</Label>
                <Select
                  value={reviewForm.status}
                  onValueChange={(value) => handleReviewFormChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="revision_required">Revision Required</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="review_score">Review Score (0-10)</Label>
                <Input
                  id="review_score"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={reviewForm.review_score}
                  onChange={(e) => handleReviewFormChange('review_score', e.target.value)}
                  placeholder="Enter review score"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reviewer_comments">Review Comments</Label>
                <Textarea
                  id="reviewer_comments"
                  value={reviewForm.reviewer_comments}
                  onChange={(e) => handleReviewFormChange('reviewer_comments', e.target.value)}
                  placeholder="Enter your review comments"
                  rows={5}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveReview} disabled={loading}>
              {loading ? 'Saving...' : 'Save Review'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PapersPage;