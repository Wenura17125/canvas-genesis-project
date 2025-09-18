#!/usr/bin/env python3
"""
Database initialization script for ICHR2026 Conference Website
This script creates all the necessary database tables and adds initial data.
"""

import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from src.models.user import db
from src.models.conference import (
    Registration, PaperSubmission, ContactMessage, 
    ConferenceSettings, AdminUser
)
from src.main import app
from werkzeug.security import generate_password_hash
from datetime import datetime

def init_database():
    """Initialize the database with all tables and initial data"""
    
    with app.app_context():
        print("Creating database tables...")
        
        # Drop all tables first (for clean initialization)
        db.drop_all()
        
        # Create all tables
        db.create_all()
        
        print("Database tables created successfully!")
        
        # Add initial admin user
        admin_user = AdminUser(
            username='admin',
            email='admin@ichr2026.com',
            password_hash=generate_password_hash('admin123'),
            role='admin'
        )
        db.session.add(admin_user)
        
        # Add initial conference settings
        settings = [
            {
                'key': 'conference_name',
                'value': 'International Conference on Harmony Research 2026',
                'description': 'Official conference name'
            },
            {
                'key': 'conference_dates',
                'value': 'January 28-29, 2026',
                'description': 'Conference dates'
            },
            {
                'key': 'venue',
                'value': 'University of Vavuniya, Sri Lanka',
                'description': 'Conference venue'
            },
            {
                'key': 'registration_deadline',
                'value': '2025-11-28',
                'description': 'Registration deadline'
            },
            {
                'key': 'paper_submission_deadline',
                'value': '2025-11-15',
                'description': 'Paper submission deadline'
            },
            {
                'key': 'review_notification_date',
                'value': '2025-12-20',
                'description': 'Review results notification date'
            },
            {
                'key': 'camera_ready_deadline',
                'value': '2026-01-10',
                'description': 'Camera-ready submission deadline'
            },
            {
                'key': 'contact_email',
                'value': 'ichr2026@vau.ac.lk',
                'description': 'Main contact email'
            },
            {
                'key': 'website_url',
                'value': 'www.vau.ac.lk/ichr2026/',
                'description': 'Official website URL'
            },
            {
                'key': 'max_file_size_mb',
                'value': '10',
                'description': 'Maximum file size for paper uploads in MB'
            }
        ]
        
        for setting_data in settings:
            setting = ConferenceSettings(
                key=setting_data['key'],
                value=setting_data['value'],
                description=setting_data['description']
            )
            db.session.add(setting)
        
        # Commit all changes
        db.session.commit()
        
        print("Initial data added successfully!")
        print("\nDatabase initialization complete!")
        print("\nDefault admin credentials:")
        print("Username: admin")
        print("Password: admin123")
        print("\nPlease change the default password after first login.")

if __name__ == '__main__':
    init_database()
