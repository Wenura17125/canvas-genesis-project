from flask import Blueprint, request, jsonify
from datetime import datetime
import uuid
from src.models.user import db
from src.models.conference import ContactMessage

contact_bp = Blueprint('contact', __name__)

@contact_bp.route('/contact', methods=['POST'])
def create_contact_message():
    """Create a new contact message"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'subject', 'message']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Validate email format (basic validation)
        email = data['email']
        if '@' not in email or '.' not in email:
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Generate unique message ID
        message_id = f"ICHR2026-MSG-{uuid.uuid4().hex[:8].upper()}"
        
        # Create new contact message
        contact_message = ContactMessage(
            message_id=message_id,
            name=data['name'],
            email=email,
            subject=data['subject'],
            message=data['message'],
            status='new'
        )
        
        db.session.add(contact_message)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Your message has been sent successfully. We will respond within 24 hours.',
            'message_id': message_id,
            'data': contact_message.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to send message: {str(e)}'}), 500

@contact_bp.route('/contact/<message_id>', methods=['GET'])
def get_contact_message(message_id):
    """Get contact message details by ID"""
    try:
        message = ContactMessage.query.filter_by(message_id=message_id).first()
        
        if not message:
            return jsonify({'error': 'Message not found'}), 404
        
        return jsonify({
            'success': True,
            'data': message.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve message: {str(e)}'}), 500

@contact_bp.route('/contact/messages', methods=['GET'])
def get_all_contact_messages():
    """Get all contact messages (admin endpoint)"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status')
        subject_filter = request.args.get('subject')
        
        query = ContactMessage.query
        
        # Apply filters
        if status:
            query = query.filter_by(status=status)
        
        if subject_filter:
            # Filter by subject categories
            subject_keywords = {
                'paper-submission': ['paper', 'submission', 'submit'],
                'registration': ['registration', 'register', 'signup'],
                'accommodation': ['accommodation', 'hotel', 'stay'],
                'programme': ['programme', 'program', 'schedule'],
                'sponsorship': ['sponsor', 'partnership', 'support'],
                'general': ['general', 'inquiry', 'question']
            }
            
            if subject_filter in subject_keywords:
                keywords = subject_keywords[subject_filter]
                conditions = [ContactMessage.subject.contains(keyword) for keyword in keywords]
                query = query.filter(db.or_(*conditions))
        
        # Paginate results
        messages = query.order_by(ContactMessage.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'success': True,
            'data': [msg.to_dict() for msg in messages.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': messages.total,
                'pages': messages.pages,
                'has_next': messages.has_next,
                'has_prev': messages.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve messages: {str(e)}'}), 500

@contact_bp.route('/contact/<message_id>/respond', methods=['PUT'])
def respond_to_message(message_id):
    """Respond to a contact message (admin endpoint)"""
    try:
        message = ContactMessage.query.filter_by(message_id=message_id).first()
        
        if not message:
            return jsonify({'error': 'Message not found'}), 404
        
        data = request.get_json()
        
        if not data.get('response'):
            return jsonify({'error': 'Response text is required'}), 400
        
        if not data.get('responded_by'):
            return jsonify({'error': 'Responder name is required'}), 400
        
        # Update message with response
        message.response = data['response']
        message.responded_by = data['responded_by']
        message.responded_at = datetime.utcnow()
        message.status = 'responded'
        message.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Response added successfully',
            'data': message.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to add response: {str(e)}'}), 500

@contact_bp.route('/contact/<message_id>/status', methods=['PUT'])
def update_message_status(message_id):
    """Update contact message status"""
    try:
        message = ContactMessage.query.filter_by(message_id=message_id).first()
        
        if not message:
            return jsonify({'error': 'Message not found'}), 404
        
        data = request.get_json()
        
        if not data.get('status'):
            return jsonify({'error': 'Status is required'}), 400
        
        # Validate status
        valid_statuses = ['new', 'read', 'responded', 'closed']
        if data['status'] not in valid_statuses:
            return jsonify({'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'}), 400
        
        message.status = data['status']
        message.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Message status updated successfully',
            'data': message.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update status: {str(e)}'}), 500

@contact_bp.route('/contact/<message_id>', methods=['DELETE'])
def delete_contact_message(message_id):
    """Delete a contact message (admin only)"""
    try:
        message = ContactMessage.query.filter_by(message_id=message_id).first()
        
        if not message:
            return jsonify({'error': 'Message not found'}), 404
        
        db.session.delete(message)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Contact message deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete message: {str(e)}'}), 500

@contact_bp.route('/contact/stats', methods=['GET'])
def get_contact_stats():
    """Get contact message statistics"""
    try:
        total_messages = ContactMessage.query.count()
        
        # Count by status
        status_stats = {}
        valid_statuses = ['new', 'read', 'responded', 'closed']
        for status in valid_statuses:
            count = ContactMessage.query.filter_by(status=status).count()
            status_stats[status] = count
        
        # Recent messages (last 7 days)
        from datetime import timedelta
        week_ago = datetime.utcnow() - timedelta(days=7)
        recent_messages = ContactMessage.query.filter(
            ContactMessage.created_at >= week_ago
        ).count()
        
        # Unread messages
        unread_messages = ContactMessage.query.filter_by(status='new').count()
        
        # Response rate
        responded_messages = ContactMessage.query.filter_by(status='responded').count()
        response_rate = (responded_messages / total_messages * 100) if total_messages > 0 else 0
        
        # Subject breakdown
        subject_stats = {}
        subject_keywords = {
            'paper-submission': ['paper', 'submission', 'submit'],
            'registration': ['registration', 'register', 'signup'],
            'accommodation': ['accommodation', 'hotel', 'stay'],
            'programme': ['programme', 'program', 'schedule'],
            'sponsorship': ['sponsor', 'partnership', 'support'],
            'general': ['general', 'inquiry', 'question']
        }
        
        for category, keywords in subject_keywords.items():
            conditions = [ContactMessage.subject.contains(keyword) for keyword in keywords]
            count = ContactMessage.query.filter(db.or_(*conditions)).count()
            subject_stats[category] = count
        
        return jsonify({
            'success': True,
            'data': {
                'total_messages': total_messages,
                'status_breakdown': status_stats,
                'recent_messages': recent_messages,
                'unread_messages': unread_messages,
                'response_rate': round(response_rate, 2),
                'subject_breakdown': subject_stats
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve statistics: {str(e)}'}), 500

@contact_bp.route('/contact/subjects', methods=['GET'])
def get_contact_subjects():
    """Get available contact subjects for the form"""
    subjects = [
        {'value': 'paper-submission', 'label': 'Paper Submission'},
        {'value': 'registration', 'label': 'Registration'},
        {'value': 'accommodation', 'label': 'Accommodation'},
        {'value': 'programme', 'label': 'Programme'},
        {'value': 'sponsorship', 'label': 'Sponsorship'},
        {'value': 'general', 'label': 'General Inquiry'}
    ]
    
    return jsonify({
        'success': True,
        'data': subjects
    }), 200
