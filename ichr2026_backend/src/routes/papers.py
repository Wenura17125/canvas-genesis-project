from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import uuid
import os
from src.models.user import db
from src.models.conference import PaperSubmission, PaperCategory, PaperStatus

papers_bp = Blueprint('papers', __name__)

# Allowed file extensions for paper uploads
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}
UPLOAD_FOLDER = 'uploads/papers'

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def ensure_upload_folder():
    """Ensure upload folder exists"""
    upload_path = os.path.join(current_app.root_path, UPLOAD_FOLDER)
    if not os.path.exists(upload_path):
        os.makedirs(upload_path)
    return upload_path

@papers_bp.route('/papers/submit', methods=['POST'])
def submit_paper():
    """Submit a new paper for review"""
    try:
        # Handle file upload
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Only PDF, DOC, and DOCX files are allowed'}), 400
        
        # Get form data
        title = request.form.get('title')
        abstract = request.form.get('abstract')
        keywords = request.form.get('keywords')
        category = request.form.get('category')
        authors = request.form.get('authors')
        email = request.form.get('email')
        affiliation = request.form.get('affiliation')
        phone = request.form.get('phone')
        
        # Validate required fields
        required_fields = {
            'title': title,
            'abstract': abstract,
            'keywords': keywords,
            'category': category,
            'authors': authors,
            'email': email,
            'affiliation': affiliation,
            'phone': phone
        }
        
        for field_name, field_value in required_fields.items():
            if not field_value:
                return jsonify({'error': f'Missing required field: {field_name}'}), 400
        
        # Validate category
        try:
            paper_category = PaperCategory(category)
        except ValueError:
            return jsonify({'error': 'Invalid paper category'}), 400
        
        # Generate unique submission ID
        submission_id = f"ICHR2026-SUB-{uuid.uuid4().hex[:8].upper()}"
        
        # Save file
        upload_path = ensure_upload_folder()
        filename = secure_filename(file.filename)
        # Add timestamp to filename to avoid conflicts
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{submission_id}_{timestamp}_{filename}"
        file_path = os.path.join(upload_path, filename)
        file.save(file_path)
        
        # Get file info
        file_size = os.path.getsize(file_path)
        file_type = filename.rsplit('.', 1)[1].lower()
        
        # Create paper submission record
        paper = PaperSubmission(
            submission_id=submission_id,
            title=title,
            abstract=abstract,
            keywords=keywords,
            category=paper_category,
            authors=authors,
            corresponding_author_email=email,
            affiliation=affiliation,
            phone=phone,
            file_name=filename,
            file_path=file_path,
            file_size=file_size,
            file_type=file_type,
            status=PaperStatus.SUBMITTED,
            review_deadline=datetime.utcnow() + timedelta(days=30)  # 30 days for review
        )
        
        db.session.add(paper)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Paper submitted successfully',
            'submission_id': submission_id,
            'data': paper.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Paper submission failed: {str(e)}'}), 500

