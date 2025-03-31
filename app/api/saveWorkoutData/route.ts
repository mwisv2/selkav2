import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

interface WorkoutData {
  userProfile: {
    name: string;
    age: number;
    weight: number;
    height: number;
    fitnessLevel: string;
    goal: string;
    daysPerWeek: number;
    minsPerDay: number;
    cycleLength: string;
    timeFrame: number;
    equipment: string[];
    equipmentWeights: {
      [key: string]: number[];
    };
    maxes: {
      squat: string;
      bench: string;
      deadlift: string;
      overhead: string;
    };
  };
  generatedWorkouts: {
    id: string;
    title: string;
    description: string;
    duration: string;
    exercises: {
      name: string;
      sets: number;
      reps: number;
      weight?: number;
    }[];
    day: string;
  }[];
  completedWorkouts: {
    id: string;
    completedDate: string;
    title: string;
    description: string;
    duration: string;
    exercises: {
      name: string;
      sets: number;
      reps: number;
      weight?: number;
    }[];
  }[];
  currentWeek: {
    weekNumber: number;
    completedWorkouts: string[];
  };
  onboardingCompleted: boolean;
  lastUpdated: string;
}

export async function POST(request: Request) {
  try {
    const { key, hwid, workoutData } = await request.json();

    if (!key || !hwid || !workoutData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate workout data structure
    const requiredFields = [
      'userProfile',
      'generatedWorkouts',
      'completedWorkouts',
      'currentWeek',
      'onboardingCompleted',
      'lastUpdated'
    ];

    for (const field of requiredFields) {
      if (!(field in workoutData)) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Query Firestore for the key
    const keysRef = collection(db, 'access-keys');
    const q = query(keysRef, where('key', '==', key));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Invalid access key' },
        { status: 401 }
      );
    }

    const keyDoc = querySnapshot.docs[0];
    const keyData = keyDoc.data();

    // Verify HWID matches
    if (keyData.hwid !== hwid) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Update workout data with timestamp
    const updatedWorkoutData = {
      ...workoutData,
      lastUpdated: new Date().toISOString()
    };

    await updateDoc(doc(db, 'access-keys', keyDoc.id), {
      workoutData: updatedWorkoutData
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Workout data saved successfully',
      workoutData: updatedWorkoutData
    });

  } catch (error) {
    console.error('Error saving workout data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 