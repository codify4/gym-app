import { View, Text, ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView } from "react-native"
import { Plus, Trash2, Dumbbell } from "lucide-react-native"
import { bodyParts, Exercise, Routine } from "@/constants/data"
import Input from "@/components/input";

type AddRoutineProps = {
    newRoutine: Partial<Routine>
    setNewRoutine: React.Dispatch<React.SetStateAction<Partial<Routine>>>
    handleAddExercise: () => void
    handleRemoveExercise: (index: number) => void
    handleExerciseChange: (index: number, field: keyof Exercise, value: string | number) => void
    handleSubmit: () => void
}
const AddRoutine = ({ newRoutine, setNewRoutine, handleAddExercise, handleRemoveExercise, handleExerciseChange, handleSubmit }: AddRoutineProps) => {

    const keyboardVerticalOffset = Platform.OS === "ios" ? 50 : 0

    return (
        <KeyboardAvoidingView
          className="w-full mb-10"
          behavior={"padding"}
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          <ScrollView className="px-2" showsVerticalScrollIndicator={false}>
            <Text className="text-center text-white text-2xl font-poppins-semibold mb-2">Add New Routine</Text>

            {/* Routine Name */}
            <View className="mb-6">
              <Text className="text-white text-lg font-poppins-medium mb-2">Routine Name</Text>
              <Input
                value={newRoutine.name!}
                onChangeText={(text) => setNewRoutine((prev) => ({ ...prev, name: text }))}
                placeholder="Enter routine name"
                mode="outlined"
                keyboardType="default"
                focus={false}
              />
            </View>

            {/* Duration */}
            <View className="mb-6">
              <Text className="text-white text-lg font-poppins-medium mb-2">Duration (e.g., 45 min)</Text>
              <Input
                value={newRoutine.duration!}
                onChangeText={(text) => setNewRoutine((prev) => ({ ...prev, duration: text }))}
                placeholder="Enter duration"
                mode="outlined"
                keyboardType="numeric"
                focus={false}
              />
            </View>

            {/* Body Part Selection */}
            <View className="mb-6">
              <Text className="text-white text-lg font-poppins-medium mb-2">Target Body Part</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {bodyParts.map((part, index) => (
                  <TouchableOpacity
                    key={index}
                    className={`mr-2 px-6 py-2 rounded-full ${newRoutine.bodyPart === part.name ? "bg-white" : "bg-neutral-800"}`}
                    onPress={() => setNewRoutine((prev) => ({ ...prev, bodyPart: part.name }))}
                  >
                    <Text className={`text-lg font-poppins-medium ${newRoutine.bodyPart === part.name ? "text-black" : "text-white"}`}>{part.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Exercises */}
            <View className="mb-6">
              <Text className="text-white text-lg font-poppins-medium mb-2">Exercises</Text>
              {newRoutine.exercises?.map((exercise, index) => (
                <View key={index} className="bg-neutral-800 p-5 rounded-3xl mb-2">
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-white text-xl font-poppins-medium">Exercise {index + 1}</Text>
                    <TouchableOpacity onPress={() => handleRemoveExercise(index)} className="bg-red-500/20 p-2 rounded-xl">
                      <Trash2 size={20} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                  <Input
                    value={exercise.name!}
                    onChangeText={(text) => handleExerciseChange(index, "name", text)}
                    placeholder="Enter exercise name"
                    mode="outlined"
                    keyboardType="default"
                    focus={false}
                  />
                  <View className="flex-row gap-3 mt-3">
                    <Input
                      value={exercise.sets.toString()}
                      onChangeText={(text) => handleExerciseChange(index, "sets", Number.parseInt(text) || 0)}
                      placeholder="Enter sets"
                      mode="outlined"
                      keyboardType="numeric"
                      focus={false}
                      moreStyles={{ width: '48%' }}
                    />
                    <Input
                      value={exercise.reps.toString()}
                      onChangeText={(text) => handleExerciseChange(index, "reps", Number.parseInt(text) || 0)}
                      placeholder="Enter reps"
                      mode="outlined"
                      keyboardType="numeric"
                      focus={false}
                      moreStyles={{ width: '48%' }}
                    />
                  </View>
                </View>
              ))}
              <TouchableOpacity
                onPress={handleAddExercise}
                className="bg-neutral-800 border border-white p-4 rounded-full items-center mt-2 flex-row justify-center"
              >
                <Plus size={20} color="white" className="mr-2" />
                <Text className="text-white text-lg font-poppins-semibold">Add Exercise</Text>
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity onPress={handleSubmit} className="bg-white p-5 rounded-full items-center mb-8 flex-row justify-center gap-2">
              <Dumbbell size={20} color="black" />
              <Text className="text-black text-xl font-poppins-semibold">Create Routine</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
    )
}
export default AddRoutine