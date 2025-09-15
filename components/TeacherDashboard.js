import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  BarChart3, 
  Download, 
  Eye, 
  Calendar,
  BookOpen,
  Award,
  Clock,
  Target,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { database } from '../database/database';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DashboardContainer = styled.div`
  max-width: 1200px;
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing['2xl']};
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.lg};
  backdrop-filter: blur(10px);
  text-align: center;
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  background: ${props => props.gradient || props.theme.gradients.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing.lg};
  color: white;
  font-size: 1.5rem;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const StatChange = styled.div`
  font-size: 0.8rem;
  color: ${props => props.positive ? props.theme.colors.success : props.theme.colors.error};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.xs};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing['2xl']};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled(motion.div)`
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
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const StudentsTable = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.lg};
  backdrop-filter: blur(10px);
`;

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  max-width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  padding-left: 2.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: ${props => props.theme.spacing.sm};
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  size: 16;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: ${props => props.theme.colors.background};
`;

const TableHeaderCell = styled.th`
  padding: ${props => props.theme.spacing.md};
  text-align: left;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:hover {
    background: ${props => props.theme.colors.background};
  }
`;

const TableCell = styled.td`
  padding: ${props => props.theme.spacing.md};
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
`;

const StudentName = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const StudentAvatar = styled.div`
  width: 32px;
  height: 32px;
  background: ${props => props.theme.gradients.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: ${props => props.theme.colors.background};
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.theme.gradients.primary};
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-left: ${props => props.theme.spacing.sm};
`;

const SubjectBadge = styled.span`
  display: inline-block;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => props.color || props.theme.colors.background};
  color: white;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 0.7rem;
  font-weight: 500;
  margin-right: ${props => props.theme.spacing.xs};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing['2xl']};
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${props => props.theme.spacing.lg};
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text};
`;

const EmptyDescription = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const TeacherDashboard = () => {
  const { t } = useTranslation();
  const { students, currentUser } = useApp();
  const [classProgress, setClassProgress] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Load class progress data
  useEffect(() => {
    const loadClassProgress = async () => {
      try {
        setIsLoading(true);
        
        // Get progress for all students
        const progressData = [];
        for (const student of students) {
          const progress = await database.getStudentProgress(student.id);
          const achievements = await database.getStudentAchievements(student.id);
          
          const totalPoints = achievements.reduce((sum, a) => sum + a.points, 0);
          const completedGames = progress.filter(p => p.completed).length;
          const totalTimeSpent = progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
          
          // Calculate subject-wise progress
          const subjectProgress = {
            math: 0,
            science: 0,
            coding: 0,
            logic: 0
          };
          
          // Get games for each progress item
          for (const p of progress) {
            const game = await database.getGame(p.gameId);
            if (game) {
              switch (game.category) {
                case 'math':
                  subjectProgress.math++;
                  break;
                case 'science':
                  subjectProgress.science++;
                  break;
                case 'coding':
                  subjectProgress.coding++;
                  break;
                case 'logic':
                  subjectProgress.logic++;
                  break;
              }
            }
          }
          
          progressData.push({
            studentId: student.id,
            studentName: student.name,
            grade: student.grade,
            school: student.school,
            totalPoints,
            completedGames,
            totalTimeSpent,
            achievements: achievements.length,
            subjectProgress,
            lastActive: student.lastActiveAt
          });
        }
        
        setClassProgress(progressData);
      } catch (error) {
        console.error('Error loading class progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClassProgress();
  }, [students]);

  const filteredProgress = classProgress.filter(student => {
    const matchesSearch = student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.school.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalStudents = students.length;
  const totalGamesCompleted = classProgress.reduce((sum, s) => sum + s.completedGames, 0);
  const totalPoints = classProgress.reduce((sum, s) => sum + s.totalPoints, 0);
  const averageProgress = totalStudents > 0 ? Math.round((totalGamesCompleted / (totalStudents * 10)) * 100) : 0;

  // Chart data
  const gradeDistribution = students.reduce((acc, student) => {
    acc[student.grade] = (acc[student.grade] || 0) + 1;
    return acc;
  }, {});

  const gradeChartData = Object.entries(gradeDistribution).map(([grade, count]) => ({
    grade: `Grade ${grade}`,
    students: count
  }));

  const subjectProgressData = [
    { name: 'Math', value: classProgress.reduce((sum, s) => sum + s.subjectProgress.math, 0) },
    { name: 'Science', value: classProgress.reduce((sum, s) => sum + s.subjectProgress.science, 0) },
    { name: 'Coding', value: classProgress.reduce((sum, s) => sum + s.subjectProgress.coding, 0) },
    { name: 'Logic', value: classProgress.reduce((sum, s) => sum + s.subjectProgress.logic, 0) }
  ];

  const COLORS = ['#667eea', '#f093fb', '#4facfe', '#43e97b'];

  const handleExportData = () => {
    const csvData = classProgress.map(student => ({
      Name: student.studentName,
      Grade: student.grade,
      School: student.school,
      'Total Points': student.totalPoints,
      'Games Completed': student.completedGames,
      'Time Spent (minutes)': Math.round(student.totalTimeSpent / 60),
      'Achievements': student.achievements,
      'Last Active': new Date(student.lastActive).toLocaleDateString()
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'class-progress.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <DashboardContainer>
        <div style={{ textAlign: 'center', padding: '4rem', color: 'white' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
          <div>Loading dashboard...</div>
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>{t('teacher.dashboard')}</Title>
        <Subtitle>Monitor student progress and class performance</Subtitle>
      </Header>

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StatIcon gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
            <Users size={24} />
          </StatIcon>
          <StatNumber>{totalStudents}</StatNumber>
          <StatLabel>Total Students</StatLabel>
          <StatChange positive>
            <TrendingUp size={14} />
            +{totalStudents} this month
          </StatChange>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <StatIcon gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
            <BookOpen size={24} />
          </StatIcon>
          <StatNumber>{totalGamesCompleted}</StatNumber>
          <StatLabel>Games Completed</StatLabel>
          <StatChange positive>
            <TrendingUp size={14} />
            +{Math.round(totalGamesCompleted / 7)} this week
          </StatChange>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <StatIcon gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
            <Award size={24} />
          </StatIcon>
          <StatNumber>{totalPoints}</StatNumber>
          <StatLabel>Total Points Earned</StatLabel>
          <StatChange positive>
            <TrendingUp size={14} />
            +{Math.round(totalPoints / 7)} this week
          </StatChange>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <StatIcon gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
            <Target size={24} />
          </StatIcon>
          <StatNumber>{averageProgress}%</StatNumber>
          <StatLabel>Average Progress</StatLabel>
          <StatChange positive>
            <TrendingUp size={14} />
            +5% from last month
          </StatChange>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <ChartCard
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardHeader>
            <CardTitle>
              <BarChart3 size={20} />
              Grade Distribution
            </CardTitle>
          </CardHeader>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gradeChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grade" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardHeader>
            <CardTitle>
              <PieChart size={20} />
              Subject Progress
            </CardTitle>
          </CardHeader>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subjectProgressData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {subjectProgressData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </ContentGrid>

      <StudentsTable
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TableHeader>
          <SearchBox>
            <SearchIcon size={16} />
            <SearchInput
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>
          <ActionButton onClick={handleExportData}>
            <Download size={16} />
            Export Data
          </ActionButton>
        </TableHeader>

        <Table>
          <TableHead>
            <tr>
              <TableHeaderCell>Student</TableHeaderCell>
              <TableHeaderCell>Grade</TableHeaderCell>
              <TableHeaderCell>Progress</TableHeaderCell>
              <TableHeaderCell>Points</TableHeaderCell>
              <TableHeaderCell>Subjects</TableHeaderCell>
              <TableHeaderCell>Last Active</TableHeaderCell>
            </tr>
          </TableHead>
          <TableBody>
            {filteredProgress.map((student) => (
              <TableRow key={student.studentId}>
                <TableCell>
                  <StudentName>
                    <StudentAvatar>
                      {student.studentName.charAt(0).toUpperCase()}
                    </StudentAvatar>
                    <div>
                      <div style={{ fontWeight: '600' }}>{student.studentName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                        {student.school}
                      </div>
                    </div>
                  </StudentName>
                </TableCell>
                <TableCell>Grade {student.grade}</TableCell>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ProgressBar>
                      <ProgressFill progress={Math.min((student.completedGames / 10) * 100, 100)} />
                    </ProgressBar>
                    <ProgressText>{student.completedGames}/10</ProgressText>
                  </div>
                </TableCell>
                <TableCell>{student.totalPoints}</TableCell>
                <TableCell>
                  <div>
                    <SubjectBadge color="#667eea">Math: {student.subjectProgress.math}</SubjectBadge>
                    <SubjectBadge color="#f093fb">Sci: {student.subjectProgress.science}</SubjectBadge>
                    <SubjectBadge color="#4facfe">Code: {student.subjectProgress.coding}</SubjectBadge>
                    <SubjectBadge color="#43e97b">Logic: {student.subjectProgress.logic}</SubjectBadge>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(student.lastActive).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredProgress.length === 0 && (
          <EmptyState>
            <EmptyIcon>👥</EmptyIcon>
            <EmptyTitle>No students found</EmptyTitle>
            <EmptyDescription>
              {searchTerm ? 'Try adjusting your search terms' : 'Add students to get started'}
            </EmptyDescription>
          </EmptyState>
        )}
      </StudentsTable>
    </DashboardContainer>
  );
};

export default TeacherDashboard;