@papers_bp.route('/papers/<submission_id>', methods=['GET'])
def get_paper(submission_id):
    """Get paper details by submission ID"""
    try:
        paper = PaperSubmission.query.filter_by(submission_id=submission_id).first()
        
        if not paper:
            return jsonify({'error': 'Paper submission not found'}), 404
        
        return jsonify({
            'success': True,
            'data': paper.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve paper: {str(e)}'}), 500

@papers_bp.route('/papers', methods=['GET'])
def get_all_papers():
    """Get all paper submissions (admin/reviewer endpoint)"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status')
        category = request.args.get('category')
        author_email = request.args.get('author_email')
        
        query = PaperSubmission.query
        
        # Apply filters
        if status:
            try:
                status_enum = PaperStatus(status)
                query = query.filter_by(status=status_enum)
            except ValueError:
                return jsonify({'error': 'Invalid status filter'}), 400
        
        if category:
            try:
                category_enum = PaperCategory(category)
                query = query.filter_by(category=category_enum)
            except ValueError:
                return jsonify({'error': 'Invalid category filter'}), 400
        
        if author_email:
            query = query.filter_by(corresponding_author_email=author_email)
        
        # Paginate results
        papers = query.order_by(PaperSubmission.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'success': True,
            'data': [paper.to_dict() for paper in papers.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': papers.total,
                'pages': papers.pages,
                'has_next': papers.has_next,
                'has_prev': papers.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve papers: {str(e)}'}), 500

@papers_bp.route('/papers/<submission_id>/review', methods=['PUT'])
def update_paper_review(submission_id):
    """Update paper review status and comments"""
    try:
        paper = PaperSubmission.query.filter_by(submission_id=submission_id).first()
        
        if not paper:
            return jsonify({'error': 'Paper submission not found'}), 404
        
        data = request.get_json()
        
        # Update review fields
        if 'status' in data:
            try:
                paper.status = PaperStatus(data['status'])
            except ValueError:
                return jsonify({'error': 'Invalid status value'}), 400
        
        if 'reviewer_comments' in data:
            paper.reviewer_comments = data['reviewer_comments']
        
        if 'review_score' in data:
            score = data['review_score']
            if not isinstance(score, (int, float)) or score < 0 or score > 10:
                return jsonify({'error': 'Review score must be a number between 0 and 10'}), 400
            paper.review_score = score
        
        paper.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Paper review updated successfully',
            'data': paper.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update paper review: {str(e)}'}), 500

@papers_bp.route('/papers/<submission_id>', methods=['DELETE'])
def delete_paper(submission_id):
    """Delete a paper submission (admin only)"""
    try:
        paper = PaperSubmission.query.filter_by(submission_id=submission_id).first()
        
        if not paper:
            return jsonify({'error': 'Paper submission not found'}), 404
        
        # Delete file if it exists
        if paper.file_path and os.path.exists(paper.file_path):
            os.remove(paper.file_path)
        
        db.session.delete(paper)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Paper submission deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete paper: {str(e)}'}), 500

@papers_bp.route('/papers/categories', methods=['GET'])
def get_paper_categories():
    """Get available paper categories"""
    categories = [
        {'id': cat.value, 'name': cat.value.replace('-', ' ').title()}
        for cat in PaperCategory
    ]
    
    return jsonify({
        'success': True,
        'data': categories
    }), 200

@papers_bp.route('/papers/stats', methods=['GET'])
def get_paper_stats():
    """Get paper submission statistics"""
    try:
        total_submissions = PaperSubmission.query.count()
        
        # Count by category
        category_stats = {}
        for category in PaperCategory:
            count = PaperSubmission.query.filter_by(category=category).count()
            category_stats[category.value] = count
        
        # Count by status
        status_stats = {}
        for status in PaperStatus:
            count = PaperSubmission.query.filter_by(status=status).count()
            status_stats[status.value] = count
        
        # Recent submissions (last 7 days)
        from datetime import timedelta
        week_ago = datetime.utcnow() - timedelta(days=7)
        recent_submissions = PaperSubmission.query.filter(
            PaperSubmission.created_at >= week_ago
        ).count()
        
        # Papers pending review
        pending_review = PaperSubmission.query.filter_by(
            status=PaperStatus.SUBMITTED
        ).count()
        
        # Average review score
        avg_score = db.session.query(db.func.avg(PaperSubmission.review_score)).filter(
            PaperSubmission.review_score.isnot(None)
        ).scalar()
        
        return jsonify({
            'success': True,
            'data': {
                'total_submissions': total_submissions,
                'category_breakdown': category_stats,
                'status_breakdown': status_stats,
                'recent_submissions': recent_submissions,
                'pending_review': pending_review,
                'average_review_score': round(avg_score, 2) if avg_score else None
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve statistics: {str(e)}'}), 500

@papers_bp.route('/papers/<submission_id>/download', methods=['GET'])
def download_paper(submission_id):
    """Download paper file (admin/reviewer endpoint)"""
    try:
        paper = PaperSubmission.query.filter_by(submission_id=submission_id).first()
        
        if not paper:
            return jsonify({'error': 'Paper submission not found'}), 404
        
        if not paper.file_path or not os.path.exists(paper.file_path):
            return jsonify({'error': 'Paper file not found'}), 404
        
        from flask import send_file
        return send_file(
            paper.file_path,
            as_attachment=True,
            download_name=f"{paper.submission_id}_{paper.file_name}"
        )
        
    except Exception as e:
        return jsonify({'error': f'Failed to download paper: {str(e)}'}), 500
