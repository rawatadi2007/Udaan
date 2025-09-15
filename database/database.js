import Dexie from 'dexie';

class RuralSTEMDatabase extends Dexie {
  constructor() {
    super('RuralSTEMDatabase');
    
    this.version(1).stores({
      students: '++id, name, grade, school, language, createdAt, lastActiveAt',
      games: '++id, title, category, difficulty, language, content, createdAt',
      gameProgress: '++id, studentId, gameId, level, score, completed, timeSpent, lastPlayedAt',
      achievements: '++id, studentId, achievementId, unlockedAt, points',
      teacherProfiles: '++id, name, school, email, createdAt',
      classProgress: '++id, teacherId, studentId, subject, progress, lastUpdated',
      settings: '++id, key, value, updatedAt',
      syncQueue: '++id, type, data, status, createdAt, syncedAt'
    });

    this.version(2).stores({
      students: '++id, name, grade, school, language, createdAt, lastActiveAt',
      games: '++id, title, category, difficulty, language, content, createdAt',
      gameProgress: '++id, studentId, gameId, [studentId+gameId], level, score, completed, timeSpent, lastPlayedAt',
      achievements: '++id, studentId, achievementId, [studentId+achievementId], unlockedAt, points',
      teacherProfiles: '++id, name, school, email, createdAt',
      classProgress: '++id, teacherId, studentId, [teacherId+studentId], subject, progress, lastUpdated',
      settings: '++id, key, value, updatedAt',
      syncQueue: '++id, type, data, status, createdAt, syncedAt'
    });

    // Define relationships
    this.students.hook('creating', function (primKey, obj, trans) {
      obj.createdAt = new Date();
      obj.lastActiveAt = new Date();
    });

    this.gameProgress.hook('creating', function (primKey, obj, trans) {
      obj.lastPlayedAt = new Date();
    });

    this.classProgress.hook('creating', function (primKey, obj, trans) {
      obj.lastUpdated = new Date();
    });
  }
}

const db = new RuralSTEMDatabase();

