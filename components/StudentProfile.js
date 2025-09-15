import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  User, 
  Plus, 
  Edit, 
  Trash2, 
  Award, 
  Star, 
  Clock, 
  Target,
  BookOpen,
  TrendingUp,
  Calendar,
  School,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { database } from '../database/database';

const ProfileContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing['2xl']};
  color: white;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: ${props => props.theme.spacing.lg};
  background: linear-gradient(45deg, #ffffff, #f0f9ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.xl};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.lg};
  backdrop-filter: blur(10px);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const CardTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.variant === 'primary' 
    ? props.theme.gradients.primary 
    : props.theme.colors.background};
  color: ${props => props.variant === 'primary' ? 'white' : props.theme.colors.text};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const StudentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const StudentItem = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.isActive ? props.theme.colors.background : 'transparent'};
  border: 2px solid ${props => props.isActive ? props.theme.colors.primary : 'transparent'};
  border-radius: ${props => props.theme.borderRadius.lg};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.background};
    border-color: ${props => props.theme.colors.border};
  }
`;

const StudentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const StudentAvatar = styled.div`
  width: 50px;
  height: 50px;
  background: ${props => props.theme.gradients.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
`;

const StudentDetails = styled.div`
  flex: 1;
`;

const StudentName = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const StudentMeta = styled.p`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const StudentActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const IconButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: ${props => props.variant === 'danger' 
    ? props.theme.colors.error 
    : props.theme.colors.background};
  color: ${props => props.variant === 'danger' ? 'white' : props.theme.colors.textSecondary};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.variant === 'danger' 
      ? '#dc2626' 
      : props.theme.colors.border};
    transform: scale(1.1);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const StatCard = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.lg};
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${props => props.theme.gradients.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing.sm};
  color: white;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const AchievementsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const AchievementItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.unlocked ? props.theme.colors.background : '#f9fafb'};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.unlocked ? props.theme.colors.primary : props.theme.colors.border};
`;

const AchievementIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${props => props.unlocked 
    ? props.theme.gradients.primary 
    : props.theme.colors.background};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.unlocked ? 'white' : props.theme.colors.textSecondary};
`;

const AchievementInfo = styled.div`
  flex: 1;
`;

