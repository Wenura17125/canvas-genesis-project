from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import uuid
from flask_jwt_extended import (
    create_access_token, create_refresh_token, 
    jwt_required, get_jwt_identity, get_jwt
)
from src.models.user import db
from src.models.conference import (
    AdminUser, Registration, PaperSubmission, ContactMessage, 
    ConferenceSettings, RegistrationStatus, PaperStatus
)

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin/login', methods=['POST'])
def admin_login():
    """Admin login endpoint"""
    try:
        data = request.get_json()
        
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400
        
        # Find admin user
        admin = AdminUser.query.filter_by(username=username, is_active=True).first()
        
        if not admin or not check_password_hash(admin.password_hash, password):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Update last login
        admin.last_login = datetime.utcnow()
        db.session.commit()
        
        # Generate JWT tokens
        access_token = create_access_token(
            identity=admin.id,
            additional_claims={
                'username': admin.username,
                'role': admin.role,
                'email': admin.email
            }
        )
        refresh_token = create_refresh_token(identity=admin.id)
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': {
                'id': admin.id,
                'username': admin.username,
                'email': admin.email,
                'role': admin.role
            },
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Login failed: {str(e)}'}), 500

@admin_bp.route('/admin/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    """Refresh JWT token"""
    try:
        current_user_id = get_jwt_identity()
        admin = AdminUser.query.get(current_user_id)
        
        if not admin or not admin.is_active:
            return jsonify({'error': 'User not found or inactive'}), 401
        
        access_token = create_access_token(
            identity=admin.id,
            additional_claims={
                'username': admin.username,
                'role': admin.role,
                'email': admin.email
            }
        )
        
        return jsonify({
            'success': True,
            'access_token': access_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Token refresh failed: {str(e)}'}), 500

@admin_bp.route('/admin/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    """Get comprehensive dashboard statistics"""
    try:
        # Registration statistics
        total_registrations = Registration.query.count()
        pending_registrations = Registration.query.filter_by(status=RegistrationStatus.PENDING).count()
        confirmed_registrations = Registration.query.filter_by(status=RegistrationStatus.CONFIRMED).count()
        
        # Paper submission statistics
        total_papers = PaperSubmission.query.count()
        pending_papers = PaperSubmission.query.filter_by(status=PaperStatus.SUBMITTED).count()
        accepted_papers = PaperSubmission.query.filter_by(status=PaperStatus.ACCEPTED).count()
        
        # Contact message statistics
        total_messages = ContactMessage.query.count()
        unread_messages = ContactMessage.query.filter_by(status='new').count()
        
        # Recent activity (last 7 days)
        week_ago = datetime.utcnow() - timedelta(days=7)
        recent_registrations = Registration.query.filter(Registration.created_at >= week_ago).count()
        recent_papers = PaperSubmission.query.filter(PaperSubmission.created_at >= week_ago).count()
        recent_messages = ContactMessage.query.filter(ContactMessage.created_at >= week_ago).count()
        
        # Revenue calculation (basic)
        total_revenue = db.session.query(db.func.sum(Registration.payment_amount)).filter(
            Registration.payment_status == 'paid'
        ).scalar() or 0
        
        # Registration by category
        from src.models.conference import RegistrationCategory
        registration_by_category = {}
        for category in RegistrationCategory:
            count = Registration.query.filter_by(category=category).count()
            registration_by_category[category.value] = count
        
        # Papers by category
        from src.models.conference import PaperCategory
        papers_by_category = {}
        for category in PaperCategory:
            count = PaperSubmission.query.filter_by(category=category).count()
            papers_by_category[category.value] = count
        
        # Monthly registration trend (last 6 months)
        monthly_registrations = []
        for i in range(6):
            month_start = datetime.utcnow().replace(day=1) - timedelta(days=30*i)
            month_end = month_start + timedelta(days=30)
            count = Registration.query.filter(
                Registration.created_at >= month_start,
                Registration.created_at < month_end
            ).count()
            monthly_registrations.append({
                'month': month_start.strftime('%Y-%m'),
                'count': count
            })
        
        return jsonify({
            'success': True,
            'data': {
                'overview': {
                    'total_registrations': total_registrations,
                    'pending_registrations': pending_registrations,
                    'confirmed_registrations': confirmed_registrations,
                    'total_papers': total_papers,
                    'pending_papers': pending_papers,
                    'accepted_papers': accepted_papers,
                    'total_messages': total_messages,
                    'unread_messages': unread_messages,
                    'total_revenue': total_revenue
                },
                'recent_activity': {
                    'recent_registrations': recent_registrations,
                    'recent_papers': recent_papers,
                    'recent_messages': recent_messages
                },
                'breakdowns': {
                    'registration_by_category': registration_by_category,
                    'papers_by_category': papers_by_category
                },
                'trends': {
                    'monthly_registrations': monthly_registrations
                }
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve dashboard data: {str(e)}'}), 500

@admin_bp.route('/admin/users', methods=['GET'])
@jwt_required()
def get_admin_users():
    """Get all admin users"""
    try:
        # Check if user has admin role
        claims = get_jwt()
        if claims.get('role') != 'admin':
            return jsonify({'error': 'Unauthorized access'}), 403
            
        users = AdminUser.query.all()
        users_list = [user.to_dict() for user in users]
        
        return jsonify({
            'success': True,
            'data': users_list
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve users: {str(e)}'}), 500

@admin_bp.route('/admin/users', methods=['POST'])
@jwt_required()
def create_admin_user():
    """Create a new admin user"""
    try:
        # Check if user has admin role
        claims = get_jwt()
        if claims.get('role') != 'admin':
            return jsonify({'error': 'Unauthorized access'}), 403
            
        data = request.get_json()
        
        required_fields = ['username', 'email', 'password', 'role']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Check if username or email already exists
        existing_user = AdminUser.query.filter(
            (AdminUser.username == data['username']) | 
            (AdminUser.email == data['email'])
        ).first()
        
        if existing_user:
            return jsonify({'error': 'Username or email already exists'}), 400
        
        # Validate role
        valid_roles = ['admin', 'reviewer', 'organizer']
        if data['role'] not in valid_roles:
            return jsonify({'error': f'Invalid role. Must be one of: {", ".join(valid_roles)}'}), 400
        
        # Create new admin user
        admin_user = AdminUser(
            username=data['username'],
            email=data['email'],
            password_hash=generate_password_hash(data['password']),
            role=data['role']
        )
        
        db.session.add(admin_user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Admin user created successfully',
            'data': admin_user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create admin user: {str(e)}'}), 500

@admin_bp.route('/admin/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_admin_user(user_id):
    """Update an admin user"""
    try:
        # Check if user has admin role
        claims = get_jwt()
        if claims.get('role') != 'admin':
            return jsonify({'error': 'Unauthorized access'}), 403
            
        data = request.get_json()
        user = AdminUser.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Update fields
        if 'username' in data:
            # Check if username already exists
            existing = AdminUser.query.filter(
                AdminUser.username == data['username'], 
                AdminUser.id != user_id
            ).first()
            if existing:
                return jsonify({'error': 'Username already exists'}), 400
            user.username = data['username']
            
        if 'email' in data:
            # Check if email already exists
            existing = AdminUser.query.filter(
                AdminUser.email == data['email'], 
                AdminUser.id != user_id
            ).first()
            if existing:
                return jsonify({'error': 'Email already exists'}), 400
            user.email = data['email']
            
        if 'password' in data and data['password']:
            user.password_hash = generate_password_hash(data['password'])
            
        if 'role' in data:
            valid_roles = ['admin', 'reviewer', 'organizer']
            if data['role'] not in valid_roles:
                return jsonify({'error': f'Invalid role. Must be one of: {", ".join(valid_roles)}'}), 400
            user.role = data['role']
            
        if 'is_active' in data:
            user.is_active = bool(data['is_active'])
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'User updated successfully',
            'data': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update user: {str(e)}'}), 500

@admin_bp.route('/admin/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_admin_user(user_id):
    """Delete an admin user"""
    try:
        # Check if user has admin role
        claims = get_jwt()
        if claims.get('role') != 'admin':
            return jsonify({'error': 'Unauthorized access'}), 403
            
        user = AdminUser.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Prevent deleting yourself
        current_user_id = get_jwt_identity()
        if user_id == current_user_id:
            return jsonify({'error': 'Cannot delete your own account'}), 400
        
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'User deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete user: {str(e)}'}), 500

@admin_bp.route('/admin/settings', methods=['GET'])
@jwt_required()
def get_conference_settings():
    """Get all conference settings"""
    try:
        settings = ConferenceSettings.query.all()
        settings_dict = {setting.key: setting.value for setting in settings}
        
        return jsonify({
            'success': True,
            'data': settings_dict
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve settings: {str(e)}'}), 500

@admin_bp.route('/admin/settings', methods=['POST'])
@jwt_required()
def update_conference_settings():
    """Update conference settings"""
    try:
        # Check if user has admin role
        claims = get_jwt()
        if claims.get('role') != 'admin':
            return jsonify({'error': 'Unauthorized access'}), 403
            
        data = request.get_json()
        
        for key, value in data.items():
            setting = ConferenceSettings.query.filter_by(key=key).first()
            
            if setting:
                setting.value = str(value)
                setting.updated_at = datetime.utcnow()
            else:
                setting = ConferenceSettings(
                    key=key,
                    value=str(value),
                    description=f'Setting for {key}'
                )
                db.session.add(setting)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Settings updated successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update settings: {str(e)}'}), 500

@admin_bp.route('/admin/registrations', methods=['GET'])
@jwt_required()
def get_registrations():
    """Get all registrations with pagination and filtering"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status')
        category = request.args.get('category')
        search = request.args.get('search')
        
        query = Registration.query
        
        # Apply filters
        if status:
            try:
                status_enum = RegistrationStatus(status)
                query = query.filter_by(status=status_enum)
            except ValueError:
                pass
                
        if category:
            try:
                from src.models.conference import RegistrationCategory
                category_enum = RegistrationCategory(category)
                query = query.filter_by(category=category_enum)
            except ValueError:
                pass
                
        if search:
            query = query.filter(
                (Registration.full_name.ilike(f'%{search}%')) |
                (Registration.email.ilike(f'%{search}%')) |
                (Registration.affiliation.ilike(f'%{search}%'))
            )
            
        # Pagination
        paginated = query.order_by(Registration.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        registrations = [reg.to_dict() for reg in paginated.items]
        
        return jsonify({
            'success': True,
            'data': registrations,
            'pagination': {
                'total': paginated.total,
                'pages': paginated.pages,
                'page': page,
                'per_page': per_page,
                'has_next': paginated.has_next,
                'has_prev': paginated.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve registrations: {str(e)}'}), 500

@admin_bp.route('/admin/registrations/<string:registration_id>', methods=['PUT'])
@jwt_required()
def update_registration(registration_id):
    """Update a registration"""
    try:
        data = request.get_json()
        registration = Registration.query.filter_by(registration_id=registration_id).first()
        
        if not registration:
            return jsonify({'error': 'Registration not found'}), 404
        
        # Update status if provided
        if 'status' in data:
            try:
                status = RegistrationStatus(data['status'])
                registration.status = status
            except ValueError:
                return jsonify({'error': f'Invalid status: {data["status"]}'}), 400
                
        # Update payment information if provided
        if 'payment_status' in data:
            registration.payment_status = data['payment_status']
            
        if 'payment_amount' in data:
            registration.payment_amount = float(data['payment_amount'])
            
        if 'payment_reference' in data:
            registration.payment_reference = data['payment_reference']
            
        # Update other fields if needed
        updateable_fields = [
            'full_name', 'email', 'phone', 'affiliation', 
            'country', 'special_requirements'
        ]
        
        for field in updateable_fields:
            if field in data:
                setattr(registration, field, data[field])
                
        registration.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Registration updated successfully',
            'data': registration.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update registration: {str(e)}'}), 500

@admin_bp.route('/admin/papers', methods=['GET'])
@jwt_required()
def get_papers():
    """Get all paper submissions with pagination and filtering"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status')
        category = request.args.get('category')
        search = request.args.get('search')
        
        query = PaperSubmission.query
        
        # Apply filters
        if status:
            try:
                status_enum = PaperStatus(status)
                query = query.filter_by(status=status_enum)
            except ValueError:
                pass
                
        if category:
            try:
                from src.models.conference import PaperCategory
                category_enum = PaperCategory(category)
                query = query.filter_by(category=category_enum)
            except ValueError:
                pass
                
        if search:
            query = query.filter(
                (PaperSubmission.title.ilike(f'%{search}%')) |
                (PaperSubmission.authors.ilike(f'%{search}%')) |
                (PaperSubmission.corresponding_author_email.ilike(f'%{search}%'))
            )
            
        # Pagination
        paginated = query.order_by(PaperSubmission.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        papers = [paper.to_dict() for paper in paginated.items]
        
        return jsonify({
            'success': True,
            'data': papers,
            'pagination': {
                'total': paginated.total,
                'pages': paginated.pages,
                'page': page,
                'per_page': per_page,
                'has_next': paginated.has_next,
                'has_prev': paginated.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve papers: {str(e)}'}), 500

@admin_bp.route('/admin/papers/<string:submission_id>', methods=['PUT'])
@jwt_required()
def update_paper(submission_id):
    """Update a paper submission"""
    try:
        data = request.get_json()
        paper = PaperSubmission.query.filter_by(submission_id=submission_id).first()
        
        if not paper:
            return jsonify({'error': 'Paper submission not found'}), 404
        
        # Update status if provided
        if 'status' in data:
            try:
                status = PaperStatus(data['status'])
                paper.status = status
            except ValueError:
                return jsonify({'error': f'Invalid status: {data["status"]}'}), 400
                
        # Update review information if provided
        if 'reviewer_comments' in data:
            paper.reviewer_comments = data['reviewer_comments']
            
        if 'review_score' in data:
            paper.review_score = float(data['review_score'])
            
        if 'review_deadline' in data and data['review_deadline']:
            paper.review_deadline = datetime.fromisoformat(data['review_deadline'])
            
        paper.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Paper submission updated successfully',
            'data': paper.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update paper submission: {str(e)}'}), 500

@admin_bp.route('/admin/messages', methods=['GET'])
@jwt_required()
def get_messages():
    """Get all contact messages with pagination and filtering"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status')
        search = request.args.get('search')
        
        query = ContactMessage.query
        
        # Apply filters
        if status:
            query = query.filter_by(status=status)
                
        if search:
            query = query.filter(
                (ContactMessage.name.ilike(f'%{search}%')) |
                (ContactMessage.email.ilike(f'%{search}%')) |
                (ContactMessage.subject.ilike(f'%{search}%'))
            )
            
        # Pagination
        paginated = query.order_by(ContactMessage.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        messages = [msg.to_dict() for msg in paginated.items]
        
        return jsonify({
            'success': True,
            'data': messages,
            'pagination': {
                'total': paginated.total,
                'pages': paginated.pages,
                'page': page,
                'per_page': per_page,
                'has_next': paginated.has_next,
                'has_prev': paginated.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve messages: {str(e)}'}), 500

@admin_bp.route('/admin/messages/<string:message_id>', methods=['PUT'])
@jwt_required()
def update_message(message_id):
    """Update a contact message"""
    try:
        data = request.get_json()
        message = ContactMessage.query.filter_by(message_id=message_id).first()
        
        if not message:
            return jsonify({'error': 'Message not found'}), 404
        
        # Update status if provided
        if 'status' in data:
            valid_statuses = ['new', 'read', 'responded', 'closed']
            if data['status'] not in valid_statuses:
                return jsonify({'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'}), 400
            message.status = data['status']
                
        # Update response if provided
        if 'response' in data:
            message.response = data['response']
            
            # If responding, update responded_by and responded_at
            if data['response'] and message.status == 'new':
                message.status = 'responded'
                
            claims = get_jwt()
            message.responded_by = claims.get('username')
            message.responded_at = datetime.utcnow()
            
        message.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Contact message updated successfully',
            'data': message.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update message: {str(e)}'}), 500

@admin_bp.route('/admin/export/registrations', methods=['GET'])
@jwt_required()
def export_registrations():
    """Export registrations data as CSV"""
    try:
        import csv
        import io
        
        registrations = Registration.query.all()
        
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow([
            'Registration ID', 'Full Name', 'Email', 'Phone', 'Affiliation', 
            'Country', 'Category', 'Paper Title', 'Status', 'Payment Status',
            'Payment Amount', 'Created At'
        ])
        
        # Write data
        for reg in registrations:
            writer.writerow([
                reg.registration_id,
                reg.full_name,
                reg.email,
                reg.phone,
                reg.affiliation,
                reg.country,
                reg.category.value if reg.category else '',
                reg.paper_title or '',
                reg.status.value if reg.status else '',
                reg.payment_status or '',
                reg.payment_amount or '',
                reg.created_at.strftime('%Y-%m-%d %H:%M:%S') if reg.created_at else ''
            ])
        
        output.seek(0)
        
        from flask import Response
        return Response(
            output.getvalue(),
            mimetype='text/csv',
            headers={'Content-Disposition': 'attachment; filename=registrations.csv'}
        )
        
    except Exception as e:
        return jsonify({'error': f'Failed to export registrations: {str(e)}'}), 500

@admin_bp.route('/admin/export/papers', methods=['GET'])
@jwt_required()
def export_papers():
    """Export paper submissions data as CSV"""
    try:
        import csv
        import io
        
        papers = PaperSubmission.query.all()
        
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow([
            'Submission ID', 'Title', 'Authors', 'Email', 'Affiliation',
            'Category', 'Status', 'Review Score', 'File Name', 'Created At'
        ])
        
        # Write data
        for paper in papers:
            writer.writerow([
                paper.submission_id,
                paper.title,
                paper.authors,
                paper.corresponding_author_email,
                paper.affiliation,
                paper.category.value if paper.category else '',
                paper.status.value if paper.status else '',
                paper.review_score or '',
                paper.file_name or '',
                paper.created_at.strftime('%Y-%m-%d %H:%M:%S') if paper.created_at else ''
            ])
        
        output.seek(0)
        
        from flask import Response
        return Response(
            output.getvalue(),
            mimetype='text/csv',
            headers={'Content-Disposition': 'attachment; filename=papers.csv'}
        )
        
    except Exception as e:
        return jsonify({'error': f'Failed to export papers: {str(e)}'}), 500

@admin_bp.route('/admin/bulk-email', methods=['POST'])
@jwt_required()
def send_bulk_email():
    """Send bulk email to registrants (placeholder)"""
    try:
        data = request.get_json()
        
        subject = data.get('subject')
        message = data.get('message')
        recipient_type = data.get('recipient_type', 'all')  # all, confirmed, pending
        
        if not subject or not message:
            return jsonify({'error': 'Subject and message are required'}), 400
        
        # Get recipients based on type
        query = Registration.query
        if recipient_type == 'confirmed':
            query = query.filter_by(status=RegistrationStatus.CONFIRMED)
        elif recipient_type == 'pending':
            query = query.filter_by(status=RegistrationStatus.PENDING)
        
        recipients = query.all()
        email_list = [reg.email for reg in recipients]
        
        # In a real application, you would integrate with an email service here
        # For now, we'll just return the count of emails that would be sent
        
        return jsonify({
            'success': True,
            'message': f'Bulk email queued for {len(email_list)} recipients',
            'recipient_count': len(email_list)
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to send bulk email: {str(e)}'}), 500

@admin_bp.route('/admin/reports/summary', methods=['GET'])
@jwt_required()
def get_summary_report():
    """Get comprehensive summary report"""
    try:
        # Date range for the report
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        if start_date:
            start_date = datetime.fromisoformat(start_date)
        else:
            start_date = datetime.utcnow() - timedelta(days=30)
        
        if end_date:
            end_date = datetime.fromisoformat(end_date)
        else:
            end_date = datetime.utcnow()
        
        # Registrations in date range
        registrations_query = Registration.query.filter(
            Registration.created_at >= start_date,
            Registration.created_at <= end_date
        )
        
        # Papers in date range
        papers_query = PaperSubmission.query.filter(
            PaperSubmission.created_at >= start_date,
            PaperSubmission.created_at <= end_date
        )
        
        # Messages in date range
        messages_query = ContactMessage.query.filter(
            ContactMessage.created_at >= start_date,
            ContactMessage.created_at <= end_date
        )
        
        report = {
            'period': {
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat()
            },
            'registrations': {
                'total': registrations_query.count(),
                'by_status': {},
                'by_category': {},
                'revenue': 0
            },
            'papers': {
                'total': papers_query.count(),
                'by_status': {},
                'by_category': {}
            },
            'messages': {
                'total': messages_query.count(),
                'by_status': {}
            }
        }
        
        # Registration breakdown
        for status in RegistrationStatus:
            count = registrations_query.filter_by(status=status).count()
            report['registrations']['by_status'][status.value] = count
        
        from src.models.conference import RegistrationCategory
        for category in RegistrationCategory:
            count = registrations_query.filter_by(category=category).count()
            report['registrations']['by_category'][category.value] = count
        
        # Calculate revenue
        revenue = db.session.query(db.func.sum(Registration.payment_amount)).filter(
            Registration.created_at >= start_date,
            Registration.created_at <= end_date,
            Registration.payment_status == 'paid'
        ).scalar() or 0
        report['registrations']['revenue'] = revenue
        
        # Paper breakdown
        for status in PaperStatus:
            count = papers_query.filter_by(status=status).count()
            report['papers']['by_status'][status.value] = count
        
        from src.models.conference import PaperCategory
        for category in PaperCategory:
            count = papers_query.filter_by(category=category).count()
            report['papers']['by_category'][category.value] = count
        
        # Message breakdown
        message_statuses = ['new', 'read', 'responded', 'closed']
        for status in message_statuses:
            count = messages_query.filter_by(status=status).count()
            report['messages']['by_status'][status] = count
        
        return jsonify({
            'success': True,
            'data': report
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to generate report: {str(e)}'}), 500