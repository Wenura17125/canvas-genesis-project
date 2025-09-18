from datetime import datetime
from enum import Enum
from src.models.user import db

class RegistrationCategory(Enum):
    PRESENTING = 'presenting'
    NON_PRESENTING = 'non-presenting'
    SPECTATOR = 'spectator'
    STUDENT = 'student'

class RegistrationStatus(Enum):
    PENDING = 'pending'
    CONFIRMED = 'confirmed'
    CANCELLED = 'cancelled'
    PAID = 'paid'

class PaperCategory(Enum):
    RESEARCH = 'research'
    REVIEW = 'review'
    CASE_STUDY = 'case-study'
    POSITION = 'position'

class PaperStatus(Enum):
    SUBMITTED = 'submitted'
    UNDER_REVIEW = 'under_review'
    ACCEPTED = 'accepted'
    REJECTED = 'rejected'
    REVISION_REQUIRED = 'revision_required'

class Registration(db.Model):
    __tablename__ = 'registrations'
    
    id = db.Column(db.Integer, primary_key=True)
    registration_id = db.Column(db.String(50), unique=True, nullable=False)
    
    # Personal Information
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    affiliation = db.Column(db.String(200), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    
    # Registration Details
    category = db.Column(db.Enum(RegistrationCategory), nullable=False)
    paper_title = db.Column(db.String(300), nullable=True)
    special_requirements = db.Column(db.Text, nullable=True)
    
    # Status and Timestamps
    status = db.Column(db.Enum(RegistrationStatus), default=RegistrationStatus.PENDING)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Payment Information
    payment_amount = db.Column(db.Float, nullable=True)
    payment_currency = db.Column(db.String(3), nullable=True)  # USD, LKR
    payment_status = db.Column(db.String(20), default='pending')
    payment_reference = db.Column(db.String(100), nullable=True)
    
    def __repr__(self):
        return f'<Registration {self.registration_id}: {self.full_name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'registration_id': self.registration_id,
            'full_name': self.full_name,
            'email': self.email,
            'phone': self.phone,
            'affiliation': self.affiliation,
            'country': self.country,
            'category': self.category.value if self.category else None,
            'paper_title': self.paper_title,
            'special_requirements': self.special_requirements,
            'status': self.status.value if self.status else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'payment_amount': self.payment_amount,
            'payment_currency': self.payment_currency,
            'payment_status': self.payment_status,
            'payment_reference': self.payment_reference
        }

class PaperSubmission(db.Model):
    __tablename__ = 'paper_submissions'
    
    id = db.Column(db.Integer, primary_key=True)
    submission_id = db.Column(db.String(50), unique=True, nullable=False)
    
    # Paper Information
    title = db.Column(db.String(300), nullable=False)
    abstract = db.Column(db.Text, nullable=False)
    keywords = db.Column(db.String(500), nullable=False)
    category = db.Column(db.Enum(PaperCategory), nullable=False)
    
    # Author Information
    authors = db.Column(db.String(500), nullable=False)
    corresponding_author_email = db.Column(db.String(120), nullable=False)
    affiliation = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    
    # File Information
    file_name = db.Column(db.String(255), nullable=True)
    file_path = db.Column(db.String(500), nullable=True)
    file_size = db.Column(db.Integer, nullable=True)
    file_type = db.Column(db.String(50), nullable=True)
    
    # Review Information
    status = db.Column(db.Enum(PaperStatus), default=PaperStatus.SUBMITTED)
    reviewer_comments = db.Column(db.Text, nullable=True)
    review_score = db.Column(db.Float, nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    review_deadline = db.Column(db.DateTime, nullable=True)
    
    def __repr__(self):
        return f'<PaperSubmission {self.submission_id}: {self.title[:50]}...>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'submission_id': self.submission_id,
            'title': self.title,
            'abstract': self.abstract,
            'keywords': self.keywords,
            'category': self.category.value if self.category else None,
            'authors': self.authors,
            'corresponding_author_email': self.corresponding_author_email,
            'affiliation': self.affiliation,
            'phone': self.phone,
            'file_name': self.file_name,
            'file_path': self.file_path,
            'file_size': self.file_size,
            'file_type': self.file_type,
            'status': self.status.value if self.status else None,
            'reviewer_comments': self.reviewer_comments,
            'review_score': self.review_score,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'review_deadline': self.review_deadline.isoformat() if self.review_deadline else None
        }

class ContactMessage(db.Model):
    __tablename__ = 'contact_messages'
    
    id = db.Column(db.Integer, primary_key=True)
    message_id = db.Column(db.String(50), unique=True, nullable=False)
    
    # Contact Information
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    
    # Status and Response
    status = db.Column(db.String(20), default='new')  # new, read, responded, closed
    response = db.Column(db.Text, nullable=True)
    responded_by = db.Column(db.String(100), nullable=True)
    responded_at = db.Column(db.DateTime, nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<ContactMessage {self.message_id}: {self.subject}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'message_id': self.message_id,
            'name': self.name,
            'email': self.email,
            'subject': self.subject,
            'message': self.message,
            'status': self.status,
            'response': self.response,
            'responded_by': self.responded_by,
            'responded_at': self.responded_at.isoformat() if self.responded_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class ConferenceSettings(db.Model):
    __tablename__ = 'conference_settings'
    
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(100), unique=True, nullable=False)
    value = db.Column(db.Text, nullable=False)
    description = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<ConferenceSetting {self.key}: {self.value[:50]}...>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'key': self.key,
            'value': self.value,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class AdminUser(db.Model):
    __tablename__ = 'admin_users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), default='admin')  # admin, reviewer, organizer
    is_active = db.Column(db.Boolean, default=True)
    last_login = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<AdminUser {self.username}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'is_active': self.is_active,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
