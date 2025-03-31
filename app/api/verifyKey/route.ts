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
    experienceLevel: string;
    injuries: string[];
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
    workouts: {
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
    }[];
  };
  onboardingCompleted: boolean;
  lastUpdated: string;
}

export async function POST(request: Request) {
  try {
    const { key, hwid, workoutData } = await request.json();

    if (!key || !hwid) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
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

    // Check if key is active
    if (!keyData.isActive) {
      return NextResponse.json(
        { error: 'Access key is not active' },
        { status: 403 }
      );
    }

    // If no HWID is assigned or it's an empty string, this is a new activation
    if (!keyData.hwid || keyData.hwid === '') {
      // Create new workout data with empty completed workouts
      const newWorkoutData = {
        userProfile: {
          name: '',
          age: 0,
          weight: 0,
          height: 0,
          fitnessLevel: 'beginner',
          goal: '',
          daysPerWeek: 3,
          minsPerDay: 45,
          cycleLength: '1',
          timeFrame: 0,
          equipment: ['No Equipment (Bodyweight only)'],
          equipmentWeights: {},
          maxes: {
            squat: '0',
            bench: '0',
            deadlift: '0',
            overhead: '0'
          },
          experienceLevel: 'beginner',
          injuries: []
        },
        generatedWorkouts: [],
        completedWorkouts: [],
        currentWeek: {
          weekNumber: 1,
          completedWorkouts: [],
          workouts: []
        },
        onboardingCompleted: false,
        lastUpdated: new Date().toISOString()
      };

      // Update the access key with new HWID and workout data
      await updateDoc(doc(db, 'access-keys', keyDoc.id), {
        hwid: hwid,
        lastUsed: new Date().toISOString(),
        workoutData: newWorkoutData
      });

      // Return success with the new workout data
      return NextResponse.json({ 
        success: true, 
        message: 'Key activated and workout data saved',
        workoutData: newWorkoutData,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      });
    }

    // If HWID exists, verify it matches (this is a login)
    if (keyData.hwid === hwid) {
      // If workoutData is provided, update it with proper validation
      if (workoutData) {
        const updatedWorkoutData: WorkoutData = {
          userProfile: {
            name: workoutData.userProfile?.name || keyData.workoutData?.userProfile?.name || "",
            age: Number(workoutData.userProfile?.age) || Number(keyData.workoutData?.userProfile?.age) || 0,
            weight: Number(workoutData.userProfile?.weight) || Number(keyData.workoutData?.userProfile?.weight) || 0,
            height: Number(workoutData.userProfile?.height) || Number(keyData.workoutData?.userProfile?.height) || 0,
            fitnessLevel: workoutData.userProfile?.fitnessLevel || keyData.workoutData?.userProfile?.fitnessLevel || "",
            goal: workoutData.userProfile?.goal || keyData.workoutData?.userProfile?.goal || "",
            daysPerWeek: Number(workoutData.userProfile?.daysPerWeek) || Number(keyData.workoutData?.userProfile?.daysPerWeek) || 3,
            minsPerDay: Number(workoutData.userProfile?.minsPerDay) || Number(keyData.workoutData?.userProfile?.minsPerDay) || 45,
            cycleLength: workoutData.userProfile?.cycleLength || keyData.workoutData?.userProfile?.cycleLength || "1",
            timeFrame: Number(workoutData.userProfile?.timeFrame) || Number(keyData.workoutData?.userProfile?.timeFrame) || 0,
            equipment: workoutData.userProfile?.equipment || keyData.workoutData?.userProfile?.equipment || ["No Equipment (Bodyweight only)"],
            equipmentWeights: workoutData.userProfile?.equipmentWeights || keyData.workoutData?.userProfile?.equipmentWeights || {},
            maxes: {
              squat: workoutData.userProfile?.maxes?.squat || keyData.workoutData?.userProfile?.maxes?.squat || "",
              bench: workoutData.userProfile?.maxes?.bench || keyData.workoutData?.userProfile?.maxes?.bench || "",
              deadlift: workoutData.userProfile?.maxes?.deadlift || keyData.workoutData?.userProfile?.maxes?.deadlift || "",
              overhead: workoutData.userProfile?.maxes?.overhead || keyData.workoutData?.userProfile?.maxes?.overhead || ""
            },
            experienceLevel: workoutData.userProfile?.experienceLevel || keyData.workoutData?.userProfile?.experienceLevel || "beginner",
            injuries: workoutData.userProfile?.injuries || keyData.workoutData?.userProfile?.injuries || []
          },
          generatedWorkouts: workoutData.generatedWorkouts || keyData.workoutData?.generatedWorkouts || [],
          completedWorkouts: workoutData.completedWorkouts || keyData.workoutData?.completedWorkouts || [],
          currentWeek: {
            weekNumber: workoutData.currentWeek?.weekNumber || keyData.workoutData?.currentWeek?.weekNumber || 1,
            completedWorkouts: workoutData.currentWeek?.completedWorkouts || keyData.workoutData?.currentWeek?.completedWorkouts || [],
            workouts: workoutData.currentWeek?.workouts || keyData.workoutData?.currentWeek?.workouts || []
          },
          onboardingCompleted: workoutData.onboardingCompleted || keyData.workoutData?.onboardingCompleted || false,
          lastUpdated: new Date().toISOString()
        };

        await updateDoc(doc(db, 'access-keys', keyDoc.id), {
          workoutData: updatedWorkoutData
        });

        return NextResponse.json({ 
          success: true, 
          message: 'Access granted',
          workoutData: updatedWorkoutData,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        });
      }

      // If no workoutData provided, return existing data
      return NextResponse.json({ 
        success: true, 
        message: 'Access granted',
        workoutData: keyData.workoutData || null,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      });
    }

    // If HWID doesn't match, access denied
    return NextResponse.json(
      { error: 'Access key is already in use on another device' },
      { status: 403 }
    );

  } catch (error) {
    console.error('Error verifying key:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 