import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { database } from '../database/database';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentUser, setCurrentUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [games, setGames] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState('student'); // 'student' or 'teacher'

  // Initialize app data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        
        // Load students and games
        const studentsData = await database.getStudents();
        const gamesData = await database.getGames();
        
        setStudents(studentsData);
        setGames(gamesData);
        
        // Load saved user preference
        const savedUser = await database.getSetting('currentUser');
        const savedUserType = await database.getSetting('userType');
        const savedLanguage = await database.getSetting('language');
        
        if (savedUser) {
          setCurrentUser(savedUser);
        }
        
        if (savedUserType) {
          setUserType(savedUserType);
        }
        
        if (savedLanguage) {
          i18n.changeLanguage(savedLanguage);
        }
        
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [i18n]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Student management
  const addStudent = useCallback(async (studentData) => {
    try {
      const newStudent = await database.addStudent(studentData);
      setStudents(prev => [newStudent, ...prev]);
      return newStudent;
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  }, []);

  const updateStudent = useCallback(async (id, updates) => {
    try {
      await database.updateStudent(id, updates);
      setStudents(prev => 
        prev.map(student => 
          student.id === id ? { ...student, ...updates } : student
        )
      );
      
      if (currentUser && currentUser.id === id) {
        setCurrentUser(prev => ({ ...prev, ...updates }));
      }
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }, [currentUser]);

  const deleteStudent = useCallback(async (id) => {
    try {
      await database.deleteStudent(id);
      setStudents(prev => prev.filter(student => student.id !== id));
      
      if (currentUser && currentUser.id === id) {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  }, [currentUser]);

  // User authentication
  const loginStudent = useCallback(async (studentId) => {
    try {
      const student = await database.getStudent(studentId);
      if (student) {
        setCurrentUser(student);
        setUserType('student');
        await database.setSetting('currentUser', student);
        await database.setSetting('userType', 'student');
        return student;
      }
      throw new Error('Student not found');
    } catch (error) {
      console.error('Error logging in student:', error);
      throw error;
    }
  }, []);

  const loginTeacher = useCallback(async (teacherId) => {
    try {
      const teachers = await database.getTeachers();
      const teacher = teachers.find(t => t.id === teacherId);
      if (teacher) {
        setCurrentUser(teacher);
        setUserType('teacher');
        await database.setSetting('currentUser', teacher);
        await database.setSetting('userType', 'teacher');
        return teacher;
      }
      throw new Error('Teacher not found');
    } catch (error) {
      console.error('Error logging in teacher:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setCurrentUser(null);
    await database.setSetting('currentUser', null);
  }, []);

  // Language management
  const changeLanguage = useCallback(async (language) => {
    try {
      await i18n.changeLanguage(language);
      await database.setSetting('language', language);
      
      if (currentUser) {
        await updateStudent(currentUser.id, { language });
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  }, [i18n, currentUser, updateStudent]);

  // Game progress management
  const updateGameProgress = useCallback(async (gameId, progress) => {
    if (!currentUser) return;
    
    try {
      await database.updateGameProgress(currentUser.id, gameId, progress);
      
      // Check for achievements
      await checkAchievements();
    } catch (error) {
      console.error('Error updating game progress:', error);
      throw error;
    }
  }, [currentUser]);

  const checkAchievements = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      const progress = await database.getStudentProgress(currentUser.id);
      const achievements = await database.getStudentAchievements(currentUser.id);
      
      // Check for first game achievement
      if (progress.length >= 1 && !achievements.find(a => a.achievementId === 'first_game')) {
        await database.unlockAchievement(currentUser.id, 'first_game', 10);
      }
      
      // Check for math master achievement
      const mathGames = progress.filter(p => {
        const game = games.find(g => g.id === p.gameId);
        return game && game.category === 'math' && p.completed;
      });
      
      if (mathGames.length >= 10 && !achievements.find(a => a.achievementId === 'math_master')) {
        await database.unlockAchievement(currentUser.id, 'math_master', 50);
      }
      
      // Check for perfect score achievement
      const perfectScores = progress.filter(p => p.score === 100);
      if (perfectScores.length >= 1 && !achievements.find(a => a.achievementId === 'perfect_score')) {
        await database.unlockAchievement(currentUser.id, 'perfect_score', 25);
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  }, [currentUser, games]);

  // Sync management
  const syncData = useCallback(async () => {
    if (!isOnline) return;
    
    try {
      const syncQueue = await database.getSyncQueue();
      
      for (const item of syncQueue) {
        // Here you would implement actual sync logic
        // For now, just mark as synced
        await database.markSynced(item.id);
      }
    } catch (error) {
      console.error('Error syncing data:', error);
    }
  }, [isOnline]);

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline) {
      syncData();
    }
  }, [isOnline, syncData]);

  const value = {
    // State
    currentUser,
    students,
    games,
    isOnline,
    isLoading,
    userType,
    
    // Student management
    addStudent,
    updateStudent,
    deleteStudent,
    
    // Authentication
    loginStudent,
    loginTeacher,
    logout,
    
    // Language
    changeLanguage,
    
    // Game progress
    updateGameProgress,
    
    // Sync
    syncData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};