const AchievementName = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const AchievementDescription = styled.p`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const AchievementPoints = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Select = styled.select`
  padding: ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const StudentProfile = () => {
  const { t } = useTranslation();
  const { 
    students, 
    currentUser, 
    addStudent, 
    updateStudent, 
    deleteStudent, 
    loginStudent 
  } = useApp();
  
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentAchievements, setStudentAchievements] = useState([]);
  const [studentStats, setStudentStats] = useState({
    totalPoints: 0,
    gamesPlayed: 0,
    timeSpent: 0,
    achievements: 0
  });

  const [newStudent, setNewStudent] = useState({
    name: '',
    grade: '',
    school: '',
    language: 'en'
  });

  // Load student achievements and stats
  useEffect(() => {
    const loadStudentData = async () => {
      if (currentUser) {
        try {
          const achievements = await database.getStudentAchievements(currentUser.id);
          const progress = await database.getStudentProgress(currentUser.id);
          
          setStudentAchievements(achievements);
          
          const stats = {
            totalPoints: achievements.reduce((sum, a) => sum + a.points, 0),
            gamesPlayed: progress.length,
            timeSpent: progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0),
            achievements: achievements.length
          };
          
          setStudentStats(stats);
        } catch (error) {
          console.error('Error loading student data:', error);
        }
      }
    };

    loadStudentData();
  }, [currentUser]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    console.log('Adding student:', newStudent);
    
    // Validate required fields
    if (!newStudent.name.trim()) {
      alert('Please enter a name');
      return;
    }
    if (!newStudent.grade) {
      alert('Please select a grade');
      return;
    }
    if (!newStudent.school.trim()) {
      alert('Please enter a school');
      return;
    }
    
    try {
      const result = await addStudent(newStudent);
      console.log('Student added successfully:', result);
      setNewStudent({ name: '', grade: '', school: '', language: 'en' });
      setIsAddingStudent(false);
      alert('Student added successfully!');
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Error adding student: ' + error.message);
    }
  };

  const handleEditStudent = async (e) => {
    e.preventDefault();
    try {
      await updateStudent(editingStudent.id, editingStudent);
      setEditingStudent(null);
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(studentId);
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const handleSelectStudent = async (student) => {
    try {
      await loginStudent(student.id);
    } catch (error) {
      console.error('Error selecting student:', error);
    }
  };

  const achievements = [
    { id: 'first_game', name: t('achievements.firstGame'), description: 'Complete your first game', points: 10 },
    { id: 'math_master', name: t('achievements.mathMaster'), description: 'Complete 10 math games', points: 50 },
    { id: 'science_explorer', name: t('achievements.scienceExplorer'), description: 'Complete 5 science games', points: 30 },
    { id: 'coding_wizard', name: t('achievements.codingWizard'), description: 'Complete 3 coding games', points: 40 },
    { id: 'logic_genius', name: t('achievements.logicGenius'), description: 'Complete 5 logic games', points: 35 },
    { id: 'perfect_score', name: t('achievements.perfectScore'), description: 'Get 100% in any game', points: 25 }
  ];

  return (
    <ProfileContainer>
      <Header>
        <Title>{t('profile.title')}</Title>
        <Subtitle>Manage students and track their learning progress</Subtitle>
      </Header>

      <ContentGrid>
        <Card
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardHeader>
            <CardTitle>
              <User size={20} />
              Students
            </CardTitle>
            <ActionButton
              variant="primary"
              onClick={() => setIsAddingStudent(true)}
            >
              <Plus size={16} />
              Add Student
            </ActionButton>
          </CardHeader>

          <StudentList>
            {students.map((student) => (
              <StudentItem
                key={student.id}
                isActive={currentUser && currentUser.id === student.id}
                onClick={() => handleSelectStudent(student)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <StudentInfo>
                  <StudentAvatar>
                    {student.name.charAt(0).toUpperCase()}
                  </StudentAvatar>
                  <StudentDetails>
                    <StudentName>{student.name}</StudentName>
                    <StudentMeta>
                      Grade {student.grade} • {student.school}
                    </StudentMeta>
                  </StudentDetails>
                </StudentInfo>
                <StudentActions>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingStudent(student);
                    }}
                  >
                    <Edit size={16} />
                  </IconButton>
                  <IconButton
                    variant="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteStudent(student.id);
                    }}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </StudentActions>
              </StudentItem>
            ))}
          </StudentList>
        </Card>

        <Card
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardHeader>
            <CardTitle>
              <Award size={20} />
              Achievements
            </CardTitle>
          </CardHeader>

          <AchievementsList>
            {achievements.map((achievement) => {
              const unlocked = studentAchievements.find(a => a.achievementId === achievement.id);
              return (
                <AchievementItem key={achievement.id} unlocked={!!unlocked}>
                  <AchievementIcon unlocked={!!unlocked}>
                    <Award size={20} />
                  </AchievementIcon>
                  <AchievementInfo>
                    <AchievementName>{achievement.name}</AchievementName>
                    <AchievementDescription>{achievement.description}</AchievementDescription>
                  </AchievementInfo>
                  {unlocked && (
                    <AchievementPoints>+{achievement.points} pts</AchievementPoints>
                  )}
                </AchievementItem>
              );
            })}
          </AchievementsList>
        </Card>
      </ContentGrid>

      {currentUser && (
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ marginTop: '2rem' }}
        >
          <CardHeader>
            <CardTitle>
              <TrendingUp size={20} />
              {currentUser.name}'s Progress
            </CardTitle>
          </CardHeader>

          <StatsGrid>
            <StatCard>
              <StatIcon>
                <Star size={20} />
              </StatIcon>
              <StatNumber>{studentStats.totalPoints}</StatNumber>
              <StatLabel>{t('profile.totalPoints')}</StatLabel>
            </StatCard>
            <StatCard>
              <StatIcon>
                <BookOpen size={20} />
              </StatIcon>
              <StatNumber>{studentStats.gamesPlayed}</StatNumber>
              <StatLabel>{t('profile.gamesPlayed')}</StatLabel>
            </StatCard>
            <StatCard>
              <StatIcon>
                <Clock size={20} />
              </StatIcon>
              <StatNumber>{Math.round(studentStats.timeSpent / 60)}m</StatNumber>
              <StatLabel>{t('profile.timeSpent')}</StatLabel>
            </StatCard>
            <StatCard>
              <StatIcon>
                <Target size={20} />
              </StatIcon>
              <StatNumber>{studentStats.achievements}</StatNumber>
              <StatLabel>Achievements</StatLabel>
            </StatCard>
          </StatsGrid>
        </Card>
      )}

      {/* Add Student Modal */}
      {isAddingStudent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <Card style={{ maxWidth: '500px', width: '90%' }}>
            <CardHeader>
              <CardTitle>Add New Student</CardTitle>
              <IconButton onClick={() => setIsAddingStudent(false)}>
                <X size={16} />
              </IconButton>
            </CardHeader>
            <Form onSubmit={handleAddStudent}>
              <FormGroup>
                <Label>Name</Label>
                <Input
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Grade</Label>
                <Select
                  value={newStudent.grade}
                  onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                  required
                >
                  <option value="">Select Grade</option>
                  {[6, 7, 8, 9, 10, 11, 12].map(grade => (
                    <option key={grade} value={grade}>Grade {grade}</option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>School</Label>
                <Input
                  value={newStudent.school}
                  onChange={(e) => setNewStudent({ ...newStudent, school: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Language</Label>
                <Select
                  value={newStudent.language}
                  onChange={(e) => setNewStudent({ ...newStudent, language: e.target.value })}
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="kn">ಕನ್ನಡ (Kannada)</option>
                </Select>
              </FormGroup>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <ActionButton onClick={() => setIsAddingStudent(false)}>
                  Cancel
                </ActionButton>
                <ActionButton variant="primary" type="submit">
                  Add Student
                </ActionButton>
              </div>
            </Form>
          </Card>
        </motion.div>
      )}
    </ProfileContainer>
  );
};

export default StudentProfile;









