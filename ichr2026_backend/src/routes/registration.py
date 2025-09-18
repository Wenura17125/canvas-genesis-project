from flask import Blueprint, request, jsonify
from datetime import datetime
import uuid
from src.models.user import db
from src.models.conference import Registration, RegistrationCategory, RegistrationStatus

registration_bp = Blueprint('registration', __name__)

# Registration fee structure
REGISTRATION_FEES = {
    'presenting': {'local': 5000, 'global': 65},
    'non-presenting': {'local': 4000, 'global': 60},
    'spectator': {'local': 3000, 'global': 50},
    'student': {'local': 0, 'global': 0}
}

@registration_bp.route('/registration', methods=['POST'])
def create_registration():
    """Create a new conference registration"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['fullName', 'email', 'phone', 'affiliation', 'country', 'category']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Validate category
        try:
            category = RegistrationCategory(data['category'])
        except ValueError:
            return jsonify({'error': 'Invalid registration category'}), 400
        
        # Generate unique registration ID
        registration_id = f"ICHR2026-REG-{uuid.uuid4().hex[:8].upper()}"
        
        # Calculate payment amount based on category
        fees = REGISTRATION_FEES.get(data['category'], {'local': 0, 'global': 0})
        
        # Create new registration
        registration = Registration(
            registration_id=registration_id,
            full_name=data['fullName'],
            email=data['email'],
            phone=data['phone'],
            affiliation=data['affiliation'],
            country=data['country'],
            category=category,
            paper_title=data.get('paperTitle', ''),
            special_requirements=data.get('specialRequirements', ''),
            status=RegistrationStatus.PENDING,
            payment_amount=fees['local'],  # Default to local currency
            payment_currency='LKR'
        )
        
        db.session.add(registration)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Registration submitted successfully',
            'registration_id': registration_id,
            'data': registration.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Registration failed: {str(e)}'}), 500

@registration_bp.route('/registration/<registration_id>', methods=['GET'])
def get_registration(registration_id):
    """Get registration details by ID"""
    try:
        registration = Registration.query.filter_by(registration_id=registration_id).first()
        
        if not registration:
            return jsonify({'error': 'Registration not found'}), 404
        
        return jsonify({
            'success': True,
            'data': registration.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve registration: {str(e)}'}), 500

@registration_bp.route('/registrations', methods=['GET'])
def get_all_registrations():
    """Get all registrations (admin endpoint)"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status')
        category = request.args.get('category')
        
        query = Registration.query
        
        # Apply filters
        if status:
            try:
                status_enum = RegistrationStatus(status)
                query = query.filter_by(status=status_enum)
            except ValueError:
                return jsonify({'error': 'Invalid status filter'}), 400
        
        if category:
            try:
                category_enum = RegistrationCategory(category)
                query = query.filter_by(category=category_enum)
            except ValueError:
                return jsonify({'error': 'Invalid category filter'}), 400
        
        # Paginate results
        registrations = query.order_by(Registration.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'success': True,
            'data': [reg.to_dict() for reg in registrations.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': registrations.total,
                'pages': registrations.pages,
                'has_next': registrations.has_next,
                'has_prev': registrations.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve registrations: {str(e)}'}), 500

@registration_bp.route('/registration/<registration_id>', methods=['PUT'])
def update_registration(registration_id):
    """Update registration status or details"""
    try:
        registration = Registration.query.filter_by(registration_id=registration_id).first()
        
        if not registration:
            return jsonify({'error': 'Registration not found'}), 404
        
        data = request.get_json()
        
        # Update allowed fields
        if 'status' in data:
            try:
                registration.status = RegistrationStatus(data['status'])
            except ValueError:
                return jsonify({'error': 'Invalid status value'}), 400
        
        if 'payment_status' in data:
            registration.payment_status = data['payment_status']
        
        if 'payment_reference' in data:
            registration.payment_reference = data['payment_reference']
        
        if 'special_requirements' in data:
            registration.special_requirements = data['special_requirements']
        
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

@registration_bp.route('/registration/<registration_id>', methods=['DELETE'])
def delete_registration(registration_id):
    """Delete a registration (admin only)"""
    try:
        registration = Registration.query.filter_by(registration_id=registration_id).first()
        
        if not registration:
            return jsonify({'error': 'Registration not found'}), 404
        
        db.session.delete(registration)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Registration deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete registration: {str(e)}'}), 500

@registration_bp.route('/registration/fees', methods=['GET'])
def get_registration_fees():
    """Get current registration fee structure"""
    return jsonify({
        'success': True,
        'data': REGISTRATION_FEES
    }), 200

@registration_bp.route('/registration/stats', methods=['GET'])
def get_registration_stats():
    """Get registration statistics"""
    try:
        total_registrations = Registration.query.count()
        
        # Count by category
        category_stats = {}
        for category in RegistrationCategory:
            count = Registration.query.filter_by(category=category).count()
            category_stats[category.value] = count
        
        # Count by status
        status_stats = {}
        for status in RegistrationStatus:
            count = Registration.query.filter_by(status=status).count()
            status_stats[status.value] = count
        
        # Recent registrations (last 7 days)
        from datetime import timedelta
        week_ago = datetime.utcnow() - timedelta(days=7)
        recent_registrations = Registration.query.filter(
            Registration.created_at >= week_ago
        ).count()
        
        return jsonify({
            'success': True,
            'data': {
                'total_registrations': total_registrations,
                'category_breakdown': category_stats,
                'status_breakdown': status_stats,
                'recent_registrations': recent_registrations
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve statistics: {str(e)}'}), 500
