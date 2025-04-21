import React, { useState } from 'react'
import { Exercise as ExerciseType } from '@/lib/exercises'
import { getImageSource } from '@/utils/exercise-muscle'
import { Plus, Info, Image as ImageIcon } from 'lucide-react-native'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'

interface ExerciseCardProps {
    exercise: Omit<ExerciseType, "exercise_id">
    index: number
    onInfoPress: () => void
    onAddPress: () => void
}

const Exercise = ({ exercise, index, onInfoPress, onAddPress }: ExerciseCardProps) => {
    const [imageError, setImageError] = useState(false);

    // Create a safe image component that handles errors
    const renderImage = () => {
        if (imageError) {
            return (
                <View style={[styles.image, styles.imageFallback]}>
                    <ImageIcon size={24} color="#666" />
                </View>
            );
        }

        return (
            <Image 
                source={getImageSource(exercise)} 
                style={styles.image} 
                resizeMode='contain'
                onError={() => setImageError(true)}
            />
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.mainRow}>
                {renderImage()}
                
                <View style={styles.textContainer}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.statsText}>
                        {exercise.sets} sets · {exercise.reps} reps
                        {exercise.weight ? ` · ${exercise.weight} lbs` : ''}
                    </Text>
                </View>
                
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity 
                        style={styles.infoButton} 
                        onPress={onInfoPress}
                    >
                        <Info size={18} color="white" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.addButton} 
                        onPress={onAddPress}
                    >
                        <Plus size={18} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#222',
        padding: 12,
        borderRadius: 15,
        marginVertical: 6,
    },
    mainRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 50,
        height: 50,
        marginRight: 12,
    },
    imageFallback: {
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    textContainer: {
        flex: 1,
    },
    exerciseName: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    statsText: {
        color: '#aaa',
        fontSize: 12,
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginLeft: 8,
    },
    infoButton: {
        backgroundColor: '#444',
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    addButton: {
        backgroundColor: '#fff',
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default Exercise