// Initialize database with sample data
export async function initDatabase() {
  try {
    console.log('Initializing database...');
    
    // Check if database is already initialized
    const settings = await db.settings.get('initialized');
    console.log('Database settings:', settings);
    
    if (settings && settings.value) {
      console.log('Database already initialized');
      return;
    }

    // Initialize with sample data
    console.log('Seeding database...');
    await seedDatabase();
    
    // Mark as initialized
    await db.settings.put({
      key: 'initialized',
      value: true,
      updatedAt: new Date()
    });

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

async function seedDatabase() {
  // Sample students
  await db.students.bulkPut([
    {
      id: 1,
      name: 'राम शर्मा',
      grade: '6',
      school: 'ग्रामीण विद्यालय, महाराष्ट्र',
      language: 'hi',
      createdAt: new Date(),
      lastActiveAt: new Date()
    },
    {
      id: 2,
      name: 'Priya Patel',
      grade: '8',
      school: 'Rural High School, Karnataka',
      language: 'en',
      createdAt: new Date(),
      lastActiveAt: new Date()
    },
    {
      id: 3,
      name: 'ಸುಮನ್ ಕುಮಾರ್',
      grade: '7',
      school: 'ಗ್ರಾಮೀಣ ಶಾಲೆ, ಕರ್ನಾಟಕ',
      language: 'kn',
      createdAt: new Date(),
      lastActiveAt: new Date()
    }
  ]);

  // Sample games
  await db.games.bulkPut([
    {
      id: 1,
      title: 'Math Adventure',
      category: 'math',
      difficulty: 'beginner',
      language: 'en',
      content: {
        description: 'Learn basic arithmetic through adventure',
        levels: 10,
        type: 'adventure'
      },
      createdAt: new Date()
    },
    {
      id: 2,
      title: 'गणित का सफर',
      category: 'math',
      difficulty: 'beginner',
      language: 'hi',
      content: {
        description: 'रोमांचक कहानी के साथ गणित सीखें',
        levels: 10,
        type: 'adventure'
      },
      createdAt: new Date()
    },
    {
      id: 3,
      title: 'Science Lab',
      category: 'science',
      difficulty: 'intermediate',
      language: 'en',
      content: {
        description: 'Virtual science experiments',
        levels: 15,
        type: 'simulation'
      },
      createdAt: new Date()
    },
    {
      id: 4,
      title: 'Coding Basics',
      category: 'coding',
      difficulty: 'beginner',
      language: 'en',
      content: {
        description: 'Learn programming fundamentals',
        levels: 20,
        type: 'interactive'
      },
      createdAt: new Date()
    }
  ]);

  // Sample achievements
  const achievements = [
    { id: 'first_game', name: 'First Game', description: 'Complete your first game', points: 10 },
    { id: 'math_master', name: 'Math Master', description: 'Complete 10 math games', points: 50 },
    { id: 'science_explorer', name: 'Science Explorer', description: 'Complete 5 science games', points: 30 },
    { id: 'coding_wizard', name: 'Coding Wizard', description: 'Complete 3 coding games', points: 40 },
    { id: 'perfect_score', name: 'Perfect Score', description: 'Get 100% in any game', points: 25 }
  ];

  // Sample teacher profiles
  await db.teacherProfiles.bulkPut([
    {
      id: 1,
      name: 'श्रीमती सुनीता देशमुख',
      school: 'ग्रामीण विद्यालय, महाराष्ट्र',
      email: 'sunita@ruralschool.edu',
      createdAt: new Date()
    },
    {
      id: 2,
      name: 'Mr. Rajesh Kumar',
      school: 'Rural High School, Karnataka',
      email: 'rajesh@ruralschool.edu',
      createdAt: new Date()
    }
  ]);
}

// Database operations
export const database = {
  // Student operations
  async getStudents() {
    return await db.students.orderBy('lastActiveAt').reverse().toArray();
  },

  async getStudent(id) {
    return await db.students.get(id);
  },

  async addStudent(student) {
    return await db.students.add(student);
  },

  async updateStudent(id, updates) {
    return await db.students.update(id, updates);
  },

  async deleteStudent(id) {
    return await db.students.delete(id);
  },

  // Game operations
  async getGames(category = null, language = 'en') {
    let query = db.games.where('language').equals(language);
    if (category) {
      query = query.and(game => game.category === category);
    }
    return await query.toArray();
  },

  async getGame(id) {
    return await db.games.get(id);
  },

  // Progress operations
  async getStudentProgress(studentId) {
    return await db.gameProgress.where('studentId').equals(studentId).toArray();
  },

  async updateGameProgress(studentId, gameId, progress) {
    const existing = await db.gameProgress
      .where('[studentId+gameId]')
      .equals([studentId, gameId])
      .first();

    if (existing) {
      return await db.gameProgress.update(existing.id, {
        ...progress,
        lastPlayedAt: new Date()
      });
    } else {
      return await db.gameProgress.add({
        studentId,
        gameId,
        ...progress,
        lastPlayedAt: new Date()
      });
    }
  },

  // Achievement operations
  async getStudentAchievements(studentId) {
    return await db.achievements.where('studentId').equals(studentId).toArray();
  },

  async unlockAchievement(studentId, achievementId, points = 0) {
    const existing = await db.achievements
      .where('[studentId+achievementId]')
      .equals([studentId, achievementId])
      .first();

    if (!existing) {
      return await db.achievements.add({
        studentId,
        achievementId,
        points,
        unlockedAt: new Date()
      });
    }
    return existing;
  },

  // Teacher operations
  async getTeachers() {
    return await db.teacherProfiles.toArray();
  },

  async getClassProgress(teacherId) {
    return await db.classProgress.where('teacherId').equals(teacherId).toArray();
  },

  // Settings operations
  async getSetting(key) {
    const setting = await db.settings.get(key);
    return setting ? setting.value : null;
  },

  async setSetting(key, value) {
    return await db.settings.put({
      key,
      value,
      updatedAt: new Date()
    });
  },

  // Sync operations
  async addToSyncQueue(type, data) {
    return await db.syncQueue.add({
      type,
      data,
      status: 'pending',
      createdAt: new Date()
    });
  },

  async getSyncQueue() {
    return await db.syncQueue.where('status').equals('pending').toArray();
  },

  async markSynced(id) {
    return await db.syncQueue.update(id, {
      status: 'synced',
      syncedAt: new Date()
    });
  }
};

export default db;









