class Course(Document):
    # ... other fields ...
    students = ListField(ReferenceField('User', reverse_delete_rule=PULL))
    
    def to_json(self):
        base_json = {
            '_id': str(self.id),
            'courseName': self.courseName,
            'department': self.department,
            'courseNumber': self.courseNumber,
            'term': self.term,
            'year': self.year,
            'teacher': {
                'id': str(self.teacher.id),
                'firstName': self.teacher.firstName,
                'lastName': self.teacher.lastName
            } if self.teacher else None,
            'students': [{
                'id': str(student.id),
                'firstName': student.firstName,
                'lastName': student.lastName
            } for student in self.students] if self.students else [],
            # ... other fields ...
        }
        
        # Add teacher-specific fields
        if hasattr(self, 'materials'):
            base_json['materials'] = [{
                '_id': str(material.id),
                'title': material.title,
                'description': material.description,
                'fileUrl': material.fileUrl,
                'uploadDate': material.uploadDate.isoformat() if material.uploadDate else None
            } for material in self.materials]
        
        # Add student-specific fields
        if hasattr(self, 'progress'):
            base_json['progress'] = self.progress
        
        return base_json 